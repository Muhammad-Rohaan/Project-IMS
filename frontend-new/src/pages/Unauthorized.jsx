// src/pages/Unauthorized.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
    const navigate = useNavigate();
    const goBack = () => navigate(-1);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br 
         from-slate-900 via-blue-950 to-slate-900 p-4">
            <div className="text-center p-12 bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl 
                border border-red-500/30 max-w-lg">
                <h1 className="text-6xl font-extrabold bg-gradient-to-r from-red-500 to-pink-500 
                    bg-clip-text text-transparent mb-6">
                    403
                </h1>

                <h2 className="text-3xl font-bold text-white mb-4">Access Denied</h2>

                <p className="text-lg text-gray-300 mb-8">You Dont have access to this page.<br />
                    Please contact Admin.
                </p>

                <button
                    onClick={goBack}
                    className="py-4 px-8 text-lg font-semibold rounded-2xl text-white 
                    bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 
                    shadow-2xl hover:shadow-red-500/50 transition-all duration-300"
                >
                    Go Back
                </button>
            </div>
        </div>
    );
};

export default Unauthorized;
