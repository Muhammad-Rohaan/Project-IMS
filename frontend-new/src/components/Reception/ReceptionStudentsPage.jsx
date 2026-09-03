import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axiosInstance from '../../api/axios.js';
import RegisterStudent from './RegisterStudent.jsx';
import EditStudent from './EditStudent.jsx';

const ReceptionStudentsPage = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showRegister, setShowRegister] = useState(false);
    const [editStudent, setEditStudent] = useState(null);

    const [rollNoQuery, setRollNoQuery] = useState('');
    const [classQuery, setClassQuery] = useState('');

    useEffect(() => {
        refreshAll();
    }, []);

    const refreshAll = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/reception/az-students/fetch-all-students');
            setStudents(response.data.students || []);
        } catch {
            toast.error('Failed to load students');
        } finally {
            setLoading(false);
        }
    };

    const searchByRollNo = async () => {
        const q = rollNoQuery.trim();
        if (!q) return;
        const toastId = toast.loading('Searching student...');
        setLoading(true);
        try {
            const res = await axiosInstance.get(`/reception/az-students/fetch-student-by-rollno/${encodeURIComponent(q)}`);
            setStudents(res.data.student ? [res.data.student] : []);
            toast.success('Student found', { id: toastId });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Student not found', { id: toastId });
            setStudents([]);
        } finally {
            setLoading(false);
        }
    };

    const searchByClass = async () => {
        const q = classQuery.trim();
        if (!q) return;
        const toastId = toast.loading('Filtering students...');
        setLoading(true);
        try {
            const res = await axiosInstance.get(`/reception/az-students/fetch-students-by-class/${encodeURIComponent(q)}`);
            setStudents(res.data.students || []);
            toast.success(`${res.data.students?.length || 0} students found`, { id: toastId });
        } catch (err) {
            toast.error(err.response?.data?.message || 'No students found', { id: toastId });
            setStudents([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (rollNo) => {
        if (!window.confirm(`Delete student ${rollNo}?`)) return;
        const toastId = toast.loading('Deleting student...');
        try {
            await axiosInstance.delete(`/reception/az-students/delete-student/${encodeURIComponent(rollNo)}`);
            setStudents(prev => prev.filter(s => s.rollNo !== rollNo));
            toast.success('Student deleted successfully', { id: toastId });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Delete failed', { id: toastId });
        }
    };

    if (loading) {
        return <p className="text-white text-center text-2xl animate-pulse" aria-live="polite">Loading students...</p>;
    }

    return (
        <main className="space-y-8" aria-labelledby="students-title">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h1 id="students-title" className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-sky-500 bg-clip-text text-transparent">
                    Registered Students ({students.length})
                </h1>

                <button
                    onClick={() => setShowRegister(true)}
                    className="py-3 px-6 rounded-2xl bg-gradient-to-r from-sky-600/80 to-blue-600/80 hover:from-sky-600 hover:to-blue-600 text-white font-bold transition shadow-lg"
                    aria-label="Register a new student"
                >
                    + Register Student
                </button>
            </div>

            <section className="bg-blue-950/50 backdrop-blur-md rounded-2xl border border-blue-400/30 p-6 space-y-4" aria-labelledby="search-title">
                <h3 id="search-title" className="text-xl font-semibold text-blue-300">Search</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4" role="search">
                    <div className="space-y-2">
                        <label className="text-sm text-gray-300" htmlFor="rollNoSearch">By Roll No</label>
                        <input
                            id="rollNoSearch"
                            value={rollNoQuery}
                            onChange={(e) => setRollNoQuery(e.target.value)}
                            className="input-style w-full"
                            placeholder="e.g. 11A-04"
                        />
                        <button
                            onClick={searchByRollNo}
                            className="w-full py-3 bg-blue-800/60 rounded-xl text-white hover:bg-blue-800 transition"
                            aria-label="Execute search by roll number"
                        >
                            Search
                        </button>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-gray-300" htmlFor="classSearch">By Class</label>
                        <input
                            id="classSearch"
                            value={classQuery}
                            onChange={(e) => setClassQuery(e.target.value)}
                            className="input-style w-full"
                            placeholder="e.g. 11"
                        />
                        <button
                            onClick={searchByClass}
                            className="w-full py-3 bg-blue-800/60 rounded-xl text-white hover:bg-blue-800 transition"
                            aria-label="Execute filter by class"
                        >
                            Filter
                        </button>
                    </div>

                    <div className="flex items-end">
                        <button
                            onClick={() => {
                                setRollNoQuery('');
                                setClassQuery('');
                                refreshAll();
                            }}
                            className="w-full py-3 bg-gray-700/50 rounded-xl text-white hover:bg-gray-600/50 transition"
                            aria-label="Clear all search filters"
                        >
                            Clear
                        </button>
                    </div>
                </div>
            </section>

            <section aria-live="polite" aria-atomic="true" aria-label="Student search results">
                {students.length === 0 ? (
                    <><p className="text-center text-gray-400 text-xl py-10" role="status">No students registered yet.</p><caption className="text-lg font-bold text-blue-300 mb-4">Registered Students List</caption></>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border border-blue-400/30 rounded-2xl overflow-hidden" aria-label="Registered Students List">
                            <thead className="bg-blue-900/50">
                                <tr>
                                    <th scope="col" className="p-4 text-blue-300">Roll No</th>
                                    <th scope="col" className="p-4 text-blue-300">Name</th>
                                    <th scope="col" className="p-4 text-blue-300">Class</th>
                                    <th scope="col" className="p-4 text-blue-300">Contact</th>
                                    <th scope="col" className="p-4 text-blue-300">Status</th>
                                    <th scope="col" className="p-4 text-blue-300">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map(student => (
                                    <tr key={student._id} className="border-t border-blue-400/20">
                                        <td className="p-4 text-white">{student.rollNo}</td>
                                        <td className="p-4 text-white">{student.stdName || student.userId?.fullName || 'N/A'}</td>
                                        <td className="p-4 text-gray-300">{student.className}</td>
                                        <td className="p-4 text-gray-300">{student.contact || 'N/A'}</td>
                                        <td className="p-4 text-gray-300">{student.userId?.isActive === false ? 'Inactive' : 'Active'}</td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => setEditStudent(student)}
                                                className="text-yellow-400 mr-4 hover:text-yellow-300 font-medium"
                                                aria-label={`Edit student ${student.stdName || student.rollNo}`}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(student.rollNo)}
                                                className="text-red-400 hover:text-red-300 font-medium"
                                                aria-label={`Delete student ${student.stdName || student.rollNo}`}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {showRegister && (
                <RegisterStudent
                    onClose={() => setShowRegister(false)}
                    onSuccess={refreshAll}
                />
            )}

            {editStudent && (
                <EditStudent
                    student={editStudent}
                    onClose={() => setEditStudent(null)}
                    onSuccess={refreshAll}
                />
            )}
        </main>
    );
};

export default ReceptionStudentsPage;
