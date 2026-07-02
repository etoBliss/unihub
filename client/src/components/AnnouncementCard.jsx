import React from 'react';

const AnnouncementCard = ({ announcement }) => {
    const { title, content, author, targetAudience, targetDepartment, createdAt } = announcement;
    const formattedDate = new Date(createdAt).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric'
    });

    return (
        <div className="bg-surface-container-low rounded-xl p-5 border border-surface-container-high hover:border-outline-variant transition-all">
            <div className="flex justify-between items-start gap-3 mb-3">
                <h4 className="font-semibold text-primary text-sm leading-snug">{title}</h4>
                <span className="shrink-0 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container">
                    {targetAudience}
                </span>
            </div>

            <p className="text-xs text-on-surface-variant leading-relaxed whitespace-pre-wrap mb-4 line-clamp-3">{content}</p>

            <div className="flex justify-between items-center pt-3 border-t border-surface-container-high text-[10px] text-on-surface-variant">
                <span>By: <span className="font-semibold text-primary">{typeof author === 'string' ? author : (author?.name || 'System Admin')}</span></span>
                <div className="flex items-center gap-3">
                    <span>Dept: <span className="font-medium text-on-surface">{targetDepartment}</span></span>
                    <span className="text-outline">{formattedDate}</span>
                </div>
            </div>
        </div>
    );
};

export default AnnouncementCard;
