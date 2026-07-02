import React from 'react';
import { BookOpen, Wifi, BarChart2, Phone } from 'lucide-react';

const sections = [
    {
        icon: BookOpen,
        title: '1. Registration & Syllabus Rules',
        body: 'Students are expected to enroll in classes by the end of week 2 of each semester term. Course materials must be obtained directly via the academic repository tab where staff publish syllabus documents. Check announcements regularly for class location shifts.',
        list: null,
    },
    {
        icon: Wifi,
        title: '2. Campus Networking Etiquette',
        body: 'Private chat is restricted strictly to academic coordination, lecture queries, and group tasks. Do not broadcast spam or malicious files. Role-based reporting is monitored by student advisers and system administrators.',
        list: null,
    },
    {
        icon: BarChart2,
        title: '3. Grading Metrics & Appeals Process',
        body: 'For grading grievances or coursework reviews:',
        list: [
            'Consult the teaching assistant or class professor within 7 days of results release.',
            'Submit an official grading grievance form via your academic advisor\'s email.',
            'Make sure all project submissions have supporting zip repository logs.',
        ],
    },
    {
        icon: Phone,
        title: '4. Support Hotlines',
        body: 'Emergency student support and IT helpdesks are reachable via:',
        list: [
            'Academic Office: +234-(0)80-OfficeHrs',
            'IT Service Desk: techsupp@unihub-ogb.edu',
        ],
    },
];

const Guide = () => {
    return (
        <div className="space-y-8 max-w-3xl">
            {/* Page Header */}
            <div>
                <h2 className="font-headline-xl text-headline-xl text-primary font-bold">Student Academic Guide</h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                    Informational policies and academic protocols for all LAUTECH students.
                </p>
            </div>

            {/* Guide Sections */}
            <div className="flex flex-col gap-5">
                {sections.map(({ icon: Icon, title, body, list }) => (
                    <div key={title} className="bg-white rounded-2xl p-6 diffuse-shadow border border-surface-container-high hover-lift">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-secondary-container rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                                <Icon className="w-5 h-5 text-on-secondary-container" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-primary text-base mb-2">{title}</h3>
                                <p className="text-sm text-on-surface-variant leading-relaxed">{body}</p>
                                {list && (
                                    <ul className="mt-3 space-y-1.5 text-sm text-on-surface-variant list-none">
                                        {list.map((item) => (
                                            <li key={item} className="flex items-start gap-2">
                                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-secondary shrink-0"></span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Guide;
