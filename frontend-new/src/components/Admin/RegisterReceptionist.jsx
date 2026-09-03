import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';
import axiosInstance from '../../api/axios.js';

const RegisterReceptionist = ({ onClose, receptionist, onSuccess }) => {
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        fullName: receptionist?.receptionistFullName || '',
        email: receptionist?.userId?.email || '',
        password: '',
        receptionRegId: receptionist?.receptionRegId || '',
        cnic: receptionist?.cnic || '',
        salary: receptionist?.salary || '',
        joiningDate: receptionist?.joiningDate?.slice(0, 10) || '',
        contact: receptionist?.contact || '',
        address: receptionist?.address || ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Registering receptionist...');
        setLoading(true);

        try {
            const dataToSend = {
                fullName: formData.fullName.trim(),
                email: formData.email.trim(),
                password: formData.password,
                receptionRegId: formData.receptionRegId.trim(),
                cnic: formData.cnic.trim(),
                salary: Number(formData.salary),
                joiningDate: formData.joiningDate,
                contact: formData.contact.trim(),
                address: formData.address.trim()
            };

            const response = await axiosInstance.post('/admin/az-reception/register-receptionist', dataToSend);
            toast.success(response.data.message || "Receptionist registered successfully!", { id: toastId });
            onClose();
            if (onSuccess) onSuccess();

        } catch (err) {
            console.error("Registration error:", err);
            const msg = err.response?.data?.message || 'Registration failed';
            toast.error('Error: ' + msg, { id: toastId });
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
                    Register New Receptionist
                </h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input name="fullName" type="text" required placeholder="Full Name" value={formData.fullName} onChange={handleChange} className="input-style" aria-label="Full Name" />
                    <input name="email" type="email" required placeholder="Email" value={formData.email} onChange={handleChange} className="input-style" aria-label="Email Address" />
                    <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} className="input-style" aria-label="Password" />
                    <input name="receptionRegId" type="text" required placeholder="Reg ID (e.g. USMN456)" value={formData.receptionRegId} onChange={handleChange} className="input-style" aria-label="Registration ID" />
                    <input name="cnic" type="text" required placeholder="CNIC (xxxxx-xxxxxxx-x)" value={formData.cnic} onChange={handleChange} className="input-style" aria-label="CNIC Number" />
                    <input name="salary" type="number" required placeholder="Salary" value={formData.salary} onChange={handleChange} className="input-style" aria-label="Monthly Salary" />
                    <input name="joiningDate" type="date" required value={formData.joiningDate} onChange={handleChange} className="input-style" aria-label="Joining Date" />
                    <input name="contact" type="text" required placeholder="Contact" value={formData.contact} onChange={handleChange} className="input-style" aria-label="Contact Number" />
                    <input name="address" type="text" required placeholder="Address" value={formData.address} onChange={handleChange} className="input-style" aria-label="Home Address" />

                    <div className="md:col-span-2 flex gap-4 pt-6">
                        <button type="submit" disabled={loading} className="flex-1 py-4 bg-gradient-to-r from-sky-600 to-blue-600 rounded-xl text-white font-bold hover:shadow-lg transition">
                            {loading ? 'Registering...' : 'Register Receptionist'}
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

export default RegisterReceptionist;