import React, { useState } from 'react';
import toast from 'react-hot-toast';
import axiosInstance from '../../api/axios.js';

const EditStudent = ({ student, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: student?.userId?.fullName || student?.stdName || '',
        email: student?.userId?.email || '',
        isActive: student?.userId?.isActive ?? true,
        fatherName: student?.fatherName || '',
        fatherPhone: student?.fatherPhone || '',
        contact: student?.contact || '',
        address: student?.address || '',
        age: student?.age || '',
        className: student?.className || '',
        field: student?.field || ''
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Saving changes...');
        setLoading(true);
        try {
            await axiosInstance.put(`/reception/az-students/update-student/${encodeURIComponent(student.rollNo)}`, {
                fullName: formData.fullName.trim(),
                email: formData.email.trim(),
                isActive: formData.isActive,
                fatherName: formData.fatherName.trim(),
                fatherPhone: formData.fatherPhone.trim(),
                contact: formData.contact.trim(),
                address: formData.address.trim(),
                age: Number(formData.age),
                className: formData.className.trim(),
                field: formData.field.trim()
            });
            toast.success('Student updated successfully!', { id: toastId });
            if (onSuccess) onSuccess();
            onClose();
        } catch (err) {
            const msg = err.response?.data?.message || 'Update failed';
            toast.error(msg, { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="edit-student-title">
            <div className="bg-blue-950/90 backdrop-blur-xl rounded-3xl border border-blue-400/40 p-8 w-full max-w-4xl my-8 shadow-2xl max-h-[90vh] overflow-y-auto">
                <h2 id="edit-student-title" className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-sky-500 bg-clip-text text-transparent mb-8 text-center">
                    Edit Student ({student.rollNo})
                </h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <label htmlFor="fullName" className="text-sm text-gray-300 ml-1">Full Name</label>
                        <input id="fullName" name="fullName" type="text" required placeholder="Full Name" value={formData.fullName} onChange={handleChange} className="input-style w-full" aria-required="true" />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="email" className="text-sm text-gray-300 ml-1">Email</label>
                        <input id="email" name="email" type="email" required placeholder="Email" value={formData.email} onChange={handleChange} className="input-style w-full" aria-required="true" />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="fatherName" className="text-sm text-gray-300 ml-1">Father Name</label>
                        <input id="fatherName" name="fatherName" type="text" placeholder="Father Name" value={formData.fatherName} onChange={handleChange} className="input-style w-full" />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="fatherPhone" className="text-sm text-gray-300 ml-1">Father Phone</label>
                        <input id="fatherPhone" name="fatherPhone" type="text" placeholder="Father Phone" value={formData.fatherPhone} onChange={handleChange} className="input-style w-full" />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="contact" className="text-sm text-gray-300 ml-1">Student Contact</label>
                        <input id="contact" name="contact" type="text" placeholder="Student Contact" value={formData.contact} onChange={handleChange} className="input-style w-full" />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="address" className="text-sm text-gray-300 ml-1">Address</label>
                        <input id="address" name="address" type="text" required placeholder="Address" value={formData.address} onChange={handleChange} className="input-style w-full" aria-required="true" />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="age" className="text-sm text-gray-300 ml-1">Age</label>
                        <input id="age" name="age" type="number" required placeholder="Age" value={formData.age} onChange={handleChange} className="input-style w-full" aria-required="true" />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="className" className="text-sm text-gray-300 ml-1">Class</label>
                        <input id="className" name="className" type="text" required placeholder="Class (e.g. 11)" value={formData.className} onChange={handleChange} className="input-style w-full" aria-required="true" />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                        <label htmlFor="field" className="text-sm text-gray-300 ml-1">Field</label>
                        <input id="field" name="field" type="text" required placeholder="Field (e.g. cs)" value={formData.field} onChange={handleChange} className="input-style w-full" aria-required="true" />
                    </div>

                    <label className="flex items-center gap-3 md:col-span-2 text-gray-200">
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={!!formData.isActive}
                            onChange={handleChange}
                            className="h-5 w-5 accent-blue-400"
                        />
                        Active
                    </label>

                    <div className="md:col-span-2 flex gap-4 pt-6">
                        <button type="submit" disabled={loading} className="flex-1 py-4 bg-gradient-to-r from-sky-600 to-blue-600 rounded-xl text-white font-bold hover:shadow-lg transition">
                            {loading ? 'Saving…' : 'Save Changes'}
                        </button>
                        <button type="button" onClick={onClose} className="flex-1 py-4 bg-gray-700/50 rounded-xl text-white hover:bg-gray-600/50 transition">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditStudent;
