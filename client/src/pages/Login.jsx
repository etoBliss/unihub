import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext, api } from '../context/AuthContext';
import {
    School, Mail, Lock, User, BadgeCheck, Bookmark, Award, HelpCircle,
    Eye, EyeOff, ChevronDown, GraduationCap
} from 'lucide-react';

// ─── Password strength rules ───────────────────────────────────────────────
const PASSWORD_RULES = [
    { id: 'length', label: 'At least 8 characters', test: (p) => p.length >= 8 },
    { id: 'uppercase', label: 'At least one uppercase letter', test: (p) => /[A-Z]/.test(p) },
    { id: 'number', label: 'At least one number', test: (p) => /[0-9]/.test(p) },
    { id: 'special', label: 'At least one special character', test: (p) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p) },
];

const validatePassword = (password) => PASSWORD_RULES.map((rule) => ({ ...rule, passed: rule.test(password) }));

const validateEmail = (email) => {
    const pattern = /^[a-zA-Z0-9._%+-]+@student\.lautech\.edu\.ng$/;
    if (!email) return { valid: false, msg: '' };
    if (!email.includes('@')) return { valid: false, msg: 'Email must contain @' };
    if (!pattern.test(email)) return { valid: false, msg: 'Must be in format: username@student.lautech.edu.ng' };
    return { valid: true, msg: '✓ Valid student email' };
};

