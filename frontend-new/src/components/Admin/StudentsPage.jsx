import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axios.js';
import toast from 'react-hot-toast';

const StudentsPage = () => {
    const [loading, setLoading] = useState(true);
    const [students, setStudents] = useState([]);
    const [rollNoQuery, setRollNoQuery] = useState('');
    const [classQuery, setClassQuery] = useState('');

    const formatDate = (value) => {
        if (!value) return '—';
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) return '—';
        return d.toLocaleDateString();
    };

    useEffect(() => {
        const fetchAdminDashboard = async () => {
            const toastId = toast.loading('Loading students...');
            try {
                const res = await axiosInstance.get('/admin/az-teachers/getAllStudents');
                setStudents(res.data.getStds || []);
                toast.success('Students loaded successfully', { id: toastId });
            } catch (err) {
                toast.error(err.response?.data?.message || 'Failed to load students', { id: toastId });
            } finally {
                setLoading(false);
            }
        };
        fetchAdminDashboard();
    }, []);

    const filteredStudents = students.filter((s) => {
        const roll = String(s.rollNo || '').toLowerCase();
        const cls = String(s.className || '').toLowerCase();

        const rollOk = rollNoQuery.trim() ? roll.includes(rollNoQuery.trim().toLowerCase()) : true;
        const classOk = classQuery.trim() ? cls === classQuery.trim().toLowerCase() : true;

        return rollOk && classOk;
    });

    return (
        <main className="space-y-8" aria-labelledby="students-title">
            <h1 id="students-title" className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 via-sky-500 to-pink-500 bg-clip-text text-transparent">
                Students Management
            </h1>

            <section className="bg-blue-950/50 backdrop-blur-md rounded-2xl border border-blue-400/30 p-6" aria-label="Students content">
                {loading ? (
                    <p className="text-white animate-pulse" aria-live="polite">Loading…</p>
                ) : (
                    <div className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" role="region" aria-label="Students summary and search">
                            <div
                                className="bg-black/30 p-4 rounded-2xl border border-blue-400/10"
                                aria-label={`Total Students: ${students.length}`}
                                role="status"
                            >
                                <p className="text-sm text-gray-300">Total Students</p>
                                <p className="text-3xl font-extrabold text-white mt-1">{students.length}</p>
                            </div>
                            <div className="md:col-span-2 bg-black/30 p-4 rounded-2xl border border-blue-400/10" role="search" aria-label="Search students">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        value={rollNoQuery}
                                        onChange={(e) => setRollNoQuery(e.target.value)}
                                        className="input-style w-full"
                                        placeholder="Search by roll no (contains)"
                                        aria-label="Search by roll number"
                                    />
                                    <input
                                        value={classQuery}
                                        onChange={(e) => setClassQuery(e.target.value)}
                                        className="input-style w-full"
                                        placeholder="Filter by class (exact, e.g. 9)"
                                        aria-label="Filter by class"
                                    />
                                </div>
                            </div>
                        </div>

                        <div aria-live="polite" aria-atomic="true">
                            {filteredStudents.length === 0 ? (
                                <div
                                    className="bg-black/30 p-6 rounded-2xl border border-blue-400/10 text-gray-300"
                                    role="status"
                                >
                                    No students found.
                                </div>
                            ) : (
                                <div className="overflow-x-auto bg-black/30 rounded-2xl border border-blue-400/10">
                                    <table className="min-w-full text-left text-sm" aria-label="Students list">
                                        <thead className="bg-white/5 text-gray-300">
                                            <tr>
                                                <th scope="col" className="py-3 px-4 font-semibold">Roll No</th>
                                                <th scope="col" className="py-3 px-4 font-semibold">Name</th>
                                                <th scope="col" className="py-3 px-4 font-semibold">Class</th>
                                                <th scope="col" className="py-3 px-4 font-semibold">Father</th>
                                                <th scope="col" className="py-3 px-4 font-semibold">Phone</th>
                                                <th scope="col" className="py-3 px-4 font-semibold">Contact</th>
                                                <th scope="col" className="py-3 px-4 font-semibold">Created</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/10">
                                            {filteredStudents.map((s) => (
                                                <tr key={s._id} className="text-gray-200">
                                                    <td className="py-3 px-4 font-semibold text-white">{s.rollNo || '—'}</td>
                                                    <td className="py-3 px-4">{s.stdName || '—'}</td>
                                                    <td className="py-3 px-4">{s.className || '—'}</td>
                                                    <td className="py-3 px-4">{s.fatherName || '—'}</td>
                                                    <td className="py-3 px-4">{s.fatherPhone || '—'}</td>
                                                    <td className="py-3 px-4">{s.contact || '—'}</td>
                                                    <td className="py-3 px-4">{formatDate(s.createdAt)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </section>
        </main>
    );
};

export default StudentsPage;
