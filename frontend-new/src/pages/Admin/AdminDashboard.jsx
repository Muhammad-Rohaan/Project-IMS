// src/pages/Admin/AdminDashboard.jsx

import React from 'react';
import { Outlet } from 'react-router-dom'; // agar nested routes use kar rahey ho
import Sidebar from '../../components/Layouts/Sidebar';
import Navbar from '../../components/Layouts/Navbar';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
    const { auth } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    // Agar admin nahi hai (protection already ProtectedRoute se ho rahi hai, lekin safe side)
    if (auth.user?.role !== 'admin') {
        // Redirect ya unauthorized dikhao
        return null;
    }

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (

        // Flex container jo poori screen (h-screen) ko cover karega
        <div className='flex h-screen bg-gradient-to-br from-slate-900 to-blue-950 
         overflow-hidden relative'>

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

            {/* 1. SIDEBAR (Navigation) - Fixed */}
            {/* Hum role "admin" explicitly bhej rahe hain */}
            <Sidebar role="admin" isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 lg:ml-64">
                {/* Navbar */}
                <Navbar onMenuClick={toggleSidebar} isSidebarOpen={isSidebarOpen} />

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10">
                    <Outlet />
                </main>
            </div >
        </div >
    );
};

export default AdminDashboard;