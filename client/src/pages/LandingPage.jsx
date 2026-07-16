import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ArrowRight, Megaphone, Users, Map, Globe, Mail, ArrowUpRight } from 'lucide-react';

const LandingPage = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleEnterPortal = () => {
        if (user) {
            navigate('/portal');
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="font-body-md overflow-x-hidden bg-white text-on-surface">
            {/* Header Navigation */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-surface-container-high transition-all h-16 md:h-20 px-6 md:px-10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <img src="/logo.svg" alt="UniHub OGB Logo" className="w-8 h-8 object-contain" />
                    <span className="font-headline-lg text-headline-lg tracking-tight text-primary font-bold">UniHub</span>
                </div>
                <div className="hidden md:flex gap-10 items-center justify-end">
                    <a className="font-label-md text-[12px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" href="#">Ecosystem</a>
                    <a className="font-label-md text-[12px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" href="#">Resources</a>
                    <a className="font-label-md text-[12px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" href="#">Campus Map</a>
                    <button
                        onClick={handleEnterPortal}
                        className="bg-primary-container text-on-primary px-8 py-3 rounded-xl font-title-md text-title-md hover:bg-neutral-800 transition-all shadow-lg active:scale-95 text-white"
                    >
                        Enter Portal
                    </button>
                </div>
                <div className="flex md:hidden items-center gap-4">
                    <button
                        onClick={handleEnterPortal}
                        className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-neutral-800 transition-all active:scale-95"
                    >
                        Enter Portal
                    </button>
                </div>
            </header>

            <main className="pt-16 md:pt-20">
                {/* Hero Section */}
                <section className="relative min-h-[700px] lg:min-h-[800px] flex items-center px-6 md:px-10 overflow-hidden isolate">
                    {/* Background Decorative Element */}
                    <div className="absolute right-0 top-0 w-full lg:w-1/2 h-full -z-10 opacity-20 lg:opacity-100 select-none">
                        <div
                            className="w-full h-full bg-cover bg-center"
                            style={{
                                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDXg0Wwx-QVHZ_lOZLW7BoIC6016_YAo3F6BsTOgRRpBjT7bkghxHXogtu6IT46zCW5bQ_6aXe-KjFsY7jD2CJVXWQFbQoQg_dtNFZDRSlo5SGWwHi--6uSwY5f4QTxPXi_moDODiZIrTlTgMXmVgA3LobRnyRhRPZ-wbO_1ofKlR1Xy_sNNkxIIVutMmvX56OrUQiBc5otnhsfELKMuKGmATwvP1hJoteQQuzodFTeiTwr3HazV_TUOvVT75bej1wn2NoCmpEJnw')`
                            }}
                        />
                    </div>
                    <div className="max-w-[1440px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-7 flex flex-col gap-6 text-left">
                            <div className="flex items-center gap-3">
                                <span className="h-[1px] w-12 bg-secondary"></span>
                                <span className="font-label-md text-label-md uppercase text-secondary tracking-[0.2em] font-semibold">Community Ecosystem</span>
                            </div>
                            <h1 className="text-4xl md:text-[64px] text-primary leading-tight max-w-2xl font-bold">
                                The Digital Pulse of <span className="text-secondary">LAUTECH.</span>
                            </h1>
                            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl leading-relaxed">
                                A frictionless platform designed for the Ladoke Akintola University community. Unify your academic journey, resource management, and peer collaboration in one elegant space.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 mt-4">
                                <button
                                    onClick={handleEnterPortal}
                                    className="bg-primary text-white hover:bg-neutral-800 px-8 md:px-10 py-4 rounded-xl font-title-md text-title-md transition-all diffuse-shadow flex items-center justify-center gap-2"
                                >
                                    Enter the Hub
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={handleEnterPortal}
                                    className="bg-surface-container-low text-primary px-8 md:px-10 py-4 rounded-xl font-title-md text-title-md hover:bg-surface-container-high transition-all"
                                >
                                    View Public Guide
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Dynamic Visualization (Visible on Mobile only) */}
                <section className="mx-6 my-12 h-64 rounded-3xl overflow-hidden relative soft-elevation lg:hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDHu1zic7FvHHZluas8116sJJpuzA2-LtU4n8-OqmCbi2WtGI8OVJfS2zPyy8kPtDrtaMWyLDhCJWvaePhqTSc_lqFz9-bnV6BS8k1Sg8d7ZOKIfjphn7872wwgtPn4VFz7v4m3plcFoqA93FAMMvO9RbN5V-GrFpxnzLw18EDCXC5u13ZYea0O27RTq0wVjoEVzFywBonwTwgioIrCGWGlYROY8fpcl5FI3eA4d02epk2Odcg5uOrDMVibtjjpUDEhey0wzcCFZA')`
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                        <span className="text-white font-label-md text-label-md uppercase tracking-widest opacity-80 font-bold">Live Ecosystem Activity</span>
                    </div>
                </section>

                {/* CTA Block / Features Bento */}
                <section className="bg-surface py-16 md:py-24 px-6 md:px-10">
                    <div className="max-w-[1440px] mx-auto">
                        <div className="bg-white rounded-[2rem] diffuse-shadow p-8 md:p-20 flex flex-col md:flex-row justify-between items-center gap-12">
                            <div className="flex-1 space-y-4 text-left">
                                <h2 className="text-2xl md:text-3xl font-headline-xl text-primary font-bold">Ready to streamline your campus life?</h2>
                                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg">
                                    Access your dashboard, verify your credentials, and connect with the LAUTECH repository instantly.
                                </p>
                            </div>
                            <div className="flex-shrink-0 w-full md:w-auto">
                                <button
                                    onClick={handleEnterPortal}
                                    className="w-full md:w-auto inline-flex items-center justify-center bg-primary text-white h-16 px-12 rounded-full font-title-md text-title-md hover-lift transition-all"
                                >
                                    Get Started
                                </button>
                            </div>
                        </div>

                        <h2 className="text-2xl md:text-3xl font-bold text-left mt-20 mb-8 text-primary">Core Destinations</h2>

                        {/* Bento Grid layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Column 1 */}
                            <div className="flex flex-col gap-8">
                                {/* Announcements Card */}
                                <div
                                    onClick={handleEnterPortal}
                                    className="bg-white p-8 rounded-3xl diffuse-shadow hover-lift flex flex-col gap-6 cursor-pointer text-left"
                                >
                                    <div className="w-12 h-12 bg-secondary-container flex items-center justify-center rounded-xl text-on-secondary-container">
                                        <Megaphone className="w-6 h-6 text-on-secondary-container" />
                                    </div>
                                    <h3 className="font-headline-lg text-headline-lg font-bold">Real-time Announcements</h3>
                                    <p className="font-body-md text-body-md text-on-surface-variant">Stay updated with official university communications directly from the source. No noise, just data.</p>
                                    <div className="flex items-center text-secondary font-semibold text-body-md gap-2 mt-2">
                                        Explore updates <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>

                                {/* Collaboration Hub Card */}
                                <div
                                    onClick={handleEnterPortal}
                                    className="bg-primary text-white p-8 rounded-3xl diffuse-shadow hover-lift flex flex-col gap-6 cursor-pointer text-left"
                                >
                                    <div className="w-12 h-12 bg-white/10 flex items-center justify-center rounded-xl">
                                        <Users className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="font-headline-lg text-headline-lg font-bold">Collaboration Hub</h3>
                                    <p className="font-body-md text-body-md text-white/70">Connect with peers across departments. Facilitating inter-disciplinary research and campus projects.</p>
                                    <div className="flex items-center text-secondary-fixed font-semibold text-body-md gap-2 mt-2">
                                        Connect now <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>

                            {/* Column 2 (Large Middle on Desktop, hidden on Mobile in favor or standard Repository Card inside Grid) */}
                            <div
                                onClick={handleEnterPortal}
                                className="hidden lg:block bg-surface-container-low rounded-3xl overflow-hidden diffuse-shadow relative group cursor-pointer"
                            >
                                <div
                                    className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                    style={{
                                        backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDHu1zic7FvHHZluas8116sJJpuzA2-LtU4n8-OqmCbi2WtGI8OVJfS2zPyy8kPtDrtaMWyLDhCJWvaePhqTSc_lqFz9-bnV6BS8k1Sg8d7ZOKIfjphn7872wwgtPn4VFz7v4m3plcFoqA93FAMMvO9RbN5V-GrFpxnzLw18EDCXC5u13ZYea0O27RTq0wVjoEVzFywBonwTwgioIrCGWGlYROY8fpcl5FI3eA4d02epk2Odcg5uOrDMVibtjjpUDEhey0wzcCFZA')`
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent p-10 flex flex-col justify-end text-left">
                                    <h3 className="font-headline-xl text-headline-xl text-white mb-2 font-bold">Resource Repository</h3>
                                    <p className="text-white/80 font-body-md">A centralized vault for all academic materials and administrative files.</p>
                                </div>
                            </div>

                            {/* Under lg screens: Mobile specific Resource Repository Card */}
                            <div
                                onClick={handleEnterPortal}
                                className="lg:hidden bg-white p-8 rounded-3xl diffuse-shadow hover-lift flex flex-col gap-6 cursor-pointer text-left"
                            >
                                <div className="w-12 h-12 bg-secondary-container flex items-center justify-center rounded-xl">
                                    <Globe className="w-6 h-6 text-on-secondary-container" />
                                </div>
                                <h3 className="font-headline-lg text-headline-lg font-bold">Resource Repository</h3>
                                <p className="font-body-md text-body-md text-on-surface-variant">Access a centralized library of lecture notes, journals, and administrative docs.</p>
                                <div className="flex items-center text-secondary font-semibold text-body-md gap-2 mt-2">
                                    Browse files <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>

                            {/* Column 3 */}
                            <div className="flex flex-col gap-8">
                                {/* Campus Guide Card */}
                                <div
                                    onClick={handleEnterPortal}
                                    className="bg-secondary p-8 rounded-3xl diffuse-shadow hover-lift flex flex-col gap-6 text-white h-full justify-between cursor-pointer text-left"
                                >
                                    <div>
                                        <div className="w-12 h-12 bg-white/20 flex items-center justify-center rounded-xl mb-6">
                                            <Map className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="font-headline-lg text-headline-lg font-bold">Campus Guide</h3>
                                        <p className="font-body-md text-body-md text-white/80 mt-4">Navigate the LAUTECH landscape with our interactive mapping system and facility directory.</p>
                                        <div className="flex items-center text-white/95 font-semibold text-body-md gap-2 mt-4">
                                            Open map <ArrowRight className="w-4 h-4 text-white" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Golden sunset card (Visible on mobile only) */}
                <section className="mx-6 mt-12 mb-20 relative rounded-3xl overflow-hidden h-80 soft-elevation lg:hidden">
                    <div
                        className="absolute inset-0 w-full h-full bg-cover bg-center"
                        style={{
                            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuB5_kixfRFzLr42hDxpQYAF-Ob8TdYCrb2mig5R5nprXqaovfSyJaB0KI7fvVZIN03fYES4gxoQuUB6-0eRnh7BROY2UVc6xuXbnP2G1Z1agBjwwxZM6ktq7ZiGRphJAlmRGVcPrECFr6LWY1fGNPsZACcdoghyRdWhZCXh-qybt3oC8MA2bJJyNuOUuXVHrW2nL83R4k7a2IWEsPMFD-js6u4xKRytMuTd9dYojJKYijWs3clYNnyurc_g1emAyTWR9y730os8Hg')`
                        }}
                    />
                    <div className="absolute inset-0 bg-primary/40 backdrop-grayscale-[0.5] flex items-center justify-center p-8">
                        <div className="text-center space-y-4">
                            <h2 className="text-2xl font-bold text-white">Innovation at Your Fingertips</h2>
                            <p className="font-body-md text-body-md text-white/80">Tailored for the mobile academic workflow.</p>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-16 md:py-24 px-6 md:px-10">
                    <div className="max-w-[1440px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
                        <div className="space-y-2">
                            <div className="font-display-lg text-display-lg text-primary font-bold text-3xl md:text-4xl">35k+</div>
                            <div className="font-label-md text-label-md uppercase text-secondary tracking-widest font-semibold text-xs">Active Students</div>
                        </div>
                        <div className="space-y-2">
                            <div className="font-display-lg text-display-lg text-primary font-bold text-3xl md:text-4xl">120+</div>
                            <div className="font-label-md text-label-md uppercase text-secondary tracking-widest font-semibold text-xs">Verified Orgs</div>
                        </div>
                        <div className="space-y-2">
                            <div className="font-display-lg text-display-lg text-primary font-bold text-3xl md:text-4xl">99.9%</div>
                            <div className="font-label-md text-label-md uppercase text-secondary tracking-widest font-semibold text-xs">System Uptime</div>
                        </div>
                        <div className="space-y-2">
                            <div className="font-display-lg text-display-lg text-primary font-bold text-3xl md:text-4xl">24/7</div>
                            <div className="font-label-md text-label-md uppercase text-secondary tracking-widest font-semibold text-xs">Portal Access</div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-surface-container-high py-20 px-6 md:px-10">
                <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between gap-16">
                    <div className="space-y-6 max-w-sm text-left">
                        <div className="flex items-center gap-3">
                            <img src="/logo.svg" alt="UniHub OGB Logo" className="w-10 h-10 object-contain" />
                            <h2 className="font-headline-lg text-headline-lg text-primary font-bold">UniHub OGB</h2>
                        </div>
                        <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                            The official digital ecosystem for Ladoke Akintola University of Technology. Streamlining communication, resources, and collaboration for the next generation of excellence.
                        </p>
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center cursor-pointer hover:bg-secondary hover:text-white transition-all">
                                <Globe className="w-5 h-5 text-neutral-600 hover:text-inherit" />
                            </div>
                            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center cursor-pointer hover:bg-secondary hover:text-white transition-all">
                                <Mail className="w-5 h-5 text-neutral-600 hover:text-inherit" />
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-12 text-left">
                        <div className="space-y-6">
                            <h4 className="font-label-md text-[12px] uppercase text-primary tracking-widest font-bold">Platform</h4>
                            <ul className="space-y-4 font-body-md text-on-surface-variant">
                                <li><a className="hover:text-secondary transition-colors" href="#">Dashboard</a></li>
                                <li><a className="hover:text-secondary transition-colors" href="#">Announcements</a></li>
                                <li><a className="hover:text-secondary transition-colors" href="#">Resources</a></li>
                            </ul>
                        </div>
                        <div className="space-y-6">
                            <h4 className="font-label-md text-[12px] uppercase text-primary tracking-widest font-bold">Support</h4>
                            <ul className="space-y-4 font-body-md text-on-surface-variant">
                                <li><a className="hover:text-secondary transition-colors" href="#">Help Center</a></li>
                                <li><a className="hover:text-secondary transition-colors" href="#">Documentation</a></li>
                                <li><a className="hover:text-secondary transition-colors" href="#">Campus IT</a></li>
                            </ul>
                        </div>
                        <div className="space-y-6">
                            <h4 className="font-label-md text-[12px] uppercase text-primary tracking-widest font-bold">Legal</h4>
                            <ul className="space-y-4 font-body-md text-on-surface-variant">
                                <li><a className="hover:text-secondary transition-colors" href="#">Privacy Policy</a></li>
                                <li><a className="hover:text-secondary transition-colors" href="#">Terms of Use</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="max-w-[1440px] mx-auto mt-20 pt-8 border-t border-surface-container-highest flex flex-col md:flex-row justify-between items-center gap-4 text-on-surface-variant font-label-md text-[12px]">
                    <span>© 2024 UniHub OGB. Powered by LAUTECH Ecosystem.</span>
                    <div className="flex gap-8">
                        <span>Designed for Excellence</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
