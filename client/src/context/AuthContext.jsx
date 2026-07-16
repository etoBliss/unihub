import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

// Create default Axios instance targeting Express server port 5000
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Configure Axios Request interceptor to automatically attach authorization tokens
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('unihub_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('unihub_token') || null);
    const [loading, setLoading] = useState(true);

    // Validate session on load
    useEffect(() => {
        const bootstrapAuth = async () => {
            const storedToken = localStorage.getItem('unihub_token');
            if (storedToken) {
                try {
                    const res = await api.get('/auth/me');
                    setUser(res.data);
                } catch (error) {
                    console.error('Session restore failed:', error.message);
                    logoutUser();
                }
            }
            setLoading(false);
        };
        bootstrapAuth();
    }, []);

    // ── Login ──────────────────────────────────────────────────────────────
    const loginUser = async (email, password) => {
        try {
            const res = await api.post('/auth/login', { email, password });
            const { token, ...userData } = res.data;

            localStorage.setItem('unihub_token', token);
            localStorage.setItem('unihub_user', JSON.stringify(userData));

            setToken(token);
            setUser(userData);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                unverified: error.response?.data?.unverified || false,
                message:
                    error.response?.data?.message ||
                    (error.code === 'ECONNREFUSED'
                        ? 'Cannot reach the server. Make sure the backend is running on port 5000.'
                        : 'Authentication failed'),
            };
        }
    };

    // ── Register ───────────────────────────────────────────────────────────
    // On success the backend does NOT return a session token anymore —
    // it returns { pending: true, message } and waits for email verification.
    const registerUser = async (name, email, password, matricNumber, faculty, department, level) => {
        try {
            const res = await api.post('/auth/register', {
                name, email, password, matricNumber, faculty, department, level,
            });
            return { success: true, pending: res.data.pending, message: res.data.message };
        } catch (error) {
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    (error.code === 'ECONNREFUSED'
                        ? 'Cannot reach the server. Make sure the backend is running on port 5000.'
                        : 'Registration failed. Please try again.'),
            };
        }
    };

    // ── Verify Email ───────────────────────────────────────────────────────
    const verifyEmailToken = async (token) => {
        try {
            const res = await api.get(`/auth/verify/${token}`);
            // If verification succeeds, automatically log the user in
            if (res.data.token) {
                localStorage.setItem('unihub_token', res.data.token);
                const { token: jwt, ...userData } = res.data;
                localStorage.setItem('unihub_user', JSON.stringify(userData));
                setToken(jwt);
                setUser(userData);
            }
            return { success: true, message: res.data.message };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Verification failed. The link may have expired.',
            };
        }
    };

    // ── Resend Verification ────────────────────────────────────────────────
    const resendVerificationEmail = async (email) => {
        try {
            const res = await api.post('/auth/resend-verification', { email });
            return { success: true, message: res.data.message };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Could not resend verification email.',
            };
        }
    };

    // ── Logout ─────────────────────────────────────────────────────────────
    const logoutUser = () => {
        localStorage.removeItem('unihub_token');
        localStorage.removeItem('unihub_user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user, token, loading,
                loginUser, registerUser,
                verifyEmailToken, resendVerificationEmail,
                logoutUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
