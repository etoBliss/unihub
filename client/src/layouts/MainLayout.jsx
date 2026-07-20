import React, { useState, useContext } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import {
    LayoutDashboard,
    Megaphone,
    FolderOpen,
    MessageSquare,
    Map,
    Bell,
} from 'lucide-react';

const MainLayout = () => {
    const { user } = useContext(AuthContext);
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const bottomLinks = [
        { path: '/portal', label: 'Dash', icon: LayoutDashboard },
        { path: '/portal/announcements', label: 'News', icon: Megaphone },
        { path: '/portal/repository', label: 'Repo', icon: FolderOpen },
        { path: '/portal/chat', label: 'Hub', icon: MessageSquare },
        { path: '/portal/guide', label: 'Guide', icon: Map },
    ];

    return (
        <div className="flex min-h-screen bg-[#F9F9F9] font-body-md text-on-surface">
            {/* Desktop: Fixed sidebar with collapse state */}
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

            {/* Content Area wrapper: transitions width padding offset based on sidebar state */}
            <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isCollapsed ? 'md:pl-[70px]' : 'md:pl-[260px]'}`}>
                {/* Desktop: Floating top navbar */}
                <Navbar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

                {/* Mobile: Top AppBar */}
                <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md px-4 h-16 flex items-center justify-between border-b border-surface-container-high md:hidden">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
                            <img src="/logo.svg" alt="UniHub OGB Logo" className="w-8 h-8 object-contain" />
                        </div>
                        <div>
                            <h1 className="font-title-md text-[16px] text-primary leading-tight font-bold">UniHub OGB</h1>
                            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">LAUTECH Ecosystem</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => navigate('/portal/announcements')}
                            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors"
                        >
                            <Bell className="w-5 h-5 text-on-surface-variant" />
                        </button>
                        <div
                            onClick={() => navigate('/portal/guide')}
                            className="w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-sm cursor-pointer flex items-center justify-center bg-primary text-white text-xs font-bold"
                        >
                            {user?.name?.charAt(0)?.toUpperCase() || 'S'}
                        </div>
                    </div>
                </header>

                {/* Page Content: Responsive spacing and margins */}
                <main className="flex-1 flex flex-col md:pt-32 pt-20 pb-24 md:pb-12 px-4 md:px-8 max-w-7xl mx-auto w-full">
                    <Outlet />
                </main>

                {/* Mobile: Bottom Navigation Bar */}
                <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-surface-container h-20 flex items-center justify-between px-6 pb-2 md:hidden diffuse-shadow">
                    {bottomLinks.map(({ path, label, icon: Icon }) => {
                        const isActive = pathname === path;
                        return (
                            <Link
                                key={path}
                                to={path}
                                className="flex flex-col items-center gap-1 group relative active:scale-95 transition-transform"
                            >
                                <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-secondary' : 'text-on-surface-variant group-hover:text-primary'}`} />
                                <span className={`text-[10px] uppercase tracking-widest font-bold ${isActive ? 'text-secondary' : 'text-on-surface-variant font-medium'}`}>
                                    {label}
                                </span>
                                {isActive && (
                                    <span className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-1 h-1 bg-secondary rounded-full"></span>
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
};

export default MainLayout;
