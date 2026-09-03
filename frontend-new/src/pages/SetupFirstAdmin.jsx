import React, { useState } from 'react';
import axiosInstance from '../api/axios.js';

const SetupFirstAdmin = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);
        try {
            const res = await axiosInstance.post('/setup/register-first-admin', {
                fullName: formData.fullName.trim(),
                email: formData.email.trim(),
                password: formData.password
            });
            setResult(res.data);
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.error || 'Setup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-4">
            <div className="w-full max-w-lg p-10 space-y-8 bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-blue-400/20">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 via-sky-500 to-pink-500 bg-clip-text text-transparent">
                        Setup First Admin
                    </h1>
                    <p className="text-sm text-gray-300">
                        Yeh route sirf first admin create karne ke liye hai. Agar admin already exist ho, backend 403 return karega.
                    </p>
                </div>

                {error && (
                    <div className="p-4 text-sm text-red-300 bg-red-900/30 rounded-2xl border border-red-500/40">
                        {error}
                    </div>
                )}

                {result && (
                    <pre className="text-sm text-gray-300 bg-black/30 p-4 rounded-2xl overflow-x-auto border border-blue-400/10">
                        {JSON.stringify(result, null, 2)}
                    </pre>
                )}

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <input
                        name="fullName"
                        type="text"
                        required
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="input-style w-full"
                    />
                    <input
                        name="email"
                        type="email"
                        required
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="input-style w-full"
                    />
                    <input
                        name="password"
                        type="password"
                        required
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="input-style w-full"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 px-6 text-lg font-semibold rounded-2xl text-white bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 shadow-2xl transition-all duration-300"
                    >
                        {loading ? 'Creating…' : 'Create Admin'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SetupFirstAdmin;
