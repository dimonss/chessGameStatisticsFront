import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from 'react';
import { authAPI } from '../utils/api';

interface AuthState {
  username: string;
  token: string;
}

interface AuthContextValue {
  isAuthenticated: boolean;
  username: string | null;
  authHeader: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const STORAGE_KEY = 'chess_stats_auth';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as AuthState;
        setAuthState(parsed);
      } catch (error) {
        console.warn('Failed to parse auth state', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const login = async (username: string, password: string) => {
    const trimmedUsername = username.trim();
    if (!trimmedUsername || !password) {
      throw new Error('Username and password are required');
    }

    // Verify credentials with backend
    const result = await authAPI.verify(trimmedUsername, password);

    if (!result.success) {
      throw new Error('Authentication failed');
    }

    const token = btoa(`${trimmedUsername}:${password}`);
    const nextState: AuthState = { username: trimmedUsername, token };
    setAuthState(nextState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
  };

  const logout = () => {
    setAuthState(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: Boolean(authState),
      username: authState?.username ?? null,
      authHeader: authState ? `Basic ${authState.token}` : null,
      login,
      logout
    }),
    [authState]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}


