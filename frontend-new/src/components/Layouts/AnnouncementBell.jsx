import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { BellIcon } from '@heroicons/react/24/outline';
import axiosInstance from '../../api/axios.js';


// FIX THIS ACCORDING TO BACKEND | May - 8
/*
{
  "announcement": [
    {
      "_id": "69ee75838a7fed605cbbbea4",
      "title": "Off Today",
      "message": "due to rain all classes today has been cancelled",
      "target": "all",
      "className": "N/A",
      "createdBy": "Abbas",
      "createdAt": "2026-04-26T20:28:51.266Z",
      "updatedAt": "2026-04-26T20:28:51.266Z",
      "__v": 0
    }
  ],
  "myAnnouncement": [
    {
      "_id": "69f90cbcfb003ecece1275c5",
      "title": "War",
      "message": "online class",
      "target": "specific-class",
      "className": "9",
      "createdBy": "Abbas",
      "createdAt": "2026-05-04T21:16:44.892Z",
      "updatedAt": "2026-05-04T21:16:44.892Z",
      "__v": 0
    }
  ]
}
*/


const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' });

const AnnouncementBell = ({ classNameProp }) => {
    const [open, setOpen] = useState(false);
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(false);
    const [unread, setUnread] = useState(0);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });
    const bellRef = useRef(null);

    /* ── Fetch on mount ── */
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Unified endpoint for everyone: /announcement/:className
                // If classNameProp is "N/A" or missing, we use "all"
                const param = (classNameProp && classNameProp !== 'N/A') ? classNameProp : 'all';
                const endpoint = `/announcement/${param}`;
                
                const res = await axiosInstance.get(endpoint);
                
                // Backend returns { announcement: [], myAnnouncement: [] }
                const globalData = Array.isArray(res.data.announcement) ? res.data.announcement : [];
                const classData = Array.isArray(res.data.myAnnouncement) ? res.data.myAnnouncement : [];
                
                // Filter out any duplicates and sort by date
                const combined = [...globalData, ...classData]
                    .filter((ann, index, self) => 
                        ann && ann._id && index === self.findIndex((t) => t._id?.toString() === ann._id?.toString())
                    )
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                setAnnouncements(combined);

                // Calculate unread: filter out IDs already in localStorage
                const readIds = JSON.parse(localStorage.getItem('readAnnouncements') || '[]');
                const unreadCount = combined.filter(ann => ann._id && !readIds.includes(ann._id.toString())).length;
                setUnread(unreadCount);
            } catch (err) {
                console.error('Bell fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [classNameProp]);

    /* ── Close on outside click ── */
    useEffect(() => {
        const handler = (e) => {
            if (bellRef.current && !bellRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleOpen = () => {
        if (!open && bellRef.current) {
            const rect = bellRef.current.getBoundingClientRect();
            setDropdownPos({
                top: rect.bottom + 8,
                right: window.innerWidth - rect.right,
            });

            // Mark all currently loaded announcements as read when opening
            if (announcements.length > 0) {
                const currentIds = announcements.map(ann => ann._id?.toString()).filter(Boolean);
                const readIds = JSON.parse(localStorage.getItem('readAnnouncements') || '[]');
                const updatedReadIds = [...new Set([...readIds, ...currentIds])].slice(-100);
                localStorage.setItem('readAnnouncements', JSON.stringify(updatedReadIds));
                setUnread(0);
            }
        }
        setOpen(prev => !prev);
    };

    const dropdown = (
        <div
            style={{
                position: 'fixed',
                top: dropdownPos.top,
                right: dropdownPos.right,
                zIndex: 99999,
            }}
            className="w-80 sm:w-96 rounded-2xl border border-blue-400/20 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 shadow-2xl shadow-blue-500/10 overflow-hidden"
        >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <h3 className="text-sm font-bold bg-gradient-to-r from-blue-400 to-sky-400 bg-clip-text text-transparent">
                    📢 Announcements
                </h3>
                <span className="text-xs text-gray-500">{announcements.length} total</span>
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
                {loading ? (
                    <div className="p-4 space-y-3">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="animate-pulse space-y-1">
                                <div className="h-3 w-2/3 rounded bg-white/10" />
                                <div className="h-2 w-full rounded bg-white/10" />
                            </div>
                        ))}
                    </div>
                ) : announcements.length === 0 ? (
                    <div className="p-6 text-center text-gray-500 text-sm">
                        <div className="text-3xl mb-2">📭</div>
                        No announcements yet
                    </div>
                ) : (
                    announcements.map((ann) => (
                        <div key={ann._id} className="px-4 py-3 hover:bg-white/5 transition">
                            <div className="flex items-start justify-between gap-2">
                                <p className="text-sm font-semibold text-white leading-snug">
                                    {ann.title}
                                </p>
                                <span className={`flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                                    ann.target === 'all'
                                        ? 'bg-blue-500/20 text-blue-300 border-blue-400/30'
                                        : 'bg-sky-500/20 text-sky-300 border-sky-400/30'
                                }`}>
                                    {ann.target === 'all' ? 'All' : ann.className}
                                </span>
                            </div>
                            <p className="text-xs text-gray-400 mt-1 line-clamp-2">{ann.message}</p>
                            <p className="text-[10px] text-gray-600 mt-1.5">
                                {ann.createdBy} · {formatDate(ann.createdAt)}
                            </p>
                        </div>
                    ))
                )}
            </div>

            {/* Footer */}
            {announcements.length > 0 && (
                <div className="px-4 py-2 border-t border-white/10 text-center">
                    <p className="text-xs text-gray-500">Scroll to see all announcements</p>
                </div>
            )}
        </div>
    );

    return (
        <div ref={bellRef} className="relative">
            {/* Bell Button */}
            <button
                onClick={handleOpen}
                className="relative p-2 text-blue-400 hover:text-sky-400 hover:bg-blue-800/50 rounded-full transition"
                aria-label="View announcements"
            >
                <BellIcon className="w-6 h-6" aria-hidden="true" />
                {unread > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 text-[10px] font-bold bg-red-500 text-white rounded-full flex items-center justify-center">
                        {unread > 9 ? '9+' : unread}
                    </span>
                )}
            </button>

            {/* Dropdown via Portal — escapes header overflow */}
            {open && createPortal(dropdown, document.body)}
        </div>
    );
};

export default AnnouncementBell;