import React, { useState, useEffect, useContext } from 'react';
import { api } from '../context/AuthContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    ShieldCheck,
    ChevronRight,
    FolderOpen,
    FileText,
    Table,
    File,
    Download,
    MoreHorizontal,
    Bell,
} from 'lucide-react';

/* ─── Static mock recent resources ─── */
const RECENT_RESOURCES = [
    { icon: FileText, color: 'text-red-600', bg: 'bg-red-50', name: 'MEE501_Lecture_Notes.pdf', meta: '2.4 MB • Downloaded 1hr ago' },
    { icon: File, color: 'text-blue-600', bg: 'bg-blue-50', name: 'Exam_Slip_Semester_1.docx', meta: '450 KB • Downloaded yesterday' },
    { icon: Table, color: 'text-green-600', bg: 'bg-green-50', name: 'Course_Registration_Final.xls', meta: '1.2 MB • Downloaded 3 days ago' },
];

/* ─── Static mock transmissions ─── */
const TRANSMISSIONS = [
    {
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAW_aYPTIiOClOMznGY5yli7UJmqtD97ZLFCmBvi_lWFwkfvcmA-DZnAhxu6Fm-5M5s8BiWxY3k_q4WYx8I4RTm7vtK_hmlijnejdI9SKy5gqD7O20HtJzeXfubErcaXegnnDy3Z4mrlVdajafXel-K_Qm7RxlVFYiWzKcB3v9eZud6-ksyvRBdDylv3OlaYjdBhdL-FN829rckFBrVRA8rfLzZgpZOEmchDQreUBIV69E27c1xO8B39N1kFJVF1rdW1-Fyg52EdA',
        name: 'Prof. Adekunle (HOD)',
        sub: 'Academic Inquiry',
        preview: '"Please ensure the project proposals are submitted by..."',
    },
    {
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNILocIQ6z4zJ4QlVYjBjirZjnYpeSUkSUjDHIJmzzlC90-ZVkud1WDWE9Pvgs8pqCpVi9G5AEKW8lBYRwAW4CV3yR_28BCnsBi9jP7bgdUAKoWWfWels2CyoLU_nBRbA2nxf39ut3tYpvPjsm5m49hXZ2qHfLx3ZOxB8cUotwtnOjU7AoJ517b6MjbkCJS9-R1aKX0f5YQ2xPXfj7_cSK33OvvOVNAd1qKdpoJJxGI5rkeVlvz62RgUuzbqF3zntB_-q4VtTGAQ',
        name: 'Design Team Beta',
        sub: '4 members active',
        preview: '"I\'ve uploaded the latest wireframes to the hub..."',
    },
    {
        avatar: null,
        name: 'System Dispatch',
        sub: 'Portal Maintenance',
        preview: '"Maintenance scheduled for Sunday 12:00 AM..."',
    },
];

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

    /* ─── Month/day label for announcement date badge ─── */
    const dateParts = (iso) => {
        const d = new Date(iso);
        return {
            month: d.toLocaleString('default', { month: 'short' }).toUpperCase(),
            day: d.getDate(),
        };
    };

    /* ─── Relative time ─── */
    const relTime = (iso) => {
        const diff = Date.now() - new Date(iso).getTime();
        const hrs = Math.floor(diff / 3600000);
        if (hrs < 24) return `${hrs} hour${hrs !== 1 ? 's' : ''} ago`;
        const days = Math.floor(hrs / 24);
        return `${days} day${days !== 1 ? 's' : ''} ago`;
    };

    return (
        <div className="space-y-8">
            {/* Page Greeting */}
            <div>
                <h2 className="font-headline-xl text-headline-xl text-primary font-bold mb-1">
                    Hello, {user?.name?.split(' ')[0] || 'Ladokite'}.
                </h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant">
                    Your curated institutional overview for today.
                </p>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-12 gap-8">

                {/* Widget A: Announcements — 8/12 cols */}
                <section className="col-span-12 lg:col-span-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="font-title-md text-title-md text-primary flex items-center gap-2 font-semibold">
                            <ShieldCheck className="w-5 h-5 text-secondary" />
                            Recent Verified Announcements
                        </h3>
                        <button
                            onClick={() => navigate('/portal/announcements')}
                            className="text-sm font-semibold text-secondary hover:underline"
                        >
                            View Archive
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-16 text-on-surface-variant text-sm gap-3">
                            <div className="w-5 h-5 border-2 border-secondary border-t-transparent rounded-full animate-spin"></div>
                            Syncing...
                        </div>
                    ) : announcements.length === 0 ? (
                        <div className="py-12 text-center bg-white rounded-xl text-on-surface-variant text-sm diffuse-shadow">
                            No verified announcements available.
                        </div>
                    ) : (
                        announcements.map((ann) => {
                            const { month, day } = dateParts(ann.createdAt);
                            return (
                                <div
                                    key={ann._id}
                                    className="bg-white rounded-xl p-6 diffuse-shadow border-l-[6px] border-secondary flex gap-6 hover:-translate-y-1 transition-transform duration-300 cursor-pointer"
                                    onClick={() => navigate('/portal/announcements')}
                                >
                                    {/* Date badge */}
                                    <div className="shrink-0 w-16 h-16 bg-surface-container rounded-lg flex flex-col items-center justify-center text-primary">
                                        <span className="text-xs font-bold uppercase">{month}</span>
                                        <span className="text-xl font-extrabold">{day}</span>
                                    </div>
                                    {/* Body */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                            <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                                                {ann.targetDepartment || 'General'}
                                            </span>
                                            <span className="text-xs text-on-surface-variant">
                                                Published {relTime(ann.createdAt)}
                                            </span>
                                        </div>
                                        <h4 className="font-semibold text-base text-primary mb-1 truncate">{ann.title}</h4>
                                        <p className="text-on-surface-variant text-sm line-clamp-2 leading-relaxed">{ann.content}</p>
                                    </div>
                                    {/* Arrow */}
                                    <div className="self-center shrink-0">
                                        <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-secondary hover:text-white transition-colors">
                                            <ChevronRight className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </section>

                {/* Widget B: Resource Shortcuts — 4/12 cols */}
                <section className="col-span-12 lg:col-span-4 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="font-title-md text-title-md text-primary font-semibold">Resource Shortcuts</h3>
                        <MoreHorizontal className="w-5 h-5 text-on-surface-variant cursor-pointer" />
                    </div>
                    <div className="bg-white rounded-xl diffuse-shadow overflow-hidden">
                        <div className="p-2 space-y-1">
                            {RECENT_RESOURCES.map(({ icon: Icon, color, bg, name, meta }) => (
                                <div
                                    key={name}
                                    className="p-4 hover:bg-surface-container-low rounded-lg transition-colors cursor-pointer group flex items-center gap-4"
                                    onClick={() => navigate('/portal/repository')}
                                >
                                    <div className={`w-10 h-10 rounded ${bg} flex items-center justify-center shrink-0`}>
                                        <Icon className={`w-5 h-5 ${color}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-primary truncate">{name}</p>
                                        <p className="text-[11px] text-on-surface-variant">{meta}</p>
                                    </div>
                                    <Download className="w-4 h-4 text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => navigate('/portal/repository')}
                            className="w-full py-4 bg-surface-container-low text-xs font-bold text-on-surface-variant uppercase tracking-widest border-t border-surface hover:bg-surface-container transition-colors"
                        >
                            Explore All Files
                        </button>
                    </div>
                </section>

                {/* Widget C: Active Transmissions — full width */}
                <section className="col-span-12 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="font-title-md text-title-md text-primary font-semibold">Active Transmissions</h3>
                        <span className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-[10px] font-bold uppercase">
                            3 Unread
                        </span>
                    </div>
                    <div className="bg-white rounded-xl diffuse-shadow p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {TRANSMISSIONS.map(({ avatar, name, sub, preview }) => (
                                <div
                                    key={name}
                                    onClick={() => navigate('/portal/chat')}
                                    className="p-4 rounded-xl bg-surface-container-lowest border border-transparent hover:border-secondary/20 transition-all cursor-pointer"
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-full bg-primary-container overflow-hidden flex items-center justify-center shrink-0">
                                            {avatar ? (
                                                <img src={avatar} alt={name} className="w-full h-full object-cover" />
                                            ) : (
                                                <Bell className="w-4 h-4 text-on-primary-container" />
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <h5 className="text-xs font-bold text-primary truncate">{name}</h5>
                                            <p className="text-[10px] text-on-surface-variant">{sub}</p>
                                        </div>
                                        <span className="ml-auto w-2 h-2 rounded-full bg-secondary shrink-0"></span>
                                    </div>
                                    <p className="text-sm text-on-surface-variant line-clamp-1 italic">{preview}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default Dashboard;
