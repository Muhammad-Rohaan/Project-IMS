import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../api/axios.js';
import toast from 'react-hot-toast';
import PostAnnouncementModal from './PostAnnouncementModal.jsx';

/* ── Helpers ── */
const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' });
};

const targetBadge = (target) =>
    target === 'all'
        ? { label: '📣 All', cls: 'bg-blue-500/20 text-blue-300 border-blue-400/30' }
        : { label: '🎓 Class', cls: 'bg-sky-500/20 text-sky-300 border-sky-400/30' };

/* ── Skeleton Card ── */
const SkeletonCard = () => (
    <div className="rounded-2xl border border-white/5 bg-white/5 p-5 animate-pulse space-y-3">
        <div className="h-4 w-2/3 rounded bg-white/10" />
        <div className="h-3 w-full rounded bg-white/10" />
        <div className="h-3 w-4/5 rounded bg-white/10" />
        <div className="h-3 w-1/3 rounded bg-white/10" />
    </div>
);

/* ── Single Announcement Card ── */
const AnnouncementCard = ({ ann, index }) => {
    const badge = targetBadge(ann.target);
    return (
        <article
            className="relative rounded-2xl border border-blue-400/15 bg-gradient-to-br from-blue-950/60 to-slate-900/60 backdrop-blur-md p-5 shadow-lg hover:shadow-blue-500/10 hover:border-blue-400/30 transition-all duration-300 group"
            style={{ animationDelay: `${index * 60}ms` }}
            aria-label={`Announcement: ${ann.title}`}
        >
            {/* Left accent bar */}
            <div className="absolute left-0 top-4 bottom-4 w-1 rounded-r-full bg-gradient-to-b from-blue-400 to-sky-500 opacity-70 group-hover:opacity-100 transition-opacity" />

            <div className="pl-4">
                {/* Top row */}
                <div className="flex items-start justify-between gap-3 flex-wrap">
                    <h3 className="text-base font-bold text-white leading-snug">{ann.title}</h3>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${badge.cls}`}>
                            {badge.label}
                        </span>
                        {ann.target === 'specific-class' && ann.className && (
                            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                                {ann.className}
                            </span>
                        )}
                    </div>
                </div>

                {/* Message */}
                <p className="text-gray-400 text-sm mt-2.5 leading-relaxed line-clamp-3">
                    {ann.message}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
                    <span>
                        <span className="text-gray-400 font-medium">{ann.createdBy}</span>
                    </span>
                    <time dateTime={ann.createdAt}>{formatDate(ann.createdAt)}</time>
                </div>
            </div>
        </article>
    );
};

/* ── Empty State ── */
const EmptyState = ({ onPost }) => (
    <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-6xl mb-4" aria-hidden="true">📭</div>
        <h3 className="text-xl font-bold text-white mb-2">No Announcements Yet</h3>
        <p className="text-gray-400 text-sm max-w-xs mb-6">
            Nothing has been posted yet. Be the first to broadcast something!
        </p>
        <button
            onClick={onPost}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-500 hover:to-red-500 text-white font-bold text-sm shadow-lg shadow-pink-500/30 transition"
        >
            📢 Post First Announcement
        </button>
    </div>
);

/* ── Filter Pill ── */
const FilterPill = ({ label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200 ${active
                ? 'bg-gradient-to-r from-blue-500 to-sky-600 border-transparent text-white shadow-md shadow-blue-500/20'
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20'
            }`}
    >
        {label}
    </button>
);

