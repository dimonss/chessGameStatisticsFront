import { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoginModal } from './LoginModal';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated } = useAuth();
    const [showLogin, setShowLogin] = useState(!isAuthenticated);
    const [shouldRedirect, setShouldRedirect] = useState(false);
    const isLoggingIn = useRef(false);

    useEffect(() => {
        if (!isAuthenticated) {
            setShowLogin(true);
        } else {
            setShowLogin(false);
        }
    }, [isAuthenticated]);

    const handleLoginSuccess = () => {
        isLoggingIn.current = true;
    };

    const handleClose = () => {
        setShowLogin(false);
        if (!isAuthenticated && !isLoggingIn.current) {
            setShouldRedirect(true);
        }
    };

    if (shouldRedirect) {
        return <Navigate to="/" replace />;
    }

    if (!isAuthenticated) {
        return (
            <>
                <div className="min-h-screen bg-gray-50" /> {/* Placeholder background */}
                <LoginModal
                    isOpen={showLogin}
                    onClose={handleClose}
                    onSuccess={handleLoginSuccess}
                />
            </>
        );
    }

    return <>{children}</>;
}
