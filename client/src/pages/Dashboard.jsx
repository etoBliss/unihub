import React, { useState, useEffect, useContext } from 'react';
import { api } from '../context/AuthContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/announcements');
                setAnnouncements(res.data.slice(0, 3));
            } catch (err) {
                console.error('Dashboard data error:', err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    /* ─── Relative time generator for announcements ─── */
    const relTime = (iso) => {
        const diff = Date.now() - new Date(iso).getTime();
        const hrs = Math.floor(diff / 3600000);
        if (hrs < 1) return 'Just now';
        if (hrs < 24) return `${hrs}h ago`;
        const days = Math.floor(hrs / 24);
        return `${days}d ago`;
    };

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <section className="mt-2">
                <h2 className="font-headline-xl-mobile md:font-headline-xl text-headline-xl-mobile md:text-headline-xl text-primary font-bold">
                    Hello, {user?.name?.split(' ')[0] || 'Ladokite'}
                </h2>
                <p className="text-on-surface-variant font-body-lg text-sm md:text-base mt-1">
                    Here is your academic overview for today.
                </p>
            </section>

            {/* Bento Grid */}
            <div className="grid grid-cols-12 gap-6 lg:gap-8 items-start">

                {/* Left Column: Active Transmission & Recent Announcements */}
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">

                    {/* Active Transmission Card (Bento Piece 1) */}
                    <section className="bg-primary-container rounded-xl p-6 text-white overflow-hidden relative diffuse-shadow">
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <span className="px-2 py-1 bg-secondary text-primary font-bold text-[10px] rounded uppercase tracking-tighter">
                                    Active Transmission
                                </span>
                                <span className="material-symbols-outlined text-secondary-fixed-dim" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    sensors
                                </span>
                            </div>
                            <h3 className="font-title-md text-title-md text-white mb-2 font-bold">
                                ENG 401: Lecture in Progress
                            </h3>
                            <p className="text-on-primary-container text-sm leading-relaxed mb-4">
                                Main Auditorium • 324 students joined
                            </p>
                            <button
                                onClick={() => navigate('/portal/chat')}
                                className="w-full py-3 bg-white text-primary font-bold rounded-lg transition-transform active:scale-95 shadow-md hover:bg-white/95"
                            >
                                Join Session
                            </button>
                        </div>
                        {/* Decorative atmospheric element */}
                        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-secondary opacity-10 rounded-full blur-3xl"></div>
                    </section>

                    {/* Recent Verified Announcements (Bento Piece 2) */}
                    <section className="bg-white rounded-xl p-6 diffuse-shadow flex flex-col gap-4 border border-surface-container-high">
                        <div className="flex items-center justify-between border-b border-surface-container pb-3">
                            <h3 className="font-title-md text-title-md text-primary flex items-center gap-2 font-bold">
                                <span className="material-symbols-outlined text-secondary">campaign</span>
                                Announcements
                            </h3>
                            <span className="text-[10px] font-bold text-secondary uppercase tracking-widest bg-secondary-container/30 px-2 py-0.5 rounded">
                                Verified
                            </span>
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center py-12 text-on-surface-variant text-sm gap-3">
                                <div className="w-5 h-5 border-2 border-secondary border-t-transparent rounded-full animate-spin"></div>
                                Syncing announcements...
                            </div>
                        ) : announcements.length === 0 ? (
                            <div className="py-8 text-center text-on-surface-variant text-sm">
                                No recent announcements available.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {announcements.map((ann, index) => (
                                    <div
                                        key={ann._id}
                                        onClick={() => navigate('/portal/announcements')}
                                        className="flex gap-4 items-start group cursor-pointer hover:translate-x-0.5 transition-transform"
                                    >
                                        <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${index === 0 ? 'bg-secondary' : 'bg-outline-variant/60'}`}></div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-body-md font-semibold text-primary line-clamp-2 hover:text-secondary transition-colors">
                                                {ann.title}
                                            </p>
                                            <p className="text-[11px] text-on-surface-variant mt-1.5">
                                                {relTime(ann.createdAt)} • {ann.author || 'Academic Registry'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <button
                            onClick={() => navigate('/portal/announcements')}
                            className="w-full py-3 mt-2 bg-surface-container-low text-primary font-bold rounded-lg text-sm hover:bg-surface-container transition-colors"
                        >
                            View All Announcements
                        </button>
                    </section>

                </div>

                {/* Right Column: Resource Shortcuts & Upcoming Schedule */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">

                    {/* Resource Shortcuts (Bento Piece 3) */}
                    <section className="grid grid-cols-2 gap-4">
                        <div
                            onClick={() => navigate('/portal/repository')}
                            className="bg-white p-5 rounded-xl border border-surface-container-high shadow-sm flex flex-col gap-4 active:scale-95 transition-all hover:-translate-y-0.5 cursor-pointer group"
                        >
                            <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
                                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    folder_open
                                </span>
                            </div>
                            <div>
                                <h4 className="font-semibold text-primary text-sm">E-Library</h4>
                                <p className="text-[11px] text-on-surface-variant">Resources Hub</p>
                            </div>
                        </div>

                        <div
                            onClick={() => window.open('https://student.lautech.edu.ng/', '_blank')}
                            className="bg-white p-5 rounded-xl border border-surface-container-high shadow-sm flex flex-col gap-4 active:scale-95 transition-all hover:-translate-y-0.5 cursor-pointer group"
                        >
                            <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
                                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    payments
                                </span>
                            </div>
                            <div>
                                <h4 className="font-semibold text-primary text-sm">Portals</h4>
                                <p className="text-[11px] text-on-surface-variant">Fee Payments</p>
                            </div>
                        </div>

                        <div
                            onClick={() => navigate('/portal/chat')}
                            className="bg-white p-5 rounded-xl border border-surface-container-high shadow-sm flex flex-col gap-4 active:scale-95 transition-all hover:-translate-y-0.5 cursor-pointer group"
                        >
                            <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
                                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    groups
                                </span>
                            </div>
                            <div>
                                <h4 className="font-semibold text-primary text-sm">Collab</h4>
                                <p className="text-[11px] text-on-surface-variant">Study Groups</p>
                            </div>
                        </div>

                        <div
                            onClick={() => navigate('/portal/guide')}
                            className="bg-white p-5 rounded-xl border border-surface-container-high shadow-sm flex flex-col gap-4 active:scale-95 transition-all hover:-translate-y-0.5 cursor-pointer group"
                        >
                            <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
                                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    map
                                </span>
                            </div>
                            <div>
                                <h4 className="font-semibold text-primary text-sm">Campus</h4>
                                <p className="text-[11px] text-on-surface-variant">Navigation</p>
                            </div>
                        </div>
                    </section>

                    {/* Upcoming Schedule Card */}
                    <section className="bg-white rounded-xl p-6 border border-surface-container-high shadow-sm flex flex-col gap-4">
                        <h3 className="font-title-md text-title-md text-primary font-bold mb-1">
                            Upcoming Schedule
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-3 rounded-lg border-l-[3px] border-secondary bg-surface-container-lowest shadow-sm">
                                <div className="flex flex-col items-center justify-center min-w-[40px] bg-surface-container px-2 py-1 rounded">
                                    <span className="text-[10px] font-bold text-on-surface-variant uppercase">FEB</span>
                                    <span className="text-sm font-extrabold text-primary">25</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-primary truncate">MTH 402 Exam Prep</p>
                                    <p className="text-[10px] text-on-surface-variant mt-0.5">Lecture Theatre 1 • 09:00 AM</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-3 rounded-lg border-l-[3px] border-outline-variant bg-surface-container-lowest shadow-sm opacity-80">
                                <div className="flex flex-col items-center justify-center min-w-[40px] bg-surface-container px-2 py-1 rounded">
                                    <span className="text-[10px] font-bold text-on-surface-variant uppercase">MAR</span>
                                    <span className="text-sm font-extrabold text-primary">02</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-primary truncate">FYP Proposal Submission</p>
                                    <p className="text-[10px] text-on-surface-variant mt-0.5">Faculty Office • 12:00 PM</p>
                                </div>
                            </div>
                        </div>
                    </section>

                </div>

            </div>

            {/* Floating Action Button (FAB) - Mobile only */}
            <div className="fixed bottom-24 right-4 z-40 md:hidden">
                <button
                    onClick={() => navigate('/portal/repository')}
                    className="w-14 h-14 rounded-2xl bg-primary-container text-white shadow-2xl flex items-center justify-center transition-all transform scale-100 active:scale-90 active:rotate-12 hover:brightness-110"
                >
                    <span className="material-symbols-outlined text-[28px]">add</span>
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
