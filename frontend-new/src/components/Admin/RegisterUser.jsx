import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';
import axiosInstance from '../../api/axios.js';

const RegisterUser = ({ onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        role: 'admin'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Registering user...');
        setLoading(true);
        try {
            const res = await axiosInstance.post('/admin/register-user', {
                fullName: formData.fullName.trim(),
                email: formData.email.trim(),
                password: formData.password,
                role: formData.role
            });
            toast.success(res.data.message || 'User registered', { id: toastId });
            if (onSuccess) onSuccess(res.data);
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed', { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return createPortal(
        <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onClick={onClose}
        >
            <div
                className="bg-blue-950/90 backdrop-blur-xl rounded-3xl border border-blue-400/40 p-8 w-full max-w-3xl mx-4 my-8 shadow-2xl max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                <h2 id="modal-title" className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-sky-500 bg-clip-text text-transparent mb-8 text-center">
                    Register User
                </h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input name="fullName" type="text" required placeholder="Full Name" value={formData.fullName} onChange={handleChange} className="input-style" aria-label="Full Name" />
                    <input name="email" type="email" required placeholder="Email" value={formData.email} onChange={handleChange} className="input-style" aria-label="Email Address" />
                    <input name="password" type="password" required placeholder="Password" value={formData.password} onChange={handleChange} className="input-style" aria-label="Password" />

                    <select name="role" value={formData.role} onChange={handleChange} className="input-style" aria-label="User Role">
                        <option value="admin">Admin</option>
                        <option value="receptionist">Receptionist</option>
                        <option value="teacher">Teacher</option>
                        <option value="student">Student</option>
                    </select>

                    <div className="md:col-span-2 flex gap-4 pt-6">
                        <button type="submit" disabled={loading} className="flex-1 py-4 bg-gradient-to-r from-sky-600 to-blue-600 rounded-xl text-white font-bold hover:shadow-lg transition">
                            {loading ? 'Registering…' : 'Register'}
                        </button>
                        <button type="button" onClick={onClose} className="flex-1 py-4 bg-gray-700/50 rounded-xl text-white hover:bg-gray-600/50 transition">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default RegisterUser;