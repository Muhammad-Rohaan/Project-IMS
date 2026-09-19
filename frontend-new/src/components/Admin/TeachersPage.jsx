import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axiosInstance from '../../api/axios.js';
import RegisterTeacher from './RegisterTeacher.jsx';

const TeachersPage = () => {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editTeacher, setEditTeacher] = useState(null);
    const [filteredTeachers, setFilteredTeachers] = useState([]);

    // Filter States
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const response = await axiosInstance.get('/admin/az-teachers/fetch-all-teachers');
                const allTeachers = response.data.teachers || [];
                setTeachers(allTeachers);
                setFilteredTeachers(allTeachers);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching teachers:", err);
                toast.error('Failed to load teachers. Please try again.');
                setLoading(false);
            }
        };

        fetchTeachers();
    }, []);

    // Filter function - jab class ya subject change ho
    useEffect(() => {
        if (!selectedClass) return;

        let url = '/admin/az-teachers';

        if (selectedSubject.trim()) {
            url += `/fetch-teachers-by-class-and-subject/${selectedClass}/${selectedSubject.trim()}`;
        } else {
            url += `/fetch-teachers-by-class/${selectedClass}`;
        }

        const fetchFiltered = async () => {
            try {
                const res = await axiosInstance.get(url);
                setFilteredTeachers(res.data.Teachers || res.data.teachers || []);
            } catch {
                toast.error('No teachers found for this filter');
                setFilteredTeachers([]);
            }
        };

        fetchFiltered();
    }, [selectedClass, selectedSubject]);

    const displayedTeachers = selectedClass ? filteredTeachers : teachers;

    const handleClassChange = (e) => {
        const value = e.target.value;
        setSelectedClass(value);
        if (!value) setSelectedSubject(''); // class clear ho to subject bhi clear
    };

    // Delete Function
    const handleDelete = async (teacherRegId) => {
        if (!window.confirm(`Are you sure you want to delete this teacher ${teacherRegId}?`)) return;

        const toastId = toast.loading('Deleting teacher...');
        try {
            await axiosInstance.delete(`/admin/az-teachers/delete-teacher/${teacherRegId}`);
            setTeachers(teachers.filter(t => t.teacherRegId !== teacherRegId));
            setFilteredTeachers(filteredTeachers.filter(t => t.teacherRegId !== teacherRegId));
            toast.success('Teacher deleted successfully.', { id: toastId });
        } catch (err) {
            console.error("Error deleting teacher:", err);
            toast.error('Delete failed: ' + (err.response?.data?.msg || 'Try again'), { id: toastId });
        }
    };

    // Edit Function
    const handleEdit = (teacher) => {
        setEditTeacher(teacher);
    };

    const handleEditSuccess = () => {
        setEditTeacher(null);
        // refresh list
        const refresh = async () => {
            const res = await axiosInstance.get('/admin/az-teachers/fetch-all-teachers');
            const allTeachers = res.data.teachers || [];
            setTeachers(allTeachers);
            setFilteredTeachers(allTeachers);
        };
        refresh();
    };

    if (loading) {
        return <p className="text-center text-white text-2xl animate-pulse" aria-live="polite">Loading teachers...</p>;
    }

    return (
        <main className="space-y-8" aria-labelledby="teachers-title">
            <h1 id="teachers-title" className="text-4xl font-extrabold bg-gradient-to-r from-blue-700 to-sky-500 bg-clip-text text-transparent">
                Teachers ({displayedTeachers.length})
            </h1>

            {/* Filter Section */}
            <section className="bg-blue-950/50 backdrop-blur-md rounded-2xl border border-blue-400/30 p-6" aria-labelledby="filter-title">
                <h3 id="filter-title" className="text-xl font-semibold text-blue-300 mb-4">Filter Teachers</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4" role="search">
                    <div>
                        <label className="block text-sm text-gray-300 mb-2" htmlFor="class-select">Select Class</label>
                        <select
                            id="class-select"
                            value={selectedClass}
                            onChange={handleClassChange}
                            className="w-full px-4 py-3 bg-blue-900/50 border border-blue-400/30 rounded-xl text-white focus:ring-4 focus:ring-blue-400/50"
                            aria-label="Select class to filter teachers"
                        >
                            <option value="">All Classes</option>
                            <option value="9">Class 9</option>
                            <option value="10">Class 10</option>
                            <option value="11">Class 11</option>
                            <option value="12">Class 12</option>
                            {/* Dynamic classes future mein add kar sakte ho */}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-300 mb-2" htmlFor="subject-input">Select Subject (Optional)</label>
                        <input
                            id="subject-input"
                            type="text"
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            disabled={!selectedClass}
                            placeholder="e.g. computer"
                            className="w-full px-4 py-3 bg-blue-900/50 border border-blue-400/30 rounded-xl text-white disabled:opacity-50"
                            aria-label="Enter subject to filter teachers"
                        />
                    </div>

                    <div className="flex items-end">
                        <button
                            onClick={() => {
                                setSelectedClass('');
                                setSelectedSubject('');
                            }}
                            className="w-full py-3 bg-gray-700/50 rounded-xl text-white hover:bg-gray-600/50 transition"
                            aria-label="Clear all filters"
                        >
                            Clear Filter
                        </button>
                    </div>
                </div>
            </section>

            {/* Teachers Table/List */}
            <section aria-live="polite" aria-atomic="true" aria-label="Teachers search results">
                {displayedTeachers.length === 0 ? (
                    <p className="text-center text-gray-400 text-xl" role="status">No teachers found for selected filter.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border border-blue-400/30 rounded-2xl overflow-hidden" aria-label="Teachers list">
                            <thead className="bg-blue-900/50">
                                <tr>
                                    <th scope="col" className="p-4 text-blue-300">Reg ID</th>
                                    <th scope="col" className="p-4 text-blue-300">Name</th>
                                    <th scope="col" className="p-4 text-blue-300">Classes</th>
                                    <th scope="col" className="p-4 text-blue-300">Subjects</th>
                                    <th scope="col" className="p-4 text-blue-300">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayedTeachers.map(teacher => (
                                    <tr key={teacher._id} className="border-t border-blue-400/20">
                                        <td className="p-4 text-white">{teacher.teacherRegId}</td>
                                        <td className="p-4 text-white">{teacher.teacherFullName}</td>
                                        <td className="p-4 text-gray-300">{teacher.classes.join(', ')}</td>
                                        <td className="p-4 text-gray-300">{teacher.subjects.join(', ')}</td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => handleEdit(teacher)}
                                                className="text-yellow-400 mr-4 hover:text-yellow-300 font-medium"
                                                aria-label={`Edit teacher ${teacher.teacherFullName}`}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(teacher.teacherRegId)}
                                                className="text-red-400 hover:text-red-300 font-medium"
                                                aria-label={`Delete teacher ${teacher.teacherFullName}`}
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

            {/* Edit Teacher Modal */}
            {editTeacher && (
                <RegisterTeacher
                    teacher={editTeacher}
                    onClose={() => setEditTeacher(null)}
                    onSuccess={handleEditSuccess}
                />
            )}
        </main>
    );
};

export default TeachersPage;