// ─── Component ─────────────────────────────────────────────────────────────
const Login = () => {
    const { user, loginUser, registerUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        matricNumber: '',
        faculty: '',
        department: '',
        level: '100',
    });
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Password visibility
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // Password rule feedback
    const [pwdRules, setPwdRules] = useState(validatePassword(''));
    const [emailState, setEmailState] = useState({ valid: false, msg: '' });
    const [confirmMsg, setConfirmMsg] = useState('');

    // Faculty / department data
    const [faculties, setFaculties] = useState([]);
    const [departments, setDepartments] = useState([]);

    const cardRef = useRef(null);

    // Redirect if already logged in
    useEffect(() => {
        if (user) navigate('/portal');
    }, [user, navigate]);

    // Fetch faculties from the server API
    useEffect(() => {
        api.get('/faculties')
            .then((res) => setFaculties(res.data))
            .catch((err) => console.error('Failed to load faculties:', err.message));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updated = { ...formData, [name]: value };

        // When faculty changes, reset department and load departments for that faculty
        if (name === 'faculty') {
            updated.department = '';
            const chosen = faculties.find((f) => f.name === value);
            setDepartments(chosen ? chosen.departments : []);
        }

        setFormData(updated);
        if (errorMsg) setErrorMsg('');

        // Live email feedback
        if (name === 'email') setEmailState(validateEmail(value));

        // Live password strength feedback
        if (name === 'password') setPwdRules(validatePassword(value));

        // Live confirm password feedback
        if (name === 'confirmPassword') {
            setConfirmMsg(value === updated.password ? '✓ Passwords match' : 'Passwords do not match');
        }
        if (name === 'password') {
            setConfirmMsg(formData.confirmPassword
                ? (formData.confirmPassword === value ? '✓ Passwords match' : 'Passwords do not match')
                : '');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        if (!validateEmail(formData.email).valid) {
            setErrorMsg('Please use a valid student email: username@student.lautech.edu.ng');
            return;
        }

        if (isRegister) {
            const allRulesPassed = pwdRules.every((r) => r.passed);
            if (!allRulesPassed) {
                setErrorMsg('Password does not meet the required strength criteria.');
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                setErrorMsg('Passwords do not match. Please re-enter.');
                return;
            }
            if (!formData.faculty) {
                setErrorMsg('Please select your faculty.');
                return;
            }
            if (!formData.department) {
                setErrorMsg('Please select your department.');
                return;
            }
        }

        setIsLoading(true);

        if (isRegister) {
            const res = await registerUser(
                formData.name,
                formData.email,
                formData.password,
                formData.matricNumber,
                formData.faculty,
                formData.department,
                formData.level
            );
            if (!res.success) setErrorMsg(res.message);
        } else {
            const res = await loginUser(formData.email, formData.password);
            if (!res.success) setErrorMsg(res.message);
        }
        setIsLoading(false);
    };

    // Subtle card tilt effect
    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const ax = (cy - e.clientY) / 60;
        const ay = (e.clientX - cx) / 60;
        const d = Math.sqrt((e.clientX - cx) ** 2 + (e.clientY - cy) ** 2);
        cardRef.current.style.transform = d < 500
            ? `perspective(1000px) rotateX(${ax}deg) rotateY(${ay}deg)`
            : `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
    };
    const handleMouseLeave = () => {
        if (cardRef.current) cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
    };

    const inputClass = "w-full h-14 pl-12 pr-4 bg-surface-container-low border-b-2 border-transparent rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline/50 focus:border-secondary focus:ring-0 focus:outline-none transition-all outline-none";
    const labelClass = "block font-label-md text-label-md text-on-surface-variant uppercase mb-2 ml-1 text-xs font-semibold tracking-wider";

    const passwordStrengthCount = pwdRules.filter((r) => r.passed).length;
    const strengthColors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500'];
    const strengthColor = formData.password ? strengthColors[Math.min(passwordStrengthCount - 1, 3)] : 'bg-surface-container';

    return (
        <main className="min-h-screen w-full flex flex-col md:flex-row bg-[#f2f2f2] text-on-surface">
            {/* Left Panel: Brand */}
            <section className="w-full md:w-1/2 bg-primary-container flex flex-col justify-center items-start px-12 md:px-24 py-16 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuA1pedNfKEbJV5YsaI5oI5jmvd5xk6pIVq-tXxATgNXuqZhA8ZMtM50R8mSAbCEWliwmsq1ug4y6LJYKpVZBiB3E2_KPpFhSDKuTuTABMxWJadysZpsLiRO1686SKei9lr8MES0JrzUEUfcp1uKQjknwgS22MvLYKas9GeKAoiCY6R8GhntN9idoz1f_54iiPXZCQl-FCeGmeJ_JFBPEgYA447hXvIUPN4gX9OtXDdh7aWyhRDhlWwe2n0PdYy5QMmf5N_fdiwgmg')` }} />
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

            {/* Right Panel: Form */}
            <section className="w-full md:w-1/2 flex items-center justify-center px-6 md:px-12 py-16 overflow-y-auto">
                <div
                    ref={cardRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    className="w-full max-w-md bg-white rounded-xl p-8 md:p-12 diffuse-shadow transform transition-all duration-300"
                >
                    <header className="mb-8 text-center md:text-left">
                        <h2 className="font-headline-xl text-headline-xl text-primary mb-2 font-bold text-2xl md:text-3xl">
                            {isRegister ? 'Student Registry' : 'Institutional Gateway'}
                        </h2>
                        <p className="font-body-md text-body-md text-on-surface-variant">
                            {isRegister
                                ? 'Create your student account using your official LAUTECH credentials.'
                                : 'Sign in using your official university credentials to access the dashboard.'}
                        </p>
                    </header>

                    {errorMsg && (
                        <div className="bg-[#fee2e2] text-[#ef4444] p-4 rounded-lg mb-6 text-sm text-center font-medium border border-red-100">
                            {errorMsg}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Full Name */}
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
                                <input
                                    className={inputClass}
                                    id="email" name="email" required
                                    value={formData.email} onChange={handleChange}
                                    placeholder="username@student.lautech.edu.ng"
                                    type="email"
                                />
                            </div>
                            {formData.email && (
                                <p className={`text-xs mt-1.5 ml-1 font-medium ${emailState.valid ? 'text-green-600' : 'text-red-500'}`}>
                                    {emailState.msg}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="text-left">
                            <label className={labelClass} htmlFor="password">Secure Access Key</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                    <Lock className="text-outline w-5 h-5 opacity-55" />
                                </div>
                                <input
                                    className={inputClass + ' pr-12'}
                                    id="password" name="password" required
                                    value={formData.password} onChange={handleChange}
                                    placeholder="••••••••••••"
                                    type={showPassword ? 'text' : 'password'}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-4 flex items-center text-outline/60 hover:text-primary transition-colors">
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {/* Strength bar + rules — register only */}
                            {isRegister && formData.password && (
                                <div className="mt-2 ml-1 space-y-2">
                                    {/* Strength bar */}
                                    <div className="flex gap-1">
                                        {[0, 1, 2, 3].map((i) => (
                                            <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < passwordStrengthCount ? strengthColor : 'bg-surface-container-high'}`} />
                                        ))}
                                    </div>
                                    {/* Per-rule badges */}
                                    <div className="space-y-1">
                                        {pwdRules.map((rule) => (
                                            <p key={rule.id} className={`text-[11px] flex items-center gap-1.5 font-medium ${rule.passed ? 'text-green-600' : 'text-on-surface-variant'}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full inline-block ${rule.passed ? 'bg-green-500' : 'bg-outline/30'}`}></span>
                                                {rule.label}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {/* Login only — just check the length hint */}
                            {!isRegister && formData.password && formData.password.length < 8 && (
                                <p className="text-xs mt-1.5 ml-1 font-medium text-red-500">Password must be at least 8 characters</p>
                            )}
                        </div>

                        {/* Confirm Password — register only */}
                        {isRegister && (
                            <div className="text-left">
                                <label className={labelClass} htmlFor="confirmPassword">Confirm Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                        <Lock className="text-outline w-5 h-5 opacity-55" />
                                    </div>
                                    <input
                                        className={inputClass + ' pr-12'}
                                        id="confirmPassword" name="confirmPassword" required
                                        value={formData.confirmPassword} onChange={handleChange}
                                        placeholder="Re-enter password"
                                        type={showConfirm ? 'text' : 'password'}
                                    />
                                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute inset-y-0 right-4 flex items-center text-outline/60 hover:text-primary transition-colors">
                                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {formData.confirmPassword && (
                                    <p className={`text-xs mt-1.5 ml-1 font-medium ${confirmMsg.startsWith('✓') ? 'text-green-600' : 'text-red-500'}`}>
                                        {confirmMsg}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Register-only additional fields */}
                        {isRegister && (
                            <>
                                {/* Matriculation Number */}
                                <div className="text-left">
                                    <label className={labelClass} htmlFor="matricNumber">Matriculation Number</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                            <BadgeCheck className="text-outline w-5 h-5 opacity-55" />
                                        </div>
                                        <input className={inputClass} id="matricNumber" name="matricNumber" required value={formData.matricNumber} onChange={handleChange} placeholder="e.g. 180293 or U/18/..." type="text" />
                                    </div>
                                </div>

                                {/* Faculty Selector */}
                                <div className="text-left">
                                    <label className={labelClass} htmlFor="faculty">Faculty</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                            <GraduationCap className="text-outline w-5 h-5 opacity-55" />
                                        </div>
                                        <select
                                            className={inputClass + ' appearance-none pr-10'}
                                            id="faculty" name="faculty"
                                            required
                                            value={formData.faculty}
                                            onChange={handleChange}
                                        >
                                            <option value="">-- Select Faculty --</option>
                                            {faculties.map((f) => (
                                                <option key={f.id} value={f.name}>{f.name}</option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                            <ChevronDown className="text-outline w-4 h-4 opacity-55" />
                                        </div>
                                    </div>
                                </div>

                                {/* Department — only enabled when faculty is selected */}
                                <div className="text-left">
                                    <label className={labelClass} htmlFor="department">Department</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                            <Bookmark className="text-outline w-5 h-5 opacity-55" />
                                        </div>
                                        <select
                                            className={inputClass + ' appearance-none pr-10 disabled:opacity-50'}
                                            id="department" name="department"
                                            required
                                            value={formData.department}
                                            onChange={handleChange}
                                            disabled={!formData.faculty}
                                        >
                                            <option value="">{formData.faculty ? '-- Select Department --' : '-- Choose faculty first --'}</option>
                                            {departments.map((dep) => (
                                                <option key={dep} value={dep}>{dep}</option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                            <ChevronDown className="text-outline w-4 h-4 opacity-55" />
                                        </div>
                                    </div>
                                </div>

                                {/* Academic Level */}
                                <div className="text-left">
                                    <label className={labelClass} htmlFor="level">Academic Level</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                            <Award className="text-outline w-5 h-5 opacity-55" />
                                        </div>
                                        <select className={inputClass + ' appearance-none pr-10'} id="level" name="level" value={formData.level} onChange={handleChange}>
                                            <option value="100">100 Level</option>
                                            <option value="200">200 Level</option>
                                            <option value="300">300 Level</option>
                                            <option value="400">400 Level</option>
                                            <option value="500">500 Level</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                            <ChevronDown className="text-outline w-4 h-4 opacity-55" />
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Remember + Forgot — login only */}
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
                            onClick={() => { setIsRegister(!isRegister); setErrorMsg(''); setFormData({ name: '', email: '', password: '', confirmPassword: '', matricNumber: '', faculty: '', department: '', level: '100' }); setEmailState({ valid: false, msg: '' }); setPwdRules(validatePassword('')); setConfirmMsg(''); }}
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
