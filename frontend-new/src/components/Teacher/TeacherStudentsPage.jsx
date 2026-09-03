import React, { useState } from 'react';
import toast from 'react-hot-toast';
import axiosInstance from '../../api/axios.js';

const TeacherStudentsPage = () => {
    const [className, setClassName] = useState('');
    const [loading, setLoading] = useState(false);
    const [students, setStudents] = useState([]);

    const fetchStudents = async (e) => {
        e.preventDefault();
        const cls = className.trim().toUpperCase();
        if (!cls) return;
        const toastId = toast.loading('Fetching students...');
        setLoading(true);
        setStudents([]);
        try {
            const res = await axiosInstance.get(`/teacher/students/${encodeURIComponent(cls)}`);
            setStudents(res.data.data || []);
            toast.success(`${res.data.data?.length || 0} students found`, { id: toastId });
        } catch (err) {
            toast.error(err.response?.data?.msg || err.response?.data?.message || 'Failed to fetch students', { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-sky-500 bg-clip-text text-transparent">
                Students
            </h1>

            <div className="bg-blue-950/50 backdrop-blur-md rounded-2xl border border-blue-400/30 p-6">
                <h3 className="text-xl font-semibold text-blue-300 mb-4">Search By Class</h3>

                <form onSubmit={fetchStudents} className="flex flex-col md:flex-row gap-4">
                    <input
                        value={className}
                        onChange={(e) => setClassName(e.target.value)}
                        className="input-style w-full"
                        placeholder="Class (e.g. 11)"
                        aria-label="Class Name"
                        aria-required="true"
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="py-4 px-6 bg-gradient-to-r from-sky-600 to-blue-600 rounded-xl text-white font-bold hover:shadow-lg transition"
                        aria-label={loading ? 'Searching...' : 'Search Students'}
                    >
                        {loading ? 'Loading…' : 'Search'}
                    </button>
                </form>
            </div>

            {students.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border border-blue-400/30 rounded-2xl overflow-hidden" aria-label={`Students in class ${className}`}>
                        <thead className="bg-blue-900/50">
                            <tr>
                                <th className="p-4 text-blue-300">Roll No</th>
                                <th className="p-4 text-blue-300">Name</th>
                                <th className="p-4 text-blue-300">Class</th>
                                <th className="p-4 text-blue-300">Field</th>
                                <th className="p-4 text-blue-300">Contact</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(s => (
                                <tr key={s._id} className="border-t border-blue-400/20">
                                    <td className="p-4 text-white">{s.rollNo}</td>
                                    <td className="p-4 text-white">{s.stdName}</td>
                                    <td className="p-4 text-gray-300">{s.className}</td>
                                    <td className="p-4 text-gray-300">{s.field || 'N/A'}</td>
                                    <td className="p-4 text-gray-300">{s.contact || 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default TeacherStudentsPage;
