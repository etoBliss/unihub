import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function VerifyEmail() {
    const { token } = useParams();
    const { verifyEmailToken } = useContext(AuthContext);
    const navigate = useNavigate();

    const [status, setStatus] = useState('loading'); // loading | success | error
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verify = async () => {
            const res = await verifyEmailToken(token);
            if (res.success) {
                setStatus('success');
                setMessage(res.message);
                // Auto-redirect to portal after 3 seconds (user is now logged in)
                setTimeout(() => navigate('/portal'), 3000);
            } else {
                setStatus('error');
                setMessage(res.message);
            }
        };
        verify();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    return (
        <main className="min-h-screen flex items-center justify-center bg-[#f2f2f2] px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10 text-center">

                {/* Loading */}
                {status === 'loading' && (
                    <>
                        <div className="mx-auto mb-6 w-16 h-16 rounded-full border-4 border-t-[#c9a84c] border-[#e5e5e5] animate-spin" />
                        <h1 className="text-xl font-bold text-[#1a1a2e] mb-2">Verifying your account…</h1>
                        <p className="text-sm text-gray-400">Please wait a moment.</p>
                    </>
                )}

                {/* Success */}
                {status === 'success' && (
                    <>
                        <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-[#1a1a2e] mb-3">Email Verified!</h1>
                        <p className="text-sm text-gray-500 leading-relaxed mb-6">{message}</p>
                        <p className="text-xs text-gray-400 mb-4">
                            Redirecting you to the portal in a few seconds…
                        </p>
                        <Link
                            to="/portal"
                            className="inline-block px-8 py-3 rounded-xl bg-[#1a1a2e] text-white text-sm font-semibold
                                       hover:bg-[#0f3460] transition-colors duration-200"
                        >
                            Go to Portal →
                        </Link>
                    </>
                )}

                {/* Error */}
                {status === 'error' && (
                    <>
                        <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-[#1a1a2e] mb-3">Link Invalid or Expired</h1>
                        <p className="text-sm text-gray-500 leading-relaxed mb-8">{message}</p>
                        <Link
                            to="/login"
                            className="inline-block px-8 py-3 rounded-xl bg-[#1a1a2e] text-white text-sm font-semibold
                                       hover:bg-[#0f3460] transition-colors duration-200"
                        >
                            Back to Login
                        </Link>
                    </>
                )}

            </div>
        </main>
    );
}
