import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
    LayoutDashboard,
    Megaphone,
    FolderOpen,
    MessageSquare,
    Map,
    Settings,
    LogOut,
    GraduationCap,
    HelpCircle,
} from 'lucide-react';

const Sidebar = () => {
    const { user, logoutUser } = useContext(AuthContext);
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const mainLinks = [
        { path: '/portal', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/portal/announcements', label: 'Announcements', icon: Megaphone },
        { path: '/portal/repository', label: 'Resource Repository', icon: FolderOpen },
        { path: '/portal/chat', label: 'Collaboration Hub', icon: MessageSquare },
        { path: '/portal/guide', label: 'Campus Guide', icon: Map },
    ];

    return (
        <aside className="fixed left-0 top-0 h-full w-[260px] bg-primary md:flex hidden flex-col z-50">
            {/* Brand Header */}
            <div className="px-6 py-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                        <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="font-headline-lg text-headline-lg text-white leading-tight font-bold text-base">UniHub OGB</h1>
                        <p className="text-[10px] text-white/50 uppercase tracking-widest">LAUTECH Ecosystem</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 mt-2">
                <ul className="space-y-0.5">
                    {mainLinks.map(({ path, label, icon: Icon }) => {
                        const isActive = pathname === path;
                        return (
                            <li key={path}>
                                <Link
                                    to={path}
                                    className={`flex items-center gap-3 py-3 pr-4 transition-all duration-200 text-sm ${isActive
                                        ? 'text-white font-semibold bg-white/10 border-l-[3px] border-secondary pl-4'
                                        : 'text-white/70 font-normal hover:text-white hover:bg-white/5 pl-[19px] hover:translate-x-1'
                                        }`}
                                >
                                    <Icon className={`w-5 h-5 ${isActive ? 'text-secondary' : ''}`} />
                                    {label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Footer */}
            <div className="mt-auto border-t border-white/5 pt-4 pb-8">
                <ul className="space-y-0.5">
                    <li>
                        <button className="w-full flex items-center gap-3 pl-[19px] py-3 text-white/70 hover:text-white hover:bg-white/5 text-sm transition-all hover:translate-x-1">
                            <Settings className="w-5 h-5" />
                            Settings
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={logoutUser}
                            className="w-full flex items-center gap-3 pl-[19px] py-3 text-white/70 hover:text-white hover:bg-white/5 text-sm transition-all hover:translate-x-1"
                        >
                            <LogOut className="w-5 h-5" />
                            Logout
                        </button>
                    </li>
                </ul>
                <div className="px-6 mt-6">
                    <button className="w-full py-3 rounded-lg bg-secondary text-white font-semibold text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2">
                        <HelpCircle className="w-4 h-4" />
                        Support
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
