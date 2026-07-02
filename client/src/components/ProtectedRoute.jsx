import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { GraduationCap } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { user, loading } = useContext(AuthContext);

    // While session is being bootstrapped, show a branded loading screen
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-primary gap-4">
                <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center mb-2">
                    <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <div className="w-6 h-6 border-2 border-secondary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-white/60 text-xs uppercase tracking-widest font-semibold">Authenticating session...</p>
            </div>
        );
    }

    // If no authenticated user, redirect to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Role-based access guard (not currently used — all users are students)
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
