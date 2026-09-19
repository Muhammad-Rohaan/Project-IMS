import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import axiosInstance from '../../api/axios.js';
import toast from 'react-hot-toast';

const PostAnnouncementModal = ({ onClose, onCreated, createdBy }) => {
    const [form, setForm] = useState({
        title: '',
        message: '',
        target: 'all',
        className: ''
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.title || !form.message) {
            toast.error('Please fill all required fields.');
            return;
        }

        if (form.target === 'specific-class' && !form.className) {
            toast.error('Please enter class name.');
            return;
        }

        setLoading(true);
        const toastId = toast.loading('Posting announcement...');

        try {
            const payload = {
                ...form,
                createdBy,
                className: form.target === 'all' ? 'N/A' : form.className
            };

            const res = await axiosInstance.post(
                '/announcement/create-new-announcement',
                payload
            );

            toast.success('Announcement posted!', { id: toastId });
            onCreated && onCreated(res.data.newAnnouncement);
            onClose();

        } catch (err) {
            toast.error('Failed to post announcement.', { id: toastId });
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center 
            bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        >
            {/* Modal Box */}
            <div
                className="w-full max-w-lg mx-4 rounded-2xl 
                bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900
                border border-white/10 shadow-2xl p-6"
                onClick={(e) => e.stopPropagation()}
            >

                {/* Header */}
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-xl font-bold text-white">
                        📢 Post Announcement
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white"
                    >
                        ✕
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">

                    <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="Title"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white resize-none placeholder-gray-500"
                    />

                    <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Message"
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white resize-none placeholder-gray-500"
                    />

                    <select
                        name="target"
                        value={form.target}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/10 text-white"
                    >
                        <option value="all">All</option>
                        <option value="specific-class">Specific Class</option>
                    </select>

                    {form.target === 'specific-class' && (
                        <input
                            name="className"
                            value={form.className}
                            onChange={handleChange}
                            placeholder="Class Name"
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white"
                        />
                    )}

                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl border border-gray-600 text-white"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 rounded-xl 
                            bg-gradient-to-r from-pink-600 to-red-600 text-white"
                        >
                            {loading ? 'Posting...' : 'Post'}
                        </button>
                    </div>

                </form>
            </div>
        </div>,
        document.body
    );
};

export default PostAnnouncementModal;