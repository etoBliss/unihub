import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { School, Mail, Lock, User, BadgeCheck, Bookmark, Award, HelpCircle } from 'lucide-react';

const Login = () => {
    const { user, loginUser, registerUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        matricNumber: '',
        department: 'Computer Science',
        level: '100'
    });
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const cardRef = useRef(null);

    useEffect(() => {
        if (user) {
            navigate('/portal');
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errorMsg) setErrorMsg(''); // clear error on input change
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        // Client-side institutional email check
        if (!formData.email.endsWith('@lautech.edu.ng')) {
            setErrorMsg('Please use your official LAUTECH institutional email (e.g. username@lautech.edu.ng)');
            return;
        }

        setIsLoading(true);

        if (isRegister) {
            const res = await registerUser(
                formData.name,
                formData.email,
                formData.password,
                formData.matricNumber,
                formData.department,
                formData.level
            );
            if (!res.success) {
                setErrorMsg(res.message);
            }
        } else {
            const res = await loginUser(formData.email, formData.password);
            if (!res.success) {
                setErrorMsg(res.message);
            }
        }
        setIsLoading(false);
    };

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const cardX = rect.left + rect.width / 2;
        const cardY = rect.top + rect.height / 2;
        const angleX = (cardY - e.clientY) / 60;
        const angleY = (e.clientX - cardX) / 60;
        const distance = Math.sqrt(Math.pow(e.clientX - cardX, 2) + Math.pow(e.clientY - cardY, 2));
        if (distance < 500) {
            cardRef.current.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
        } else {
            cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
        }
    };

    const handleMouseLeave = () => {
        if (cardRef.current) {
            cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
        }
    };

    const inputClass = "w-full h-14 pl-12 pr-4 bg-surface-container-low border-b-2 border-transparent rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline/50 focus:border-secondary focus:ring-0 focus:outline-none transition-all outline-none";
    const labelClass = "block font-label-md text-label-md text-on-surface-variant uppercase mb-2 ml-1 text-xs font-semibold tracking-wider";

    return (
        <main className="min-h-screen w-full flex flex-col md:flex-row bg-[#f2f2f2] text-on-surface">
            {/* Left Panel: Brand & Identity */}
            <section className="w-full md:w-1/2 bg-primary-container flex flex-col justify-center items-start px-12 md:px-24 py-16 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuA1pedNfKEbJV5YsaI5oI5jmvd5xk6pIVq-tXxATgNXuqZhA8ZMtM50R8mSAbCEWliwmsq1ug4y6LJYKpVZBiB3E2_KPpFhSDKuTuTABMxWJadysZpsLiRO1686SKei9lr8MES0JrzUEUfcp1uKQjknwgS22MvLYKas9GeKAoiCY6R8GhntN9idoz1f_54iiPXZCQl-FCeGmeJ_JFBPEgYA447hXvIUPN4gX9OtXDdh7aWyhRDhlWwe2n0PdYy5QMmf5N_fdiwgmg')` }}
                    />
                </div>
                <div className="relative z-10 w-full max-w-lg text-left">
                    <div className="mb-12 flex items-center gap-4">
                        <div className="w-16 h-16 bg-secondary flex items-center justify-center rounded-lg diffuse-shadow">
                            <School className="w-10 h-10 text-white" />
                        </div>
                        <div>
                            <h2 className="font-headline-lg text-headline-lg text-white tracking-tight font-bold">UniHub OGB</h2>
                            <p className="font-label-md text-label-md text-secondary uppercase tracking-[0.2em] font-semibold">LAUTECH Ecosystem</p>
                        </div>
                    </div>
                    <h1 className="font-display-lg text-display-lg text-white mb-6 leading-[1.1] font-bold text-4xl md:text-5xl">
                        The Future of <span className="text-secondary">Academic</span> Synergy.
                    </h1>
                    <p className="font-body-lg text-body-lg text-on-primary-container max-w-md leading-relaxed">
                        Access the unified digital core of LAUTECH. Manage repositories, collaborate across hubs, and navigate the campus ecosystem with frictionless precision.
                    </p>
                    <div className="mt-16 flex flex-wrap gap-8">
                        <div className="flex flex-col">
                            <span className="font-headline-lg text-headline-lg text-white font-bold text-2xl">45k+</span>
                            <span className="font-label-md text-label-md text-on-primary-container uppercase tracking-wider text-xs">Active Students</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-headline-lg text-headline-lg text-white font-bold text-2xl">12</span>
                            <span className="font-label-md text-label-md text-on-primary-container uppercase tracking-wider text-xs">Research Hubs</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Right Panel: Gateway Form */}
            <section className="w-full md:w-1/2 flex items-center justify-center px-6 md:px-12 py-16">
                <div
                    ref={cardRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    className="w-full max-w-md bg-white rounded-xl p-8 md:p-12 diffuse-shadow transform transition-all duration-300"
                >
                    <header className="mb-10 text-center md:text-left">
                        <h2 className="font-headline-xl text-headline-xl text-primary mb-2 font-bold text-2xl md:text-3xl">
                            {isRegister ? 'Student Registry' : 'Institutional Gateway'}
                        </h2>
                        <p className="font-body-md text-body-md text-on-surface-variant">
                            {isRegister
                                ? 'Create your student account using your official LAUTECH credentials.'
                                : 'Sign in using your official university credentials to access the dashboard.'}
                        </p>
                    </header>

                    {/* Error Message */}
                    {errorMsg && (
                        <div className="bg-[#fee2e2] text-[#ef4444] p-4 rounded-lg mb-6 text-sm text-center font-medium border border-red-100">
                            {errorMsg}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Full Name — Register only */}
                        {isRegister && (
                            <div className="text-left">
                                <label className={labelClass} htmlFor="name">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                        <User className="text-outline w-5 h-5 opacity-55" />
                                    </div>
                                    <input className={inputClass} id="name" name="name" required value={formData.name} onChange={handleChange} placeholder="Full Name" type="text" />
                                </div>
                            </div>
                        )}

                        {/* Email */}
                        <div className="text-left">
                            <label className={labelClass} htmlFor="email">Institutional Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                    <Mail className="text-outline w-5 h-5 opacity-55" />
                                </div>
                                <input className={inputClass} id="email" name="email" required value={formData.email} onChange={handleChange} placeholder="username@lautech.edu.ng" type="email" />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="text-left">
                            <label className={labelClass} htmlFor="password">Secure Access Key</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                    <Lock className="text-outline w-5 h-5 opacity-55" />
                                </div>
                                <input className={inputClass} id="password" name="password" required value={formData.password} onChange={handleChange} placeholder="••••••••••••" type="password" />
                            </div>
                        </div>

                        {/* Register-only fields */}
                        {isRegister && (
                            <>
                                <div className="text-left">
                                    <label className={labelClass} htmlFor="matricNumber">Matriculation Number</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                            <BadgeCheck className="text-outline w-5 h-5 opacity-55" />
                                        </div>
                                        <input className={inputClass} id="matricNumber" name="matricNumber" required value={formData.matricNumber} onChange={handleChange} placeholder="e.g. 180293 or U/18/..." type="text" />
                                    </div>
                                </div>

                                <div className="text-left">
                                    <label className={labelClass} htmlFor="department">Department</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                            <Bookmark className="text-outline w-5 h-5 opacity-55" />
                                        </div>
                                        <select className={inputClass + " appearance-none"} id="department" name="department" value={formData.department} onChange={handleChange}>
                                            <option value="Computer Science">Computer Science</option>
                                            <option value="Engineering">Engineering</option>
                                            <option value="Business Administration">Business Administration</option>
                                            <option value="General">General</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="text-left">
                                    <label className={labelClass} htmlFor="level">Academic Level</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                            <Award className="text-outline w-5 h-5 opacity-55" />
                                        </div>
                                        <select className={inputClass + " appearance-none"} id="level" name="level" value={formData.level} onChange={handleChange}>
                                            <option value="100">100 Level</option>
                                            <option value="200">200 Level</option>
                                            <option value="300">300 Level</option>
                                            <option value="400">400 Level</option>
                                            <option value="500">500 Level</option>
                                        </select>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Remember + Forgot — Login only */}
                        {!isRegister && (
                            <div className="flex items-center justify-between text-xs font-semibold tracking-wider pt-1">
                                <label className="flex items-center gap-2 cursor-pointer text-on-surface-variant hover:text-primary transition-colors">
                                    <input className="w-4 h-4 border-outline bg-surface-container text-primary rounded-none focus:ring-0" type="checkbox" />
                                    <span>Remember Identity</span>
                                </label>
                                <a className="text-secondary font-bold hover:opacity-80 transition-opacity" href="#">Forgot Key?</a>
                            </div>
                        )}

                        {/* Submit */}
                        <div className="pt-4">
                            <button
                                className="w-full h-14 bg-primary text-white font-title-md text-title-md rounded-lg diffuse-shadow hover:bg-neutral-800 active:scale-[0.98] transition-all duration-200 uppercase tracking-widest text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Processing...
                                    </>
                                ) : (
                                    isRegister ? 'Authorize Registration' : 'Authorize Access'
                                )}
                            </button>
                        </div>
                    </form>

                    <footer className="mt-10 pt-8 border-t border-surface-container-high text-center">
                        <p className="font-body-md text-body-md text-on-surface-variant mb-4">
                            {isRegister ? 'Already registered within the ecosystem?' : 'New to the ecosystem?'}
                        </p>
                        <button
                            type="button"
                            onClick={() => { setIsRegister(!isRegister); setErrorMsg(''); }}
                            className="w-full py-3 bg-surface-container text-primary font-title-md text-title-md rounded-lg hover:bg-surface-container-high transition-colors font-bold text-sm tracking-wider uppercase"
                        >
                            {isRegister ? 'Sign In Student Account' : 'Register Student Account'}
                        </button>
                    </footer>
                </div>

                {/* Floating Support Anchor */}
                <div className="fixed bottom-8 right-8 z-50">
                    <button className="flex items-center gap-3 bg-white px-6 py-3 rounded-full diffuse-shadow text-primary hover:-translate-y-1 transition-transform group shadow-md border border-neutral-100">
                        <HelpCircle className="w-5 h-5 text-secondary" />
                        <span className="font-label-md text-label-md uppercase font-bold text-xs">Support</span>
                    </button>
                </div>
            </section>
        </main>
    );
};

export default Login;
