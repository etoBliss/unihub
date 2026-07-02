import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Search, Bell, HelpCircle } from 'lucide-react';

const Navbar = () => {
    const { user } = useContext(AuthContext);

    return (
        <header className="fixed top-4 right-8 left-[292px] h-16 bg-white rounded-xl diffuse-shadow z-40 flex justify-between items-center px-8 border border-surface-container-high">
            {/* Search */}
            <div className="flex items-center gap-3 flex-1">
                <Search className="w-4 h-4 text-on-surface-variant opacity-60" />
                <input
                    className="bg-transparent border-none focus:ring-0 outline-none text-sm w-64 text-on-surface placeholder:text-outline/50"
                    placeholder="Search resources or updates..."
                    type="text"
                />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-5">
                <div className="flex items-center gap-2">
                    <button className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors">
                        <Bell className="w-5 h-5 text-on-surface-variant" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-secondary rounded-full"></span>
                    </button>
                    <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors">
                        <HelpCircle className="w-5 h-5 text-on-surface-variant" />
                    </button>
                </div>

                <div className="w-px h-8 bg-outline-variant/30"></div>

                {/* User Info */}
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-xs font-bold text-primary leading-tight">{user?.name || 'Ladokite User'}</p>
                        <p className="text-[10px] text-on-surface-variant">{user?.department || 'LAUTECH'}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full border-2 border-surface-container bg-primary-container flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {user?.name?.charAt(0)?.toUpperCase() || 'S'}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
