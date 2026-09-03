import React, { useState, useEffect, useCallback } from 'react';
// Heroicons import karein
import { UsersIcon, AcademicCapIcon, CalendarDaysIcon } from '@heroicons/react/24/solid';
import axiosInstance from '../../api/axios.js';
import RegisterTeacher from '../../components/Admin/RegisterTeacher.jsx';
import RegisterReceptionist from '../../components/Admin/RegisterReceptionist.jsx';
import RegisterUser from '../../components/Admin/RegisterUser.jsx';
import PostAnnouncementModal from './PostAnnouncementModal.jsx';
import toast from 'react-hot-toast';

/* ================= STAT CARD ================= */
const StatCard = ({ name, stat, Icon, color }) => {
    return (
        <div
            className={`p-5 rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-blue-500/30 backdrop-blur-md border border-blue-400/20 ${color} text-white`}
            aria-label={`${name}: ${stat}`}
            role="status"
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium opacity-90">{name}</p>
                    <p className="text-3xl font-extrabold mt-1">{stat}</p>
                </div>
                <div className="bg-white/10 p-3 rounded-full" aria-hidden="true">
                    {Icon && <Icon className="h-6 w-6" />}
                </div>
            </div>
        </div>
    );
};

/* ================= DASHBOARD ================= */
const DashboardContent = () => {
    const [showTeacher, setShowTeacher] = useState(false);
    const [showReceptionist, setShowReceptionist] = useState(false);
    const [showRegisterUser, setShowRegisterUser] = useState(false);
    const [showAnnouncement, setShowAnnouncement] = useState(false);
    const user = JSON.parse(localStorage.getItem('userInfo'));

    const [stats, setStats] = useState({
        students: 0,
        teachers: 0,
        announcements: 0
    });

    const [loading, setLoading] = useState(true);

    /* ================= FETCH STATS ================= */
    useEffect(() => {
        const fetchStats = async () => {
            const toastId = toast.loading('Loading dashboard stats...');
            try {
                const [teachersRes, studentsRes, announcementsRes] = await Promise.all([
                    axiosInstance.get('/admin/az-teachers/fetch-all-teachers'),
                    axiosInstance.get('/admin/az-teachers/getAllStudents'),
                    axiosInstance.get('/announcement/all')
                ]);

                const teachersCount = teachersRes.data.teachers?.length || 0;
                const studentsCount = studentsRes.data.getStds?.length || 0;
                const announcementsCount = announcementsRes.data.announcement?.length || 0;

                setStats({
                    students: studentsCount,
                    teachers: teachersCount,
                    announcements: announcementsCount
                });

                toast.success('Stats updated', { id: toastId });
            } catch (err) {
                console.error("Stats fetch error:", err);
                toast.error('Failed to update stats', { id: toastId });
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    /* ================= HANDLERS ================= */
    const openTeacher = useCallback(() => setShowTeacher(true), []);
    const openReceptionist = useCallback(() => setShowReceptionist(true), []);
    const openUser = useCallback(() => setShowRegisterUser(true), []);
    const openAnnouncement = useCallback(() => setShowAnnouncement(true), []);

    if (loading) {
        return <p className="text-center text-white text-2xl" aria-live="polite">Loading stats...</p>;
    }

    return (
        <div className="w-full min-h-screen overflow-x-hidden">
            <main className="space-y-8 p-6 lg:p-10 bg-gradient-to-br from-slate-900 to-blue-950 min-h-screen overflow-x-hidden" aria-label="Admin Dashboard Overview">

                {/* ==== Ye Naya Beautiful Header ==== */}
                <div className="mb-10">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-sky-600 shadow-lg shadow-blue-500/30" aria-hidden="true">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>

                        <div>
                            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 via-sky-500 to-pink-500 bg-clip-text text-transparent">
                                Dashboard Overview
                            </h1>
                            <p className="text-gray-400 mt-1 text-sm">Monitor your institute's performance at a glance</p>
                        </div>
                    </div>
                </div>
                {/* ==== Header Khatam ==== */}

                {/* Stats/Summary Cards Grid */}
                <section aria-label="Statistics Summary" className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-3">
                    <StatCard name="Active Students" stat={stats.students} Icon={UsersIcon} color="bg-gradient-to-br from-sky-800 to-blue-900" />
                    <StatCard name="Total Teachers" stat={stats.teachers} Icon={AcademicCapIcon} color="bg-gradient-to-br from-blue-800 to-blue-900" />
                    <StatCard name="Upcoming Announcements" stat={stats.announcements} Icon={CalendarDaysIcon} color="bg-gradient-to-br from-pink-800 to-red-900" />
                </section>

                {/* Recent Activities and Quick Links */}
                <div className="grid grid-cols-1 gap-6">
                    {/* Quick Actions */}
                    <section className="bg-blue-950/50 p-6 rounded-2xl shadow-xl backdrop-blur-md border border-blue-400/30" aria-labelledby="quick-actions-title">
                        <h3 id="quick-actions-title" className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-sky-500 bg-clip-text text-transparent mb-4">
                            Quick Actions
                        </h3>
                        <div className="space-y-4" role="group" aria-label="Administrative Actions">

                            {/* Register New Teacher Button */}
                            <button
                                type='button'
                                onClick={openTeacher}
                                aria-label="Add new Teacher"
                                className="w-full text-left p-4 rounded-xl bg-gradient-to-r from-blue-800/50 to-sky-800/50 hover:from-blue-900/50 hover:to-sky-900/50 text-blue-300 font-medium transition transform hover:scale-[1.02] shadow-md"
                            >
                                ➕ Add Teacher
                            </button>

                            {/* Receptionist Button (future ke liye) */}
                            <button
                                type='button'
                                onClick={openReceptionist}
                                aria-label="Add new Receptionist"
                                className="w-full text-left p-4 rounded-xl bg-gradient-to-r from-blue-800/50 to-blue-800/50 hover:from-blue-900/50 hover:to-blue-900/50 text-blue-300 font-medium transition transform hover:scale-[1.02] shadow-md">
                                ➕ Add Receptionist
                            </button>

                            <button
                                type='button'
                                onClick={openUser}
                                aria-label="Add new User"
                                className="w-full text-left p-4 rounded-xl bg-gradient-to-r from-sky-800/50 to-blue-800/50 hover:from-sky-900/50 hover:to-blue-900/50 text-blue-300 font-medium transition transform hover:scale-[1.02] shadow-md"
                            >
                                ➕ Add User
                            </button>

                            {/* Announcement Button */}
                            <button
                                type='button'
                                onClick={openAnnouncement}
                                className="w-full text-left p-4 rounded-xl bg-gradient-to-r from-pink-800/50 to-red-800/50 hover:from-pink-900/50 hover:to-red-900/50 text-pink-300 font-medium transition transform hover:scale-[1.02] shadow-md">
                                📢 Post Announcement
                            </button>
                        </div>

                        {showTeacher && (
                            <RegisterTeacher onClose={() => setShowTeacher(false)} />
                        )}
                        {showReceptionist && (
                            <RegisterReceptionist onClose={() => setShowReceptionist(false)} />
                        )}
                        {showRegisterUser && (
                            <RegisterUser onClose={() => setShowRegisterUser(false)} />
                        )}
                        {showAnnouncement && (
                            <PostAnnouncementModal onClose={() => setShowAnnouncement(false)}
                                onCreated={() => setStats(prev => ({ ...prev, announcements: prev.announcements + 1 }))}
                                createdBy={user?.name}
                            />
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
};

export default DashboardContent;
