import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { UserCircleIcon, PowerIcon, Bars3Icon } from '@heroicons/react/24/outline';
import TeacherSidebar from '../Teacher/TeacherSidebar.jsx';
import AnnouncementBell from './AnnouncementBell.jsx';

const TeacherLayout = () => {
    const { auth, logoutUser } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    const userName = auth.user?.name || 'Teacher User';
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="flex h-screen bg-gradient-to-br from-slate-900 to-blue-950 overflow-hidden relative">
            {/* Overlay for mobile when sidebar is open */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                    aria-label="Close sidebar overlay"
                    role="button"
                    tabIndex="0"
                    onKeyDown={(e) => e.key === 'Enter' && setIsSidebarOpen(false)}
                />
            )}

            <TeacherSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 lg:ml-64">
                <header className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-900 to-blue-950 shadow-2xl border-b border-blue-700/50 text-white sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        {/* Mobile Sidebar Toggle */}
                        <button 
                            onClick={toggleSidebar}
                            className="p-2 rounded-md text-blue-400 lg:hidden hover:bg-blue-800/50 transition"
                            aria-label="Toggle sidebar menu"
                            aria-expanded={isSidebarOpen}
                        >
                            <Bars3Icon className="w-6 h-6" aria-hidden="true" />
                        </button>
                        <h2 className="text-xl font-extrabold bg-gradient-to-r from-blue-400 to-sky-500 bg-clip-text text-transparent hidden sm:block">
                            Welcome, {userName}!
                        </h2>
                    </div>

                    <div className="flex items-center space-x-4" role="toolbar" aria-label="Quick actions">
                        {/* Notifications */}
                        <AnnouncementBell />

                        <div className="flex items-center space-x-2 border-l border-blue-700/50 pl-4" aria-label={`Logged in as ${userName}`}>
                            <UserCircleIcon className="w-8 h-8 text-blue-400" aria-hidden="true" />
                            <span className="text-sm font-medium text-gray-300 hidden md:block">
                                {userName}
                            </span>
                            <button
                                onClick={logoutUser}
                                className="p-2 rounded-full text-red-500 hover:bg-red-700/30 transition transform hover:scale-110"
                                title="Logout"
                                aria-label="Log out of account"
                            >
                                <PowerIcon className="w-6 h-6" aria-hidden="true" />
                            </button>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 lg:p-10">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default TeacherLayout;
