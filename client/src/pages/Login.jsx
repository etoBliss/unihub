import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext, api } from '../context/AuthContext';
import {
    Mail, Lock, User, BadgeCheck, Bookmark, Award, HelpCircle,
    Eye, EyeOff, ChevronDown, Search, Check
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

// Static LAUTECH Faculties and matching Departments fallback
const STATIC_FACULTIES = [
    {
        id: 'fet',
        name: 'Faculty of Engineering and Technology',
        departments: [
            'Agricultural Engineering',
            'Chemical Engineering',
            'Civil Engineering',
            'Computer Science and Engineering',
            'Electrical and Electronic Engineering',
            'Food Engineering',
            'Materials and Metallurgical Engineering',
            'Mechanical Engineering',
        ],
    },
    {
        id: 'faps',
        name: 'Faculty of Agricultural Sciences',
        departments: [
            'Agricultural Economics and Extension',
            'Agronomy',
            'Animal Production and Health',
            'Aquaculture and Fisheries Management',
            'Crop Protection',
            'Soil Science and Land Management',
        ],
    },
    {
        id: 'fpas',
        name: 'Faculty of Pure and Applied Sciences',
        departments: [
            'Biochemistry',
            'Chemistry',
            'Industrial Chemistry',
            'Mathematics',
            'Microbiology',
            'Physics',
            'Statistics',
        ],
    },
    {
        id: 'fems',
        name: 'Faculty of Environmental Sciences',
        departments: [
            'Architecture',
            'Building Technology',
            'Estate Management and Valuation',
            'Quantity Surveying',
            'Urban and Regional Planning',
        ],
    },
    {
        id: 'fms',
        name: 'Faculty of Management Sciences',
        departments: [
            'Accounting',
            'Business Administration',
            'Economics',
            'Finance',
            'Public Administration',
        ],
    },
    {
        id: 'fcoms',
        name: 'Faculty of Computing and Informatics',
        departments: [
            'Computer Science',
            'Information and Communication Technology',
            'Library and Information Science',
        ],
    },
    {
        id: 'fms2',
        name: 'Faculty of Medical Sciences',
        departments: [
            'Anatomy',
            'Community Medicine',
            'Medicine and Surgery',
            'Nursing Science',
            'Physiotherapy',
        ],
    },
];

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

    // Password visibility states
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // Live validation states
    const [pwdRules, setPwdRules] = useState(validatePassword(''));
    const [emailState, setEmailState] = useState({ valid: false, msg: '' });
    const [confirmMsg, setConfirmMsg] = useState('');

    // Custom dropdown states
    const [openDropdown, setOpenDropdown] = useState(null); // 'faculty' | 'department' | 'level' | null
    const [facultySearch, setFacultySearch] = useState('');
    const [deptSearch, setDeptSearch] = useState('');

    // Faculty & department lists fetched from server, initialize with static list
    const [faculties, setFaculties] = useState(STATIC_FACULTIES);
    const [departments, setDepartments] = useState([]);
    const [isFetchedFromApi, setIsFetchedFromApi] = useState(false);

    const cardRef = useRef(null);
    const facultyRef = useRef(null);
    const deptRef = useRef(null);
    const levelRef = useRef(null);

    // Auto-dismiss open dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!openDropdown) return;

            if (openDropdown === 'faculty' && facultyRef.current && !facultyRef.current.contains(event.target)) {
                setOpenDropdown(null);
            }
            if (openDropdown === 'department' && deptRef.current && !deptRef.current.contains(event.target)) {
                setOpenDropdown(null);
            }
            if (openDropdown === 'level' && levelRef.current && !levelRef.current.contains(event.target)) {
                setOpenDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [openDropdown]);

    // Redirect user if logged in already
    useEffect(() => {
        if (user) navigate('/portal');
    }, [user, navigate]);

    // Retrieve faculties on component mounting with fallback
    useEffect(() => {
        api.get('/faculties')
            .then((res) => {
                if (res.data && res.data.length > 0) {
                    setFaculties(res.data);
                    setIsFetchedFromApi(true);
                }
            })
            .catch((err) => {
                console.warn('Faculties API call failed, using static fallback:', err.message);
                setIsFetchedFromApi(false);
            });
    }, []);

    // Sync departments whenever faculty selection changes
    useEffect(() => {
        if (formData.faculty && faculties.length > 0) {
            const chosen = faculties.find((f) => f.name === formData.faculty);
            setDepartments(chosen ? chosen.departments : []);
        } else {
            setDepartments([]);
        }
    }, [formData.faculty, faculties]);

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updated = { ...formData, [name]: value };

        setFormData(updated);
        if (errorMsg) setErrorMsg('');

        // Email live validation check
        if (name === 'email') setEmailState(validateEmail(value));

        // Password live checks
        if (name === 'password') setPwdRules(validatePassword(value));

        // Confirm Password matcher
        if (name === 'confirmPassword') {
            setConfirmMsg(value === updated.password ? '✓ Passwords match' : 'Passwords do not match');
        }
        if (name === 'password') {
            setConfirmMsg(formData.confirmPassword
                ? (formData.confirmPassword === value ? '✓ Passwords match' : 'Passwords do not match')
                : '');
        }
    };

    // Custom Dropdown click handler that resets appropriate fields
    const handleChangeCustom = (name, value) => {
        const updated = { ...formData, [name]: value };

        if (name === 'faculty') {
            updated.department = '';
            const chosen = faculties.find((f) => f.name === value);
            setDepartments(chosen ? chosen.departments : []);
            setDeptSearch(''); // reset search
        }

        setFormData(updated);
        if (errorMsg) setErrorMsg('');
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
            if (res.success) {
                // Don't log user in — send to "check your inbox" page
                navigate('/verify-pending', { state: { email: formData.email } });
            } else {
                setErrorMsg(res.message);
            }
        } else {
            const res = await loginUser(formData.email, formData.password);
            if (!res.success) {
                if (res.unverified) {
                    setErrorMsg(
                        res.message + ' — Use the link below to resend the verification email.'
                    );
                } else {
                    setErrorMsg(res.message);
                }
            }
        }
        setIsLoading(false);
    };

    // Resets registry form states clean when user toggles tab
    const handleToggleForm = () => {
        setIsRegister(!isRegister);
        setErrorMsg('');
        setOpenDropdown(null);
        setFacultySearch('');
        setDeptSearch('');
        setFormData({
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            matricNumber: '',
            faculty: '',
            department: '',
            level: '100',
        });
        setEmailState({ valid: false, msg: '' });
        setPwdRules(validatePassword(''));
        setConfirmMsg('');
    };

    // Filtered lists for selectable options safely
    const filteredFaculties = (faculties || []).filter((f) =>
        f && f.name && f.name.toLowerCase().includes(facultySearch.toLowerCase())
    );

    const filteredDepartments = (departments || []).filter((d) =>
        d && d.toLowerCase().includes(deptSearch.toLowerCase())
    );

    // Subtle 3D tilt effect on the signup/login card container
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
        <main className="min-h-screen w-full flex flex-col md:flex-row bg-[#f2f2f2] text-on-surface relative">
            {/* Left Panel: Brand identity */}
            <section className="w-full md:w-1/2 bg-primary-container flex flex-col justify-center items-start px-12 md:px-24 py-16 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuA1pedNfKEbJV5YsaI5oI5jmvd5xk6pIVq-tXxATgNXuqZhA8ZMtM50R8mSAbCEWliwmsq1ug4y6LJYKpVZBiB3E2_KPpFhSDKuTuTABMxWJadysZpsLiRO1686SKei9lr8MES0JrzUEUfcp1uKQjknwgS22MvLYKas9GeKAoiCY6R8GhntN9idoz1f_54iiPXZCQl-FCeGmeJ_JFBPEgYA447hXvIUPN4gX9OtXDdh7aWyhRDhlWwe2n0PdYy5QMmf5N_fdiwgmg')` }} />
                </div>
                <div className="relative z-10 w-full max-w-lg text-left">
                    <div className="mb-12 flex items-center gap-4">
                        <img src="/logo.svg" alt="UniHub OGB Logo" className="w-16 h-16 object-contain diffuse-shadow" />
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

            {/* Right Panel: Interactive credentials container */}
            <section className="w-full md:w-1/2 flex items-center justify-center px-6 md:px-12 py-16 overflow-y-auto">
                <div
                    ref={cardRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    className="w-full max-w-md bg-white rounded-xl p-8 md:p-12 diffuse-shadow transform transition-all duration-300 relative z-30"
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
                        {/* Name */}
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
                            <label className={labelClass} htmlFor="email">Institutional Student Email</label>
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
                                <p className={`text-xs mt-1.5 ml-1 font-medium transition-all ${emailState.valid ? 'text-green-600' : 'text-red-500'}`}>
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
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-4 flex items-center text-outline/65 hover:text-primary transition-colors">
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {/* Strength level meter & checklist criteria */}
                            {isRegister && formData.password && (
                                <div className="mt-2.5 ml-1 space-y-2">
                                    <div className="flex gap-1.5 h-1">
                                        {[0, 1, 2, 3].map((i) => (
                                            <div key={i} className={`h-full flex-1 rounded-full transition-all duration-300 ${i < passwordStrengthCount ? strengthColor : 'bg-surface-container-high'}`} />
                                        ))}
                                    </div>
                                    <div className="space-y-1 mt-2">
                                        {pwdRules.map((rule) => (
                                            <p key={rule.id} className={`text-[11px] flex items-center gap-1.5 font-medium transition-colors ${rule.passed ? 'text-green-600' : 'text-on-surface-variant/80'}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full inline-block transition-all ${rule.passed ? 'bg-green-500' : 'bg-outline/30'}`}></span>
                                                {rule.label}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {!isRegister && formData.password && formData.password.length < 8 && (
                                <p className="text-xs mt-1.5 ml-1 font-medium text-red-500">Password must be at least 8 characters</p>
                            )}
                        </div>

                        {/* Confirm Password */}
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
                                        placeholder="Confirm Access Key"
                                        type={showConfirm ? 'text' : 'password'}
                                    />
                                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute inset-y-0 right-4 flex items-center text-outline/65 hover:text-primary transition-colors">
                                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {formData.confirmPassword && (
                                    <p className={`text-xs mt-1.5 ml-1 font-medium transition-all ${confirmMsg.startsWith('✓') ? 'text-green-600' : 'text-red-500'}`}>
                                        {confirmMsg}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Register extra fields */}
                        {isRegister && (
                            <>
                                {/* Matriculation ID */}
                                <div className="text-left">
                                    <label className={labelClass} htmlFor="matricNumber">Matriculation Number</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                            <BadgeCheck className="text-outline w-5 h-5 opacity-55" />
                                        </div>
                                        <input className={inputClass} id="matricNumber" name="matricNumber" required value={formData.matricNumber} onChange={handleChange} placeholder="e.g. 180293 or U/18/..." type="text" />
                                    </div>
                                </div>

                                {/* Custom Faculty Selector Dropdown */}
                                <div className="text-left relative">
                                    <label className={labelClass}>Faculty</label>
                                    <div ref={facultyRef} className={`relative ${openDropdown === 'faculty' ? 'z-50' : 'z-25'}`}>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setOpenDropdown(openDropdown === 'faculty' ? null : 'faculty');
                                                setFacultySearch('');
                                            }}
                                            className={`${inputClass} flex items-center justify-between text-left focus:ring-2 focus:ring-secondary/50`}
                                        >
                                            <span className={`truncate mr-4 ${formData.faculty ? "text-on-surface font-medium" : "text-outline/50"}`}>
                                                {formData.faculty || "-- Select Faculty --"}
                                            </span>
                                            <ChevronDown className={`text-outline w-4 h-4 opacity-55 shrink-0 transition-transform duration-200 ${openDropdown === 'faculty' ? 'rotate-180' : ''}`} />
                                            <GraduationCap className="text-outline w-5 h-5 opacity-55 absolute left-4 pointer-events-none" />
                                        </button>

                                        {openDropdown === 'faculty' && (
                                            <div className="absolute left-0 right-0 mt-1 bg-white border border-surface-container-high rounded-lg shadow-xl py-2 max-h-64 flex flex-col z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                                                {/* Search header inside dropdown */}
                                                <div className="px-3 pb-2 border-b border-surface-container mb-1 shrink-0 flex items-center gap-2">
                                                    <Search className="w-3.5 h-3.5 text-outline/55" />
                                                    <input
                                                        type="text"
                                                        value={facultySearch}
                                                        onChange={(e) => setFacultySearch(e.target.value)}
                                                        onKeyDown={handleSearchKeyDown}
                                                        placeholder="Search Faculty..."
                                                        className="w-full text-xs h-8 border-none bg-surface-container-low rounded focus:ring-0 focus:outline-none placeholder:text-outline/40"
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                </div>

                                                <div className="overflow-y-auto flex-1">
                                                    {filteredFaculties.length === 0 ? (
                                                        <div className="px-5 py-3 text-xs text-outline/50 text-center font-medium">No faculties found</div>
                                                    ) : (
                                                        filteredFaculties.map((f) => (
                                                            <button
                                                                key={f.id}
                                                                type="button"
                                                                onClick={() => {
                                                                    handleChangeCustom('faculty', f.name);
                                                                    setOpenDropdown(null);
                                                                }}
                                                                className={`w-full px-5 py-2.5 text-left text-xs font-medium transition-all flex items-center justify-between hover:bg-surface-container-low ${formData.faculty === f.name
                                                                    ? 'text-primary bg-primary-container/10 font-bold'
                                                                    : 'text-on-surface'
                                                                    }`}
                                                            >
                                                                <span className="truncate pr-4">{f.name}</span>
                                                                {formData.faculty === f.name && (
                                                                    <Check className="w-3.5 h-3.5 text-secondary shrink-0" />
                                                                )}
                                                            </button>
                                                        ))
                                                    )}
                                                </div>

                                                {/* API Status Banner */}
                                                <div className="px-4 py-1.5 border-t border-surface-container mt-1 shrink-0 text-[10px] text-outline/50 flex items-center justify-between font-mono bg-surface-container-low/20">
                                                    <span>SOURCE: {isFetchedFromApi ? 'LAUTECH DIRECTORY API' : 'LOCAL CACHED DIRECTORY'}</span>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${isFetchedFromApi ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`}></span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Custom Cascading Department Selector Dropdown */}
                                <div className="text-left relative">
                                    <label className={labelClass}>Department</label>
                                    <div ref={deptRef} className={`relative ${openDropdown === 'department' ? 'z-50' : 'z-20'}`}>
                                        <button
                                            type="button"
                                            disabled={!formData.faculty}
                                            onClick={() => {
                                                setOpenDropdown(openDropdown === 'department' ? null : 'department');
                                                setDeptSearch('');
                                            }}
                                            className={`${inputClass} flex items-center justify-between text-left disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-secondary/50`}
                                        >
                                            <span className={`truncate mr-4 ${formData.department ? "text-on-surface font-medium" : "text-outline/50"}`}>
                                                {formData.faculty
                                                    ? (formData.department || "-- Select Department --")
                                                    : "-- Choose Faculty First --"
                                                }
                                            </span>
                                            <ChevronDown className={`text-outline w-4 h-4 opacity-55 shrink-0 transition-transform duration-200 ${openDropdown === 'department' ? 'rotate-180' : ''}`} />
                                            <Bookmark className="text-outline w-5 h-5 opacity-55 absolute left-4 pointer-events-none" />
                                        </button>

                                        {formData.faculty && openDropdown === 'department' && (
                                            <div className="absolute left-0 right-0 mt-1 bg-white border border-surface-container-high rounded-lg shadow-xl py-2 max-h-64 flex flex-col z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                                                {/* Search header inside dropdown */}
                                                <div className="px-3 pb-2 border-b border-surface-container mb-1 shrink-0 flex items-center gap-2">
                                                    <Search className="w-3.5 h-3.5 text-outline/55" />
                                                    <input
                                                        type="text"
                                                        value={deptSearch}
                                                        onChange={(e) => setDeptSearch(e.target.value)}
                                                        onKeyDown={handleSearchKeyDown}
                                                        placeholder="Search Department..."
                                                        className="w-full text-xs h-8 border-none bg-surface-container-low rounded focus:ring-0 focus:outline-none placeholder:text-outline/40"
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                </div>

                                                <div className="overflow-y-auto flex-1">
                                                    {filteredDepartments.length === 0 ? (
                                                        <div className="px-5 py-3 text-xs text-outline/50 text-center font-medium">No departments found</div>
                                                    ) : (
                                                        filteredDepartments.map((dep) => (
                                                            <button
                                                                key={dep}
                                                                type="button"
                                                                onClick={() => {
                                                                    handleChangeCustom('department', dep);
                                                                    setOpenDropdown(null);
                                                                }}
                                                                className={`w-full px-5 py-2.5 text-left text-xs font-medium transition-all flex items-center justify-between hover:bg-surface-container-low ${formData.department === dep
                                                                    ? 'text-primary bg-primary-container/10 font-bold'
                                                                    : 'text-on-surface'
                                                                    }`}
                                                            >
                                                                <span className="truncate pr-4">{dep}</span>
                                                                {formData.department === dep && (
                                                                    <Check className="w-3.5 h-3.5 text-secondary shrink-0" />
                                                                )}
                                                            </button>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Custom Level Selector Dropdown */}
                                <div className="text-left relative">
                                    <label className={labelClass}>Academic Level</label>
                                    <div ref={levelRef} className={`relative ${openDropdown === 'level' ? 'z-50' : 'z-10'}`}>
                                        <button
                                            type="button"
                                            onClick={() => setOpenDropdown(openDropdown === 'level' ? null : 'level')}
                                            className={`${inputClass} flex items-center justify-between text-left focus:ring-2 focus:ring-secondary/50`}
                                        >
                                            <span className="text-on-surface font-medium">
                                                {formData.level} Level
                                            </span>
                                            <ChevronDown className={`text-outline w-4 h-4 opacity-55 shrink-0 transition-transform duration-200 ${openDropdown === 'level' ? 'rotate-180' : ''}`} />
                                            <Award className="text-outline w-5 h-5 opacity-55 absolute left-4 pointer-events-none" />
                                        </button>

                                        {openDropdown === 'level' && (
                                            <div className="absolute left-0 right-0 mt-1 bg-white border border-surface-container-high rounded-lg shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                                                {['100', '200', '300', '400', '500'].map((lvl) => (
                                                    <button
                                                        key={lvl}
                                                        type="button"
                                                        onClick={() => {
                                                            handleChangeCustom('level', lvl);
                                                            setOpenDropdown(null);
                                                        }}
                                                        className={`w-full px-5 py-2.5 text-left text-xs font-medium transition-all flex items-center justify-between hover:bg-surface-container-low ${formData.level === lvl
                                                            ? 'text-primary bg-primary-container/10 font-bold'
                                                            : 'text-on-surface'
                                                            }`}
                                                    >
                                                        <span>{lvl} Level</span>
                                                        {formData.level === lvl && (
                                                            <Check className="w-3.5 h-3.5 text-secondary shrink-0" />
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Gateway access button */}
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
                        <p className="font-body-md text-body-md text-on-surface-variant mb-4 font-semibold text-xs tracking-wide uppercase">
                            {isRegister ? 'Already registered within the ecosystem?' : 'New to the ecosystem?'}
                        </p>
                        <button
                            type="button"
                            onClick={handleToggleForm}
                            className="w-full py-3 bg-surface-container text-primary font-title-md text-title-md rounded-lg hover:bg-surface-container-high transition-colors font-bold text-sm tracking-wider uppercase border border-neutral-100"
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
