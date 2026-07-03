import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
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

const Sidebar = ({ isCollapsed }) => {
    const { user, logoutUser } = useContext(AuthContext);
    const { pathname } = useLocation();

    const mainLinks = [
        { path: '/portal', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/portal/announcements', label: 'Announcements', icon: Megaphone },
        { path: '/portal/repository', label: 'Resource Repository', icon: FolderOpen },
        { path: '/portal/chat', label: 'Collaboration Hub', icon: MessageSquare },
        { path: '/portal/guide', label: 'Campus Guide', icon: Map },
    ];

    return (
        <aside className={`fixed left-0 top-0 h-full bg-primary md:flex hidden flex-col z-50 transition-all duration-300 ${isCollapsed ? 'w-[70px]' : 'w-[260px]'}`}>
            {/* Brand Header */}
            <div className={`py-8 transition-all duration-300 ${isCollapsed ? 'px-3' : 'px-6'}`}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                        <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    {!isCollapsed && (
                        <div className="transition-opacity duration-300">
                            <h1 className="font-headline-lg text-headline-lg text-white leading-tight font-bold text-base whitespace-nowrap">UniHub OGB</h1>
                            <p className="text-[10px] text-white/50 uppercase tracking-widest whitespace-nowrap">LAUTECH Ecosystem</p>
                        </div>
                    )}
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
                                    className={`flex items-center transition-all duration-200 text-sm ${isCollapsed
                                            ? 'justify-center py-4 px-0 hover:bg-white/5'
                                            : 'gap-3 py-3 pr-4 pl-[19px] hover:bg-white/5 hover:translate-x-1'
                                        } ${isActive
                                            ? 'text-white font-semibold bg-white/10' + (isCollapsed ? ' border-l-[3px] border-secondary' : ' border-l-[3px] border-secondary pl-[16px]')
                                            : 'text-white/70 font-normal hover:text-white'
                                        }`}
                                    title={isCollapsed ? label : undefined}
                                >
                                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-secondary' : ''}`} />
                                    {!isCollapsed && (
                                        <span className="transition-opacity duration-200 whitespace-nowrap">
                                            {label}
                                        </span>
                                    )}
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
                        <button
                            className={`w-full flex items-center transition-all duration-200 text-sm hover:bg-white/5 ${isCollapsed ? 'justify-center py-4 px-0' : 'gap-3 py-3 pl-[19px] hover:translate-x-1'
                                } text-white/70 hover:text-white`}
                            title={isCollapsed ? "Settings" : undefined}
                        >
                            <Settings className="w-5 h-5 shrink-0" />
                            {!isCollapsed && <span>Settings</span>}
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={logoutUser}
                            className={`w-full flex items-center transition-all duration-200 text-sm hover:bg-white/5 ${isCollapsed ? 'justify-center py-4 px-0' : 'gap-3 py-3 pl-[19px] hover:translate-x-1'
                                } text-white/70 hover:text-white`}
                            title={isCollapsed ? "Logout" : undefined}
                        >
                            <LogOut className="w-5 h-5 shrink-0" />
                            {!isCollapsed && <span>Logout</span>}
                        </button>
                    </li>
                </ul>
                <div className={`mt-6 transition-all duration-300 ${isCollapsed ? 'px-3' : 'px-6'}`}>
                    {isCollapsed ? (
                        <button
                            className="w-10 h-10 rounded-lg bg-secondary text-white hover:brightness-110 transition-all flex items-center justify-center mx-auto"
                            title="Support Desk"
                        >
                            <HelpCircle className="w-5 h-5 shrink-0" />
                        </button>
                    ) : (
                        <button className="w-full py-3 rounded-lg bg-secondary text-white font-semibold text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2">
                            <HelpCircle className="w-4 h-4 shrink-0" />
                            Support
                        </button>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
