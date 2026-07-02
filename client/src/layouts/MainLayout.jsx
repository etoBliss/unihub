import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const MainLayout = () => {
    return (
        <div className="flex min-h-screen bg-[#F2F2F2] font-body-md text-on-surface">
            {/* Fixed sidebar */}
            <Sidebar />

            {/* Content offset from sidebar */}
            <main className="ml-[260px] min-h-screen flex-1 flex flex-col">
                {/* Floating top navbar */}
                <Navbar />

                {/* Page content with top padding to clear floating navbar */}
                <div className="pt-32 px-8 pb-12 max-w-7xl mx-auto w-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
