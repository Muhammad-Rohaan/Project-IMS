import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { loginUser } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ loginInput: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Logging in...');
        setLoading(true);

        try {
            const result = await loginUser(formData);
            console.log("Login Result:", result);

            if (result.success) {
                const displayName = result.user.fullName || result.user.name || 'User';
                toast.success(`Welcome back, ${displayName}!`, { id: toastId });
                const role = result.user.role;
                switch (role) {
                    case 'admin':
                        navigate('/admin/dashboard');
                        break;
                    case 'receptionist':
                        navigate('/reception/dashboard');
                        break;
                    case 'teacher':
                        navigate('/teacher/dashboard');
                        break;
                    case 'student':
                        navigate('/student/dashboard');
                        break;
                    default:
                        navigate('/');
                }
            } else {
                toast.error(result.message || "Login failed", { id: toastId });
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen w-full bg-gradient-to-br
         from-blue-50 via-white to-sky-100 p-4">
            <div className="w-full max-w-md p-10 space-y-8 bg-white/80 backdrop-blur-xl rounded-3xl
                shadow-2xl shadow-blue-200/60 border border-blue-200 hover:border-blue-400 transition-all
                duration-500 animate-fade-in">
                <div className="text-center">
                    <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-700 to-sky-500
                        flex items-center justify-center shadow-lg shadow-blue-300/50">
                        <svg className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3L2 9l10 6 10-6-10-6zM4 11v6c0 1 3.5 3 8 3s8-2 8-3v-6" />
                        </svg>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide bg-gradient-to-r from-blue-800 via-blue-600 to-sky-500
                        bg-clip-text text-transparent">
                        The Fort Of Science And Commerce Education
                    </h1>
                    <p className="mt-3 text-sm text-blue-700/70">Sign in to access your dashboard</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-5">
                        <div>
                            <label htmlFor="loginInput" className="block text-sm font-medium text-blue-900">
                                Email or ID
                            </label>
                            <input
                                autoFocus
                                id="loginInput"
                                name="loginInput"
                                type="text"
                                required
                                className="mt-2 block w-full px-5 py-4 bg-white text-blue-950 placeholder-blue-300
                                border border-blue-300 rounded-2xl focus:ring-4 focus:ring-blue-200
                                focus:border-blue-500 outline-none transition-all"
                                placeholder="admin@example.com"
                                value={formData.loginInput}
                                onChange={handleChange}
                                aria-label="Email or ID"
                                aria-required="true"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-blue-900">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="mt-2 block w-full px-5 py-4 bg-white text-blue-950 placeholder-blue-300
                                border border-blue-300 rounded-2xl focus:ring-4 focus:ring-blue-200
                                focus:border-blue-500 outline-none transition-all"
                                value={formData.password}
                                onChange={handleChange}
                                aria-label="Password"
                                aria-required="true"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        id="submitBtn"
                        disabled={loading}
                        className="w-full py-4 px-6 text-lg font-semibold rounded-2xl text-white
                        bg-gradient-to-r from-blue-700 to-sky-500 hover:from-blue-800 hover:to-sky-600
                        shadow-xl hover:shadow-blue-500/50 transition-all duration-300 active:scale-95 disabled:opacity-60"
                        aria-live="polite"
                    >
                        {loading ? 'Signing in…' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
