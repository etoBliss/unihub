import React, { useState, useEffect, useContext } from 'react';
import { api } from '../context/AuthContext';
import { AuthContext } from '../context/AuthContext';
import AnnouncementCard from '../components/AnnouncementCard';
import { Megaphone } from 'lucide-react';

const Announcements = () => {
    const { user } = useContext(AuthContext);
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAnnouncements = async () => {
        try {
            const res = await api.get('/announcements');
            setAnnouncements(res.data);
        } catch (error) {
            console.error('Failed to load announcements:', error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h2 className="font-headline-xl text-headline-xl text-primary font-bold">Academic Announcements</h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                    Official disclosures broadcasted to student groups across LAUTECH.
                </p>
            </div>

            {/* Content */}
            <div className="bg-white rounded-2xl p-6 diffuse-shadow border border-surface-container-high">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-secondary-container rounded-xl flex items-center justify-center">
                            <Megaphone className="w-5 h-5 text-on-secondary-container" />
                        </div>
                        <h3 className="font-semibold text-primary text-base">Current Announce Stream</h3>
                    </div>
                    <span className="text-[10px] uppercase tracking-widest text-secondary font-bold bg-secondary-container px-2.5 py-1 rounded-full">
                        {announcements.length} Active
                    </span>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-16 text-on-surface-variant text-sm gap-3">
                        <div className="w-5 h-5 border-2 border-secondary border-t-transparent rounded-full animate-spin"></div>
                        Syncing announcement data...
                    </div>
                ) : announcements.length === 0 ? (
                    <div className="py-16 text-center bg-surface-container-low rounded-xl text-on-surface-variant text-sm">
                        No active announcements found matching your department or audience settings.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {announcements.map((ann) => (
                            <AnnouncementCard key={ann._id} announcement={ann} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Announcements;
