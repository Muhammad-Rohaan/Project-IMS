import React, { useState, useEffect, useCallback } from 'react';
import { UsersIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import axiosInstance from '../../api/axios.js';
import RegisterStudent from './RegisterStudent.jsx';

const StatCard = ({ name, stat, Icon, color }) => {
    return (
        <div 
            className={`p-6 rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-blue-500/30 backdrop-blur-md border border-blue-400/20 ${color} text-white`}
            aria-label={`${name}: ${stat}`}
            role="status"
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium opacity-90">{name}</p>
                    <p className="text-4xl font-extrabold mt-2">{stat}</p>
                </div>
                <div className="bg-white/10 p-4 rounded-full" aria-hidden="true">
                    {Icon && <Icon className="h-8 w-8" />}
                </div>
            </div>
        </div>
    );
};

const ReceptionDashboard = () => {
    const [showStudent, setShowStudent] = useState(false);

    const [stats, setStats] = useState({
        activeStudents: 0,
        todayAdmissions: 0,
        TotalFees: 0
    });

    const [loading, setLoading] = useState(true);

    /* ================= FETCH STATS ================= */
    const fetchStats = useCallback(async () => {
        const toastId = toast.loading("Loading dashboard...");

        try {
            const res = await axiosInstance.get('/reception/az-students/fetch-all-students');
            const students = res.data.students || [];

            const today = new Date().toDateString();

            const todayAdmissions = students.filter(s => {
                const registered = new Date(s.createdAt || s.joiningDate);
                return registered.toDateString() === today;
            }).length;

            setStats({
                activeStudents: students.length,
                todayAdmissions,
                TotalFees: 0
            });

            toast.success("Dashboard loaded", { id: toastId });

        } catch (err) {
            console.error(err);
            toast.error("Failed to load dashboard", { id: toastId });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    /* ================= AFTER REGISTER ================= */
    const handleStudentRegistered = useCallback(() => {
        toast.success("Student registered successfully");
        fetchStats();
        setShowStudent(false);
    }, [fetchStats]);

    if (loading) {
        return (
            <p className='text-white text-center text-2xl animate-pulse' aria-live="polite">
                Loading dashboard...
            </p>
        );
    }

    return (
        <main className="space-y-8 p-6 lg:p-10 bg-gradient-to-br from-slate-900 to-blue-950 min-h-screen" aria-label="Reception Dashboard Overview">
            {/* Header - Admin jaisa */}
            <div className="flex items-center gap-6">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-sky-600 shadow-2xl" aria-hidden="true">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                </div>
                <div>
                    <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 via-sky-500 to-pink-500 bg-clip-text text-transparent">
                        Reception Dashboard
                    </h1>
                    <p className="text-gray-400 mt-1 text-lg">Monitor admissions and manage students efficiently</p>
                </div>
            </div>

            {/* Stats Cards - Admin jaisa */}
            <section aria-label="Statistics Summary" className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <StatCard name="Active Students" stat={stats.activeStudents} Icon={UsersIcon} color="bg-gradient-to-br from-sky-800 to-blue-900" />
                <StatCard name="Today's Admissions" stat={stats.todayAdmissions} Icon={UsersIcon} color="bg-gradient-to-br from-blue-800 to-blue-900" />
                {/* <StatCard name="Collected Fees" stat={stats.collectedFees} icon={BellIcon} color="bg-gradient-to-br from-red-800 to-pink-900" /> */}
            </section>

            {/* Quick Actions - Admin jaisa */}
            <section className="bg-blue-950/50 backdrop-blur-md rounded-2xl border border-blue-400/30 p-8 shadow-2xl" aria-labelledby="quick-actions-title">
                <h3 id="quick-actions-title" className="text-2xl font-semibold bg-gradient-to-r from-blue-400 to-sky-500 bg-clip-text text-transparent mb-8">
                    Quick Actions
                </h3>

                {/* <div className="space-y-6"> */}
                    <button
                    type='button'
                        onClick={() => setShowStudent(true)}
                        aria-label='Register new student'
                        className="w-full py-5 px-8 rounded-2xl bg-gradient-to-r from-sky-600/70 to-blue-600/70 hover:from-sky-600/90 hover:to-blue-600/90 text-white font-bold text-lg transition transform hover:scale-105 shadow-lg"
                    >
                        ➕ Register New Student
                    </button>

                    {/* Future mein aur buttons add kar sakte ho */}
            </section>

            {/* Modal */}
            {showStudent && (
                <RegisterStudent
                    onClose={() => setShowStudent(false)}
                    onSuccess={handleStudentRegistered}
                />
            )}
        </main>
    );
};

export default ReceptionDashboard;
