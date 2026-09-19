import { useAuth } from '../../context/AuthContext';
import { UserCircleIcon, Bars3Icon, PowerIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import AnnouncementBell from './AnnouncementBell.jsx';

const Navbar = ({ onMenuClick, isSidebarOpen }) => {
    // AuthContext se current user aur logout function use karein
    const { auth, logoutUser } = useAuth();

    const handleLogout = async () => {
        const toastId = toast.loading('Logging out...');
        try {
            await logoutUser();
            // toast.success logic is inside logoutUser in AuthContext
        } catch {
            toast.error('Logout failed', { id: toastId });
        } finally {
            toast.dismiss(toastId);
        }
    };

    const userName = auth.user?.name || 'Admin User';

    return (
        <header className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-900 
         to-blue-950 shadow-2xl border-b border-blue-700/50 text-white">

            {/* Mobile Sidebar Toggle (Agar zaroorat ho) */}
            <button 
                onClick={onMenuClick} 
                className="p-2 rounded-md text-blue-400 lg:hidden hover:bg-blue-800/50 transition"
                aria-label="Open sidebar menu"
                aria-expanded={isSidebarOpen}
            >
                <Bars3Icon className="w-6 h-6" aria-hidden="true" />
            </button>

            {/* Page Title / Search Bar Yahan Aasakta Hai */}
            <h2 className="welcome-admin text-xl font-extrabold bg-gradient-to-r from-blue-400 to-sky-500 bg-clip-text
             text-transparent hidden sm:block">
                Welcome, {userName}!
            </h2>

            {/* Right Side Icons and User Dropdown */}
            <div className="flex items-center space-x-4" role="toolbar" aria-label="Quick actions">

                {/* Notifications */}
                <AnnouncementBell />

                {/* User Profile / Dropdown */}
                <div className="flex items-center space-x-2 border-l border-blue-700/50 pl-4" aria-label={`Logged in as ${userName}`}>
                    <UserCircleIcon className="w-8 h-8 text-blue-400" aria-hidden="true" />
                    <span className="text-sm font-medium text-gray-300 hidden md:block">
                        {userName}
                    </span>

                    {/* Logout Button (Quick Access) */}
                    <button
                        onClick={handleLogout}
                        className="p-2 rounded-full text-red-500 hover:bg-red-700/30 
                        transition transform hover:scale-110"
                        title="Logout"
                        aria-label="Log out of account"
                    >
                        <PowerIcon className="w-6 h-6" aria-hidden="true" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
