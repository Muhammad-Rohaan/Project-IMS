import React, { useState } from 'react';
import axiosInstance from '../api/axios';
import { toast } from 'react-hot-toast';
import { KeyRound, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';

const ChangePassword = () => {
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            return toast.error("New passwords do not match!");
        }

        if (formData.newPassword.length < 6) {
            return toast.error("New password must be at least 6 characters long");
        }

        setLoading(true);
        try {
            const response = await axiosInstance.put('/auth/change-password', {
                oldPassword: formData.oldPassword,
                newPassword: formData.newPassword,
                confirmPassword: formData.confirmPassword
            });

            if (response.data.success) {
                toast.success(response.data.message);
                setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
            }
        } catch (error) {
            console.error("Change Password Error:", error);
            toast.error(error.response?.data?.message || "Failed to change password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-blue-950/50 backdrop-blur-md rounded-3xl border border-blue-400/30 p-8 shadow-2xl relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-sky-600/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-gradient-to-br from-sky-600/20 to-blue-600/20 rounded-2xl border border-blue-400/20">
                            <ShieldCheck className="w-8 h-8 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-sky-500 bg-clip-text text-transparent">
                                Update Security
                            </h2>
                            <p className="text-gray-400 text-sm mt-1">Manage your account password and security settings</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                            {/* Old Password */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-300 ml-1">
                                    Current Password
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <KeyRound className="w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                                    </div>
                                    <input
                                        type={showOldPassword ? "text" : "password"}
                                        name="oldPassword"
                                        value={formData.oldPassword}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-blue-900/40 border border-blue-400/20 rounded-2xl py-3 pl-12 pr-12 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 transition-all backdrop-blur-sm"
                                        placeholder="Enter current password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowOldPassword(!showOldPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-blue-400 transition-colors"
                                    >
                                        {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* New Password */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-300 ml-1">
                                        New Password
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <KeyRound className="w-5 h-5 text-gray-500 group-focus-within:text-sky-400 transition-colors" />
                                        </div>
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            name="newPassword"
                                            value={formData.newPassword}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-blue-900/40 border border-sky-400/20 rounded-2xl py-3 pl-12 pr-12 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-400/50 transition-all backdrop-blur-sm"
                                            placeholder="Min. 6 chars"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-sky-400 transition-colors"
                                        >
                                            {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm Password */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-300 ml-1">
                                        Confirm Password
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <ShieldCheck className="w-5 h-5 text-gray-500 group-focus-within:text-emerald-400 transition-colors" />
                                        </div>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-blue-900/40 border border-emerald-400/20 rounded-2xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400/50 transition-all backdrop-blur-sm"
                                            placeholder="Repeat password"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-sky-500/20 hover:shadow-blue-500/30 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        <span>Updating Password...</span>
                                    </>
                                ) : (
                                    <>
                                        <ShieldCheck className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                        <span>Save Changes</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Security Tip */}
            <div className="mt-6 p-4 bg-blue-950/30 backdrop-blur-sm rounded-2xl border border-white/5 flex items-start gap-3">
                <div className="mt-1 p-1 bg-amber-500/10 rounded-md">
                    <ShieldCheck className="w-4 h-4 text-amber-500" />
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                    <span className="text-amber-500 font-semibold">Security Tip:</span> Use a combination of uppercase letters, numbers, and special characters to create a strong password. Avoid using common words or personal information.
                </p>
            </div>
        </div>
    );
};

export default ChangePassword;
