import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { UserCircleIcon, PowerIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import ReceptionSidebar from '../../components/Reception/ReceptionSidebar.jsx';
import AnnouncementBell from './AnnouncementBell.jsx';

const ReceptionLayout = () => {
    const { auth, logoutUser } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const userName = auth.user?.fullName || auth.user?.name || 'Reception User';

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="flex h-screen bg-gradient-to-br from-slate-900 to-blue-950 overflow-hidden relative">
            {/* Mobile Overlay */}
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

            {/* Sidebar */}
            <ReceptionSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 lg:ml-64">
                {/* Top Navbar */}
                <header className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-900 to-blue-950 shadow-2xl border-b border-blue-700/50 text-white z-30">
                    <div className="flex items-center">
                        <button 
                            onClick={toggleSidebar}
                            className="p-2 mr-2 text-blue-400 hover:bg-blue-800/50 rounded-lg lg:hidden transition"
                            aria-label="Toggle sidebar menu"
                            aria-expanded={isSidebarOpen}
                        >
                            {isSidebarOpen ? <XMarkIcon className="w-6 h-6" aria-hidden="true" /> : <Bars3Icon className="w-6 h-6" aria-hidden="true" />}
                        </button>
                        <h2 className="text-lg md:text-xl font-extrabold bg-gradient-to-r from-blue-400 to-sky-500 bg-clip-text text-transparent truncate max-w-[150px] sm:max-w-none">
                            Welcome, {userName}!
                        </h2>
                    </div>

                    {/* Right Side Icons and User Dropdown */}
                    <div className="flex items-center space-x-2 md:space-x-4" role="toolbar" aria-label="Quick actions">
                        {/* Notifications */}
                        <AnnouncementBell />

                        {/* User Profile */}
                        <div className="flex items-center space-x-2 border-l border-blue-700/50 pl-2 md:pl-4" aria-label={`Logged in as ${userName}`}>
                            <UserCircleIcon className="w-8 h-8 text-blue-400" aria-hidden="true" />
                            <span className="text-xs md:text-sm font-medium text-gray-300 hidden md:block">
                                {userName}
                            </span>

                            {/* Logout */}
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

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default ReceptionLayout;
