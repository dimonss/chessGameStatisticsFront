import { useState, useEffect } from 'react';
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

    useEffect(() => {
        if (!isAuthenticated) {
            setShowLogin(true);
        } else {
            setShowLogin(false);
        }
    }, [isAuthenticated]);

    const handleClose = () => {
        setShowLogin(false);
        if (!isAuthenticated) {
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
                <LoginModal isOpen={showLogin} onClose={handleClose} />
            </>
        );
    }

    return <>{children}</>;
}
