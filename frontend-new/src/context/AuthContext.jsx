import { createContext, useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import axiosInstance from '../api/axios.js';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        user: null,
        role: null,
        loading: true // Initial load k liyey true hai.
    });

    // Page load pe localStorage se user load karo
    useEffect(() => {
        const loadUser = () => {
            const storedUser = localStorage.getItem('userInfo');
            if (storedUser) {
                try {
                    const user = JSON.parse(storedUser);
                    setAuth({
                        user,
                        role: user.role,
                        loading: false
                    });
                } catch {
                    localStorage.removeItem('userInfo');
                    setAuth({
                        user: null,
                        role: null,
                        loading: false
                    });
                }
            } else {
                setAuth({
                    user: null,
                    role: null,
                    loading: false
                });
            }
        };

        loadUser();
    }, []);

    const loginUser = async (loginData) => {
        try {
            // ... (Payload creation logic) ...

            const payload = {};
            if (loginData.loginInput.includes('@')) {
                payload.email = loginData.loginInput;
            }
            else {
                payload.identifier = loginData.loginInput;
            }
            payload.password = loginData.password;

            const response = await axiosInstance.post('/auth/login', payload);

            const { user } = response.data;

            // User details LocalStorage mein save karein (Cookie khud manage ho jayegi)
            localStorage.setItem('userInfo', JSON.stringify(user));

            // State update
            setAuth({
                user, // set actual user here 
                role: user.role, // set role
                loading: false
            });

            return {
                success: true,
                user,   // return user object
                message: "Login successful"
            };

        } catch (error) {
            // ... (Error handling logic) ...
            console.error("Login error", error);
            return {
                success: false,
                message: error.response?.data?.message || "Login failed"
            };
        }
    };

    const logoutUser = async () => {
        try {
            // Backend ko call karein taake woh HTTP-only cookie delete kare
            await axiosInstance.get('/auth/logout');
            toast.success('Logged out successfully');
        } catch (err) {
            console.warn("Logout request failed (Server/Cookie issue)", err);
        } finally {
            localStorage.removeItem('userInfo'); // local state clear
            setAuth({
                user: null,
                role: null,
                loading: false
            });
            // Navigate ko yahan nahi kar sakte — isliye Login page pe redirect component se karenge
        }
    };

    return (
        <AuthContext.Provider value={{ auth, loginUser, logoutUser }}>
            {children}
            {/* Ye {!auth.loading && children} hata diya — blank screen nahi aayega */}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
