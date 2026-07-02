import React from 'react';
import { FileText, Download, Trash2 } from 'lucide-react';

const ResourceCard = ({ resource, onDelete }) => {
    const { _id, title, description, url, fileType, uploader, department, courseCode, tags } = resource;

    const handleDownload = () => {
        if (url && url.startsWith('/uploads')) {
            window.open(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${url}`, '_blank');
        } else if (url) {
            window.open(url, '_blank');
        }
    };

    const fileExt = fileType ? (fileType.split('/')[1] || fileType).toUpperCase() : 'FILE';

    return (
        <div className="bg-surface-container-low rounded-xl p-5 border border-surface-container-high hover:border-outline-variant transition-all">
            <div className="flex justify-between items-start gap-3 mb-2">
                <div className="flex items-start gap-3 min-w-0">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-surface-container-high shrink-0">
                        <FileText className="w-4 h-4 text-secondary" />
                    </div>
                    <div className="min-w-0">
                        <h4 className="font-semibold text-primary text-sm leading-snug truncate">{title}</h4>
                        {courseCode && <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">{courseCode}</span>}
                    </div>
                </div>
                <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded bg-surface-container text-on-surface-variant uppercase">
                    {fileExt}
                </span>
            </div>

            <p className="text-xs text-on-surface-variant leading-relaxed mb-3 line-clamp-2 ml-11">
                {description || 'No description provided.'}
            </p>

            {tags && tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3 ml-11">
                    {tags.map((tag, idx) => (
                        <span key={idx} className="text-[10px] bg-white text-on-surface-variant border border-surface-container-high px-2 py-0.5 rounded-full">
                            #{tag}
                        </span>
                    ))}
                </div>
            )}

            <div className="flex justify-between items-center pt-3 border-t border-surface-container-high">
                <div className="text-[10px] text-on-surface-variant">
                    <span className="font-semibold text-on-surface">{uploader?.name || 'Student'}</span>
                    <span className="text-outline mx-1">·</span>
                    {department}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-neutral-800 transition-colors"
                    >
                        <Download className="w-3 h-3" />
                        Access
                    </button>
                    {onDelete && (
                        <button
                            onClick={() => onDelete(_id)}
                            className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-error-container text-on-error-container px-3 py-1.5 rounded-lg hover:opacity-80 transition-opacity"
                        >
                            <Trash2 className="w-3 h-3" />
                            Delete
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResourceCard;
