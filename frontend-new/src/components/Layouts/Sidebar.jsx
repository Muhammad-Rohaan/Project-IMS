import { NavLink } from 'react-router-dom';
// Heroicons import karein (npm install @heroicons/react)
import { HomeIcon, UsersIcon, AcademicCapIcon, BanknotesIcon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext'; // Logout ke liye AuthContext use karenge

// Admin links define karein
const adminNavLinks = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
    { name: 'Students', href: '/admin/az-students', icon: UsersIcon },
    { name: 'Teachers', href: '/admin/az-teachers', icon: AcademicCapIcon },
    { name: 'Receptionists', href: '/admin/az-receptionists', icon: UsersIcon },
    { name: 'Finance/Fees', href: '/admin/finance', icon: BanknotesIcon },
    { name: 'Announcements', href: '/admin/announcements', icon: BellIcon },
];

const Sidebar = ({ role, isOpen, setIsOpen }) => {
    const { logoutUser } = useAuth();

    // Yahan hum sirf Admin role ke links dikha rahe hain
    const links = adminNavLinks;

    const baseClasses = 'flex items-center p-3 rounded-xl transition-all duration-300';
    const activeClasses = 'bg-gradient-to-r from-blue-600 to-sky-500 text-white font-semibold shadow-lg shadow-blue-500/30 border border-blue-400/50';
    const inactiveClasses = 'text-blue-100 hover:bg-blue-800/60 hover:text-sky-300 hover:shadow-lg';

    // Agar role admin nahi hai to kuch nahi dikhega
    if (role !== 'admin') return null;

    return (
        <div className={`w-64 bg-gradient-to-b from-blue-950 via-blue-900 to-blue-950 text-white flex flex-col h-screen
         fixed border-r border-blue-700/30 shadow-2xl z-50 transition-transform duration-300 lg:translate-x-0 ${
           isOpen ? 'translate-x-0' : '-translate-x-full'
         }`}>

            {/* Logo/Title */}
            <div className='p-4 border-b border-blue-700/40 flex items-center justify-between'>
                <h1 className='text-base font-extrabold flex items-center bg-gradient-to-r from-blue-400
                 to-sky-300 bg-clip-text text-transparent leading-tight'>
                    <AcademicCapIcon className='w-7 h-7 mr-2 text-sky-400 flex-shrink-0' />
                    The Fort Of Science And Commerce Education
                </h1>
                {/* Close Button for Mobile */}
                <button
                    onClick={() => setIsOpen(false)}
                    className="lg:hidden p-1 text-gray-400 hover:text-white transition-colors"
                    aria-label="Close sidebar menu"
                    aria-expanded={isOpen}
                >
                    <XMarkIcon className="w-6 h-6" aria-hidden="true" />
                </button>
            </div>

            {/* Navigation Links */}
            <nav className='flex-1 p-4 space-y-3 overflow-y-auto' aria-label="Main navigation">
                {links.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.href}
                        onClick={() => setIsOpen(false)} // Close sidebar on link click (mobile)
                        className={({ isActive }) =>
                            `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
                        }
                        end
                        aria-label={`Navigate to ${item.name}`}
                    >
                        <item.icon className='w-6 h-6 mr-3' aria-hidden="true" />
                        <span className="text-sm font-medium">{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Logout Button */}
            <div className='p-4 border-t border-blue-700/40'>
                <button
                    onClick={logoutUser}
                    className='w-full text-left p-3 rounded-xl text-white
                    bg-gradient-to-r from-red-700 to-red-500 hover:from-red-800
                    hover:to-red-600 transition-all duration-300 flex items-center justify-center
                    shadow-lg hover:shadow-2xl transform hover:scale-105'
                    aria-label="Log out"
                >
                    <span className='text-sm font-medium'>Log Out</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;