/* ══════════════════════════════════
   MAIN PAGE
══════════════════════════════════ */
const AnnouncementPage = () => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [filter, setFilter] = useState('all');       // 'all' | 'specific-class'
    const [search, setSearch] = useState('');

    /* ── Fetch ── */
    const fetchAnnouncements = useCallback(async () => {
        setLoading(true);
        try {
            // Using 'all' as a default parameter to match the backend's /:className route
            const res = await axiosInstance.get('/announcement/all');
            
            const globalAnn = res.data.announcement || [];
            const classAnn = res.data.myAnnouncement || [];
            
            // Combine both global and specific class announcements for the admin view
            const combined = [...globalAnn, ...classAnn].sort((a, b) => 
                new Date(b.createdAt) - new Date(a.createdAt)
            );
            
            setAnnouncements(combined);
        } catch (err) {
            toast.error('Failed to load announcements.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchAnnouncements(); }, [fetchAnnouncements]);

    /* ── After new announcement posted ── */
    const handleCreated = (newAnn) => {
        setAnnouncements(prev => [newAnn, ...prev]);
    };

    /* ── Derived list ── */
    const filtered = announcements
        .filter(a => filter === 'all' ? true : a.target === filter)
        .filter(a =>
            search.trim() === '' ? true :
                a.title.toLowerCase().includes(search.toLowerCase()) ||
                a.message.toLowerCase().includes(search.toLowerCase())
        );

    return (
        <main
            className="min-h-screen space-y-8 p-6 lg:p-10 bg-gradient-to-br from-slate-900 to-blue-950"
            aria-labelledby="announcements-title"
        >
            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-pink-500 to-red-600 shadow-lg shadow-pink-500/30" aria-hidden="true">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-2.236 9.168-5.5a.75.75 0 011 .695V19.5a.75.75 0 01-1 .695C16.457 18.736 12.932 16.5 8.832 16.5H7a3.99 3.99 0 01-1.564-.317z" />
                        </svg>
                    </div>
                    <div>
                        <h1
                            id="announcements-title"
                            className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 via-sky-500 to-pink-500 bg-clip-text text-transparent"
                        >
                            Announcements
                        </h1>
                        <p className="text-gray-400 text-sm mt-0.5">
                            {loading ? '—' : `${announcements.length} total announcement${announcements.length !== 1 ? 's' : ''}`}
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-500 hover:to-red-500 text-white font-bold text-sm shadow-lg shadow-pink-500/30 transition-all hover:scale-105"
                >
                    <span aria-hidden="true">📢</span> Post Announcement
                </button>
            </div>

            {/* ── Controls: Search + Filter ── */}
            <section
                className="bg-blue-950/50 backdrop-blur-md rounded-2xl border border-blue-400/20 p-4 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center"
                aria-label="Announcement filters"
            >
                {/* Search */}
                <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" aria-hidden="true">🔍</span>
                    <input
                        type="search"
                        placeholder="Search by title or message..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        aria-label="Search announcements"
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition"
                    />
                </div>

                {/* Filter pills */}
                <div className="flex gap-2 flex-wrap" role="group" aria-label="Filter by target">
                    <FilterPill label="📣 All" active={filter === 'all'} onClick={() => setFilter('all')} />
                    <FilterPill label="🎓 Specific Class" active={filter === 'specific-class'} onClick={() => setFilter('specific-class')} />
                </div>
            </section>

            {/* ── Announcements List ── */}
            <section aria-label="Announcements list" aria-live="polite">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="bg-blue-950/50 backdrop-blur-md rounded-2xl border border-blue-400/20 p-6">
                        {announcements.length === 0
                            ? <EmptyState onPost={() => setShowModal(true)} />
                            : (
                                <div className="text-center py-12 text-gray-400">
                                    <div className="text-4xl mb-3" aria-hidden="true">🔎</div>
                                    <p>No announcements match your search or filter.</p>
                                </div>
                            )
                        }
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filtered.map((ann, i) => (
                            <AnnouncementCard key={ann._id} ann={ann} index={i} />
                        ))}
                    </div>
                )}
            </section>

            {/* ── Modal ── */}
            {showModal && (
                <PostAnnouncementModal
                    onClose={() => setShowModal(false)}
                    onCreated={handleCreated}
                    createdBy={user?.name}   // pass logged-in user's name/role here if available
                />
            )}
        </main>
    );
};

export default AnnouncementPage;