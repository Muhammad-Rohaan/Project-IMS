import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axios.js';

const RegisterTeacher = ({ onClose, teacher, onSuccess }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const isEdit = !!teacher;

    const [formData, setFormData] = useState({
        fullName: teacher?.teacherFullName || '',
        email: teacher?.userId?.email || '',
        password: '',
        teacherRegId: teacher?.teacherRegId || '',
        cnic: teacher?.cnic || '',
        qualification: teacher?.qualification || '',
        salary: teacher?.salary || '',
        joiningDate: teacher?.joiningDate?.slice(0, 10) || '',
        subjects: teacher?.subjects?.join(', ') || '',
        classes: teacher?.classes?.join(', ') || '',
        contact: teacher?.contact || '',
        address: teacher?.address || '',
        age: teacher?.age || ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading(isEdit ? 'Updating teacher...' : 'Registering teacher...');
        setLoading(true);

        try {
            const dataToSend = {
                fullName: formData.fullName.trim(),
                email: formData.email.trim(),
                password: formData.password,
                teacherRegId: formData.teacherRegId.trim(),
                cnic: formData.cnic.trim(),
                qualification: formData.qualification.trim(),
                salary: Number(formData.salary),
                joiningDate: formData.joiningDate,
                subjects: formData.subjects.split(',').map(s => s.trim()).filter(s => s),
                classes: formData.classes.split(',').map(c => Number(c.trim())).filter(c => !isNaN(c)),
                contact: formData.contact.trim(),
                address: formData.address.trim(),
                age: Number(formData.age)
            };

            let response;
            if (isEdit) {
                response = await axiosInstance.put(`/admin/az-teachers/update-teacher/${teacher.teacherRegId}`, dataToSend);
                toast.success('Teacher updated successfully!', { id: toastId });
            } else {
                response = await axiosInstance.post('/admin/az-teachers/register-teacher', dataToSend);
                toast.success(response.data.message || 'New Teacher registered successfully!', { id: toastId });
            }

            onClose();
            if (onSuccess) onSuccess();
            if (!isEdit) navigate('/admin/az-teachers');

        } catch (err) {
            console.error("Registration/Update error:", err);
            const msg = err.response?.data?.message || err.message || 'Registration failed';
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
                className="bg-blue-950/90 backdrop-blur-xl rounded-3xl border border-blue-400/40 p-8 w-full max-w-4xl mx-4 my-8 shadow-2xl max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                <h2 id="modal-title" className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-sky-500 bg-clip-text text-transparent mb-8 text-center">
                    {isEdit ? 'Edit Teacher' : 'Register New Teacher'}
                </h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input name="fullName" type="text" required placeholder="Full Name" value={formData.fullName} onChange={handleChange} className="input-style" aria-label="Full Name" />
                    <input name="email" type="email" required placeholder="Email" value={formData.email} onChange={handleChange} className="input-style" aria-label="Email Address" />
                    <input name="password" type="password" placeholder={isEdit ? "Leave blank to keep existing" : "Password"} value={formData.password} onChange={handleChange} className="input-style" aria-label="Password" />
                    <input name="teacherRegId" type="text" required placeholder="Teacher Reg ID (e.g. RHN426)" value={formData.teacherRegId} onChange={handleChange} className="input-style" aria-label="Teacher Registration ID" />
                    <input name="cnic" type="text" required placeholder="CNIC (xxxxx-xxxxxxx-x)" value={formData.cnic} onChange={handleChange} className="input-style" aria-label="CNIC Number" />
                    <input name="qualification" type="text" required placeholder="Qualification" value={formData.qualification} onChange={handleChange} className="input-style" aria-label="Qualification" />
                    <input name="salary" type="number" required placeholder="Salary" value={formData.salary} onChange={handleChange} className="input-style" aria-label="Monthly Salary" />
                    <input name="joiningDate" type="date" required value={formData.joiningDate} onChange={handleChange} className="input-style" aria-label="Joining Date" />
                    <input name="subjects" type="text" required placeholder="Subjects (comma separated)" value={formData.subjects} onChange={handleChange} className="md:col-span-2 input-style" aria-label="Subjects" />
                    <input name="classes" type="text" required placeholder="Classes (comma separated)" value={formData.classes} onChange={handleChange} className="md:col-span-2 input-style" aria-label="Classes" />
                    <input name="contact" type="text" required placeholder="Contact" value={formData.contact} onChange={handleChange} className="input-style" aria-label="Contact Number" />
                    <input name="address" type="text" required placeholder="Address" value={formData.address} onChange={handleChange} className="input-style" aria-label="Home Address" />
                    <input name="age" type="number" required placeholder="Age" value={formData.age} onChange={handleChange} className="input-style" aria-label="Age" />

                    <div className="md:col-span-2 flex gap-4 pt-6">
                        <button type="submit" disabled={loading} className="flex-1 py-4 bg-gradient-to-r from-sky-600 to-blue-600 rounded-xl text-white font-bold hover:shadow-lg transition">
                            {loading ? 'Processing...' : (isEdit ? 'Update Teacher' : 'Register Teacher')}
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

export default RegisterTeacher;