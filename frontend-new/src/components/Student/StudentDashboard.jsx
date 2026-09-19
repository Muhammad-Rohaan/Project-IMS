import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axios.js';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        profile: null,
        fees: null,
        notes: [],
        results: []
        // attendance: null
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            const toastId = toast.loading('Loading dashboard data...');
            setLoading(true);
            try {
                const results = await Promise.allSettled([
                    axiosInstance.get('/student/profile'),
                    axiosInstance.get('/student/fees'),
                    axiosInstance.get('/student/fetchNotes'),
                    axiosInstance.get('/student/my-class-results')
                    // axiosInstance.get('/student/attendance')
                ]);

                setData({
                    profile: results[0].status === 'fulfilled' ? results[0].value.data : null,
                    fees: results[1].status === 'fulfilled' ? results[1].value.data : null,
                    notes: results[2].status === 'fulfilled' ? results[2].value.data.notes : [],
                    results: results[3].status === 'fulfilled' ? results[3].value.data.results : []
                    // attendance: results[4].status === 'fulfilled' ? results[4].value.data : null,
                });

                // If critical profile data fails
                if (results[0].status === 'rejected') {
                    toast.error("Critical error: Profile not found.", { id: toastId });
                } else {
                    toast.success('Dashboard updated', { id: toastId });
                }

            } catch {
                toast.error("Failed to connect to the server.", { id: toastId });
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-black" aria-live="polite" aria-label="Loading student dashboard">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="p-4 md:p-6 space-y-8 md:space-y-10 text-gray-100">
            {/* Header */}
            <header>
                <h1 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-blue-400 via-blue-500 to-sky-600 bg-clip-text text-transparent">
                    Student Portal
                </h1>
                <p className="text-gray-400 mt-2 text-sm md:text-base" aria-label={`Welcome back, ${data.profile?.user?.fullName || 'Student'}`}>
                    Welcome back, {data.profile?.user?.fullName || 'Student'}
                </p>
                <div
                    className="bg-gradient-to-r from-blue-500/10 to-sky-600/10 border border-blue-400/20 rounded-3xl p-6 mt-8 shadow-2xl backdrop-blur-md"
                >

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                        <div>
                            <h2 className="text-2xl font-black text-blue-400">
                                AI MCQs Generator
                            </h2>

                            <p className="text-gray-400 mt-2">
                                Practice smarter with AI-generated quizzes.
                            </p>
                        </div>

                        <button
                            onClick={() => navigate('/student/ai-mcqs')}
                            className="bg-gradient-to-r from-blue-500 to-sky-600 hover:scale-[1.02] transition-transform duration-300 px-8 py-4 rounded-2xl font-black text-white shadow-2xl"
                        >
                            🚀 Start Quiz
                        </button>

                    </div>

                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">

                {/* 1. PROFILE CARD */}
                <div
                    className="md:col-span-1 lg:col-span-1 bg-blue-950/50 backdrop-blur-md border border-blue-400/30 p-6 md:p-8 rounded-2xl shadow-2xl"
                    aria-label="Student Profile Information"
                >
                    <h3 className="text-lg md:text-xl font-bold text-blue-400 mb-4 border-b border-white/10 pb-2">Your Profile</h3>
                    {data.profile ? (
                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest font-bold">Full Name</p>
                                <p className="text-base md:text-lg text-white" aria-label={`Name: ${data.profile.user.fullName}`}>{data.profile.user.fullName}</p>
                            </div>
                            <div>
                                <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest font-bold">Email Address</p>
                                <p className="text-sm md:text-base text-gray-300 break-all" aria-label={`Email: ${data.profile.user.email}`}>{data.profile.user.email}</p>
                            </div>
                            <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                                <span
                                    className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase"
                                    aria-label={`Role: ${data.profile.user.role}`}
                                >
                                    {data.profile.user.role}
                                </span>
                            </div>
                        </div>
                    ) : <p className="text-sm" aria-live="polite">Loading Profile...</p>}
                </div>

                {/* 2. CLASS NOTES */}
                <div
                    className="md:col-span-1 lg:col-span-2 bg-blue-950/50 backdrop-blur-md border border-sky-400/30 p-6 md:p-8 rounded-2xl shadow-2xl"
                    aria-label="Class Notes and Files"
                >
                    <h3 className="text-lg md:text-xl font-bold text-sky-400 mb-6">Subject Notes & Files</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {data.notes.length > 0 ? data.notes.map((note) => (
                            <div key={note._id} className="bg-blue-900/40 p-4 md:p-5 rounded-xl border border-sky-500/20 hover:border-sky-500/50 transition-all group shadow-lg">
                                <div className="flex flex-col h-full justify-between">
                                    <div>
                                        <h4 className="text-white text-sm md:text-base font-bold group-hover:text-sky-400 transition-colors line-clamp-1">{note.title}</h4>
                                        <p className="text-gray-500 text-xs md:text-sm mt-1">{note.subject}</p>
                                    </div>
                                    <a
                                        href={note.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-4 block text-center bg-sky-600 hover:bg-sky-500 text-white text-sm font-bold py-2 px-4 rounded-xl transition shadow-lg shadow-sky-900/20"
                                        aria-label={`Open file for ${note.title}`}
                                    >
                                        Open File
                                    </a>
                                </div>
                            </div>
                        )) : (
                            <p className="text-gray-500 col-span-1 sm:col-span-2 italic py-10 text-center text-sm" aria-live="polite">No notes available for your class.</p>
                        )}
                    </div>
                </div>

                {/* 3. TEST RESULTS */}
                <div
                    className="md:col-span-1 lg:col-span-2 bg-blue-950/50 backdrop-blur-md border border-emerald-400/30 p-6 md:p-8 rounded-2xl shadow-2xl"
                    aria-label="Test Results"
                >
                    <h3 className="text-lg md:text-xl font-bold text-emerald-400 mb-6">Test Results</h3>
                    <div className="space-y-3">
                        {data.results.length > 0 ? data.results.map((res, i) => (
                            <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between bg-blue-900/40 p-4 rounded-xl border border-emerald-500/20 gap-2 sm:gap-4">
                                <span className="text-gray-200 text-sm md:text-base font-medium">{res.testName}</span>
                                <a
                                    href={res.imageUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-emerald-400 text-xs md:text-sm font-bold hover:underline"
                                    aria-label={`View result image for ${res.testName}`}
                                >
                                    View Result Image →
                                </a>
                            </div>
                        )) : <p className="text-gray-500 text-sm" aria-live="polite">No results found.</p>}
                    </div>
                </div>

                {/* 4. FEE STATUS */}
                <div
                    className="md:col-span-1 lg:col-span-1 bg-blue-950/50 backdrop-blur-md border border-yellow-400/30 p-6 md:p-8 rounded-2xl shadow-2xl"
                    aria-label="Fees Status"
                >
                    <h3 className="text-lg md:text-xl font-bold text-yellow-400 mb-6">Fees Status</h3>
                    {data.fees?.fees?.length > 0 ? (
                        <div className="space-y-4">
                            {data.fees.fees.map((fee, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-blue-900/40 p-4 rounded-xl border border-yellow-500/20">
                                    <span className="text-gray-300 text-xs md:text-sm">
                                        {fee.collectedDate ? new Date(fee.collectedDate).toLocaleDateString() : 'Due'}
                                    </span>
                                    <span
                                        className={`px-3 py-1 rounded-lg text-[10px] md:text-xs font-bold uppercase ${fee.status === 'paid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                                            }`}
                                        aria-label={`Fee status: ${fee.status}`}
                                    >
                                        {fee.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : <p className="text-gray-500 text-center text-sm" aria-live="polite">No fee records.</p>}
                </div>

            </div>
        </div>
    );
};

export default StudentDashboard;