import React, { useState, useContext } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function VerifyPending() {
    const { resendVerificationEmail } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    // email is passed via router state from the registration form
    const email = location.state?.email || '';

    const [status, setStatus] = useState('idle'); // idle | loading | success | error
    const [message, setMessage] = useState('');

    const handleResend = async () => {
        if (!email) return;
        setStatus('loading');
        const res = await resendVerificationEmail(email);
        setStatus(res.success ? 'success' : 'error');
        setMessage(res.message);
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-[#f2f2f2] px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10 text-center">

                {/* Icon */}
                <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                </div>

                <h1 className="text-2xl font-bold text-[#1a1a2e] mb-3">Check your inbox</h1>
                <p className="text-sm text-gray-500 leading-relaxed mb-2">
                    We've sent a verification link to:
                </p>
                <p className="text-sm font-semibold text-[#0f3460] mb-6 break-all">
                    {email || 'your registered email address'}
                </p>
                <p className="text-xs text-gray-400 mb-8 leading-relaxed">
                    Click the link in that email to activate your UniHub OGB account.
                    The link expires in <strong>24 hours</strong>. Check your spam folder if you can't find it.
                </p>

                {/* Resend section */}
                <div className="border-t border-gray-100 pt-6">
                    <p className="text-xs text-gray-400 mb-3">Didn't receive it?</p>

                    {status === 'success' && (
                        <p className="text-xs text-green-600 font-medium mb-3 bg-green-50 rounded-lg px-4 py-2">
                            ✓ {message}
                        </p>
                    )}
                    {status === 'error' && (
                        <p className="text-xs text-red-500 font-medium mb-3 bg-red-50 rounded-lg px-4 py-2">
                            {message}
                        </p>
                    )}

                    <button
                        onClick={handleResend}
                        disabled={status === 'loading' || !email}
                        className="w-full py-3 rounded-xl bg-[#1a1a2e] text-white text-sm font-semibold
                                   hover:bg-[#0f3460] transition-colors duration-200
                                   disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {status === 'loading' ? 'Sending…' : 'Resend Verification Email'}
                    </button>

                    <Link
                        to="/login"
                        className="block mt-4 text-xs text-gray-400 hover:text-[#0f3460] transition-colors"
                    >
                        ← Back to login
                    </Link>
                </div>
            </div>
        </main>
    );
}
