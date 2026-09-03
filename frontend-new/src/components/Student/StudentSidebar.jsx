import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, XMarkIcon, AcademicCapIcon, KeyIcon } from '@heroicons/react/24/outline';

const StudentSidebar = ({ isOpen, setIsOpen }) => {
    return (
        <div className={`w-64 bg-gradient-to-b from-blue-950 via-blue-900 to-blue-950 text-white flex flex-col h-screen fixed z-50 transition-transform duration-300 border-r border-blue-700/30 shadow-2xl lg:translate-x-0 ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
            <div className="p-6 border-b border-blue-700/40 flex items-center justify-between">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent flex items-center">
                    <AcademicCapIcon className="w-6 h-6 mr-2 text-sky-400" aria-hidden="true" />
                    Student Panel
                </h1>
                <button
                    onClick={() => setIsOpen(false)}
                    className="lg:hidden p-1 text-gray-400 hover:text-white transition-colors"
                    aria-label="Close sidebar"
                    aria-expanded={isOpen}
                >
                    <XMarkIcon className="w-6 h-6" aria-hidden="true" />
                </button>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto" aria-label="Student primary navigation">
                <NavLink
                    to="/student/dashboard"
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                        `flex items-center p-3 rounded-xl transition-all duration-300 ${isActive
                            ? 'bg-gradient-to-r from-blue-600 to-sky-500 shadow-lg shadow-blue-500/30 font-semibold border border-blue-400/50'
                            : 'hover:bg-blue-800/60 text-blue-100 hover:text-sky-300'}`
                    }
                    aria-label="Go to student dashboard"
                >
                    <HomeIcon className="w-6 h-6 mr-3" aria-hidden="true" />
                    <span className="text-sm font-medium">Dashboard</span>
                </NavLink>

                <NavLink
                    to="/student/change-password"
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                        `flex items-center p-3 rounded-xl transition-all duration-300 ${isActive
                            ? 'bg-gradient-to-r from-blue-600 to-sky-500 shadow-lg shadow-blue-500/30 font-semibold border border-blue-400/50'
                            : 'hover:bg-blue-800/60 text-blue-100 hover:text-sky-300'}`
                    }
                    aria-label="Change password"
                >
                    <KeyIcon className="w-6 h-6 mr-3" aria-hidden="true" />
                    <span className="text-sm font-medium">Password</span>
                </NavLink>
            </nav>
        </div>
    );
};

export default StudentSidebar;
