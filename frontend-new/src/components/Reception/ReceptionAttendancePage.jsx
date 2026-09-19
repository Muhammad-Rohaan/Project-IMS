import React, { useState } from 'react';
import toast from 'react-hot-toast';
import axiosInstance from '../../api/axios.js';

const ReceptionAttendancePage = () => {
    const [form, setForm] = useState({ rollNo: '', status: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Marking attendance...');
        setLoading(true);
        try {
            const res = await axiosInstance.post('/reception/attendance/markAttendance', {
                rollNo: form.rollNo.trim(),
                status: form.status
            });
            toast.success(res.data.message || 'Attendance marked successfully', { id: toastId });
            setForm({ rollNo: '', status: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to mark attendance', { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="space-y-8" aria-labelledby="attendance-title">
            <h1 id="attendance-title" className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-sky-500 bg-clip-text text-transparent">
                Attendance
            </h1>

            <section className="bg-blue-950/50 backdrop-blur-md rounded-2xl border border-blue-400/30 p-6 max-w-3xl" aria-labelledby="mark-attendance-title">
                <h2 id="mark-attendance-title" className="text-2xl font-semibold text-blue-300 mb-4">Mark Attendance</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label htmlFor="rollNo" className="text-sm text-gray-300 ml-1">Roll No</label>
                        <input
                            id="rollNo"
                            name="rollNo"
                            value={form.rollNo}
                            onChange={handleChange}
                            className="input-style w-full"
                            placeholder="e.g. 11A-04"
                            required
                            aria-required="true"
                        />
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="status" className="text-sm text-gray-300 ml-1">Status</label>
                        <select
                            id="status"
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            className="input-style w-full"
                            required
                            aria-required="true"
                        >
                            <option value="">Select Status</option>
                            <option value="present">Present</option>
                            <option value="absent">Absent</option>
                            <option value="late">Late</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-gradient-to-r from-sky-600 to-blue-600 rounded-xl text-white font-bold hover:shadow-lg transition"
                    >
                        {loading ? 'Processing…' : 'Mark Attendance'}
                    </button>
                </form>
            </section>
        </main>
    );
};

export default ReceptionAttendancePage;
