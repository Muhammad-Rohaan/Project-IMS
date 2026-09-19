import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { auth } = useAuth();

    // Jab tak auth load ho raha hai
    if (auth.loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
                Loading...
            </div>
        );
    }

    // Login nahi hai
    if (!auth.user) {
        return <Navigate to="/login" replace />;
    }

    // Role required hai aur match nahi ho raha
    if (requiredRole && auth.user.role !== requiredRole) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;
