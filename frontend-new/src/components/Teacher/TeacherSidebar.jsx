import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, UsersIcon, PhotoIcon, XMarkIcon, KeyIcon } from '@heroicons/react/24/outline';

const TeacherSidebar = ({ isOpen, setIsOpen }) => {
    return (
        <div className={`w-64 bg-gradient-to-b from-blue-950 via-blue-900 to-blue-950 text-white flex flex-col h-screen fixed z-50 transition-transform duration-300 lg:translate-x-0 ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
            <div className="p-8 border-b border-blue-700/40 flex items-center justify-between">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent">
                    Teacher Panel
                </h1>
                <button
                    onClick={() => setIsOpen(false)}
                    className="lg:hidden p-1 text-gray-400 hover:text-white transition-colors"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>
            </div>

            <nav className="flex-1 p-6 space-y-3 overflow-y-auto">
                <NavLink
                    to="/teacher/dashboard"
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                        `flex items-center p-4 rounded-xl transition-all ${isActive
                            ? 'bg-gradient-to-r from-blue-600 to-sky-500 shadow-lg shadow-blue-500/30'
                            : 'hover:bg-blue-800/60 text-blue-100 hover:text-sky-300'}`
                    }
                >
                    <HomeIcon className="w-6 h-6 mr-4" />
                    Dashboard
                </NavLink>

                <NavLink
                    to="/teacher/students"
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                        `flex items-center p-4 rounded-xl transition-all ${isActive
                            ? 'bg-gradient-to-r from-blue-600 to-sky-500 shadow-lg shadow-blue-500/30'
                            : 'hover:bg-blue-800/60 text-blue-100 hover:text-sky-300'}`
                    }
                >
                    <UsersIcon className="w-6 h-6 mr-4" />
                    Students
                </NavLink>

                <NavLink
                    to="/teacher/results"
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                        `flex items-center p-4 rounded-xl transition-all ${isActive
                            ? 'bg-gradient-to-r from-blue-600 to-sky-500 shadow-lg shadow-blue-500/30'
                            : 'hover:bg-blue-800/60 text-blue-100 hover:text-sky-300'}`
                    }
                >
                    <PhotoIcon className="w-6 h-6 mr-4" />
                    Results
                </NavLink>

                <NavLink
                    to="/teacher/change-password"
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                        `flex items-center p-4 rounded-xl transition-all ${isActive
                            ? 'bg-gradient-to-r from-blue-600 to-sky-500 shadow-lg shadow-blue-500/30'
                            : 'hover:bg-blue-800/60 text-blue-100 hover:text-sky-300'}`
                    }
                >
                    <KeyIcon className="w-6 h-6 mr-4" />
                    Password
                </NavLink>
            </nav>
        </div>
    );
};

export default TeacherSidebar;
