import { type ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, Home, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { ConfirmModal } from './ConfirmModal';
import { LanguageSwitcher } from './LanguageSwitcher';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { t } = useTranslation();
  const { isAuthenticated, username, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navItems = [
    { path: '/', label: t('nav.players'), icon: Users },
    { path: '/admin', label: t('app.admin'), icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg mr-3">
                <Home className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {t('app.title')}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <LanguageSwitcher />
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-300 font-medium ${isActive
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/50 scale-105'
                        : 'text-gray-600 hover:bg-gray-100/80 hover:scale-105'
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              {isAuthenticated && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 bg-white/70 border border-gray-200 rounded-xl px-3 py-1.5">
                    {username}
                  </span>
                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className="text-sm text-gray-600 border border-gray-200 rounded-xl px-3 py-1.5 hover:bg-gray-100"
                  >
                    {t('app.logout')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => {
          logout();
          setShowLogoutModal(false);
        }}
        title={t('app.logout')}
        message={t('admin.logoutConfirm')}
        confirmLabel={t('app.logout')}
        cancelLabel={t('common.cancel')}
        variant="warning"
      />
    </div>
  );
}


