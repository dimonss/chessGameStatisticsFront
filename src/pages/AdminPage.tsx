import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Lock, Loader2, Edit3, Trash2, Plus, LogOut, AlertCircle, Trophy, User } from 'lucide-react';
import { PlayerForm } from '../components/PlayerForm';
import { GameForm } from '../components/GameForm';
import { ConfirmModal } from '../components/ConfirmModal';
import { Modal } from '../components/Modal';
import { playerAPI, gameAPI } from '../utils/api';
import { PlayerWithStats, type PlayerFormValues, type ChessGame } from '../types/chess';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

type FormMode = 'create' | 'edit' | null;
type Tab = 'players' | 'games';

export function AdminPage() {
  const { isAuthenticated, username, authHeader, login, logout } = useAuth();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<Tab>('players');

  // Data state
  const [players, setPlayers] = useState<PlayerWithStats[]>([]);
  const [games, setGames] = useState<ChessGame[]>([]);

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [formMode, setFormMode] = useState<FormMode>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Login state
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState<string | null>(null);

  // Modals
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const editingPlayer = useMemo(
    () => players.find(player => player.id === editingId),
    [players, editingId]
  );

  const editingGame = useMemo(
    () => games.find(game => game.id === editingId),
    [games, editingId]
  );

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [playersData, gamesData] = await Promise.all([
        playerAPI.getAll(),
        gameAPI.getAll()
      ]);
      setPlayers(playersData);
      setGames(gamesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLoginSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    try {
      login(loginForm.username, loginForm.password);
      setLoginForm({ username: '', password: '' });
      setLoginError(null);
      setStatusMessage(t('admin.authSuccess'));
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : t('common.error'));
    }
  };

  const handleLogout = () => {
    logout();
    setStatusMessage(t('app.logout'));
    setShowLogoutModal(false);
  };

  // Player Actions
  const handleCreatePlayer = async (values: PlayerFormValues) => {
    if (!authHeader) return;
    try {
      setActionLoading(true);
      await playerAPI.create(values, authHeader);
      await loadData();
      setStatusMessage(t('admin.createSuccess', { item: t('nav.players') }));
      setFormMode(null);
    } catch (err) {
      setStatusMessage(err instanceof Error ? err.message : t('common.error'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdatePlayer = async (values: PlayerFormValues) => {
    if (!authHeader || !editingId) return;
    try {
      setActionLoading(true);
      await playerAPI.update(editingId, values, authHeader);
      await loadData();
      setStatusMessage(t('admin.updateSuccess', { item: t('nav.players') }));
      setFormMode(null);
      setEditingId(null);
    } catch (err) {
      setStatusMessage(err instanceof Error ? err.message : t('common.error'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeletePlayer = async () => {
    if (!authHeader || !itemToDelete) return;
    try {
      setActionLoading(true);
      await playerAPI.delete(itemToDelete, authHeader);
      await loadData();
      setStatusMessage(t('admin.deleteSuccess', { item: t('nav.players') }));
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (err) {
      setStatusMessage(err instanceof Error ? err.message : t('common.error'));
    } finally {
      setActionLoading(false);
    }
  };

  // Game Actions
  const handleCreateGame = async (values: Partial<ChessGame>) => {
    if (!authHeader) return;
    try {
      setActionLoading(true);
      await gameAPI.create(values, authHeader);
      await loadData();
      setStatusMessage(t('admin.createSuccess', { item: t('nav.games') }));
      setFormMode(null);
    } catch (err) {
      setStatusMessage(err instanceof Error ? err.message : t('common.error'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateGame = async (values: Partial<ChessGame>) => {
    if (!authHeader || !editingId) return;
    try {
      setActionLoading(true);
      await gameAPI.update(editingId, values, authHeader);
      await loadData();
      setStatusMessage(t('admin.updateSuccess', { item: t('nav.games') }));
      setFormMode(null);
      setEditingId(null);
    } catch (err) {
      setStatusMessage(err instanceof Error ? err.message : t('common.error'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteGame = async () => {
    if (!authHeader || !itemToDelete) return;
    try {
      setActionLoading(true);
      await gameAPI.delete(itemToDelete, authHeader);
      await loadData();
      setStatusMessage(t('admin.deleteSuccess', { item: t('nav.games') }));
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (err) {
      setStatusMessage(err instanceof Error ? err.message : t('common.error'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    if (!isAuthenticated) {
      setStatusMessage(t('app.notAuthenticated'));
      return;
    }
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const renderLoginPanel = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg">
          <Lock className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t('admin.access')}</h2>
          <p className="text-gray-600 text-sm">{t('admin.credentials')}</p>
        </div>
      </div>
      <form onSubmit={handleLoginSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.username')}</label>
          <input
            type="text"
            value={loginForm.username}
            onChange={event => setLoginForm(prev => ({ ...prev, username: event.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            placeholder="admin"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.password')}</label>
          <input
            type="password"
            value={loginForm.password}
            onChange={event => setLoginForm(prev => ({ ...prev, password: event.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
          />
        </div>
        {loginError && <p className="text-sm text-rose-500">{loginError}</p>}
        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
        >
          {t('app.signIn')}
        </button>
      </form>
    </div>
  );


  const renderModals = () => {
    if (!isAuthenticated) return null;

    const isPlayerFormOpen = activeTab === 'players' && formMode !== null;
    const isGameFormOpen = activeTab === 'games' && formMode !== null;

    return (
      <>
        {/* Player Modal */}
        <Modal
          isOpen={isPlayerFormOpen}
          onClose={() => {
            setFormMode(null);
            setEditingId(null);
          }}
          title={formMode === 'create' ? t('admin.addPlayer') : t('admin.editPlayer')}
        >
          {formMode === 'edit' && editingPlayer ? (
            <PlayerForm
              initialValues={{
                name: editingPlayer.name,
                username: editingPlayer.username,
                rating: editingPlayer.stats.currentRating,
                avatar: editingPlayer.avatar
              }}
              submitLabel={t('common.save')}
              loading={actionLoading}
              onSubmit={handleUpdatePlayer}
              onCancel={() => {
                setFormMode(null);
                setEditingId(null);
              }}
            />
          ) : (
            <PlayerForm
              loading={actionLoading}
              onSubmit={handleCreatePlayer}
              onCancel={() => setFormMode(null)}
            />
          )}
        </Modal>

        {/* Game Modal */}
        <Modal
          isOpen={isGameFormOpen}
          onClose={() => {
            setFormMode(null);
            setEditingId(null);
          }}
          title={formMode === 'create' ? t('admin.addGame') : t('admin.editGame')}
        >
          {formMode === 'edit' && editingGame ? (
            <GameForm
              initialValues={editingGame}
              submitLabel={t('common.save')}
              loading={actionLoading}
              onSubmit={handleUpdateGame}
              onCancel={() => {
                setFormMode(null);
                setEditingId(null);
              }}
            />
          ) : (
            <GameForm
              loading={actionLoading}
              onSubmit={handleCreateGame}
              onCancel={() => setFormMode(null)}
            />
          )}
        </Modal>
      </>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xl">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">{t('admin.title')}</h1>
            <p className="text-gray-600">
              {t('admin.subtitle')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <div className="px-4 py-2 bg-white rounded-xl border border-gray-200 text-sm text-gray-600">
                Signed in as <span className="font-semibold text-gray-900">{username}</span>
              </div>
              <button
                onClick={() => setShowLogoutModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                <LogOut className="w-4 h-4" /> {t('app.logout')}
              </button>
            </>
          ) : (
            <div className="px-4 py-2 bg-white rounded-xl border border-gray-200 text-sm text-gray-600 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              {t('app.notAuthenticated')}
            </div>
          )}
        </div>
      </header>

      {statusMessage && (
        <div className="flex items-center gap-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-xl px-4 py-2">
          <AlertCircle className="w-4 h-4 text-blue-500" />
          <span>{statusMessage}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-rose-600">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {!isAuthenticated && renderLoginPanel()}

      <div className="flex gap-4">
        <button
          onClick={() => {
            setActiveTab('players');
            setFormMode(null);
          }}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${activeTab === 'players'
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/50'
            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
        >
          <User className="w-5 h-5" />
          <span>{t('nav.players')}</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('games');
            setFormMode(null);
          }}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${activeTab === 'games'
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/50'
            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
        >
          <Trophy className="w-5 h-5" />
          <span>{t('nav.games')}</span>
        </button>
      </div>

      <section className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 capitalize">{t(`nav.${activeTab}`)}</h2>
            <p className="text-sm text-gray-500">Total: {activeTab === 'players' ? players.length : games.length}</p>
          </div>
          <button
            onClick={() => {
              if (!isAuthenticated) {
                setStatusMessage(t('app.notAuthenticated'));
                return;
              }
              setFormMode('create');
              setEditingId(null);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium disabled:opacity-70"
            disabled={!isAuthenticated}
          >
            <Plus className="w-4 h-4" />
            {t('common.add')} {activeTab === 'players' ? t('nav.players') : t('nav.games')}
          </button>
        </div>

        <div className="overflow-x-auto">
          {activeTab === 'players' ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-3">{t('player.name')}</th>
                  <th className="px-6 py-3">{t('player.username')}</th>
                  <th className="px-6 py-3">{t('player.rating')}</th>
                  <th className="px-6 py-3">{t('player.games')}</th>
                  <th className="px-6 py-3">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {players.map(player => (
                  <tr key={player.id} className="text-sm text-gray-700">
                    <td className="px-6 py-4 font-semibold text-gray-900">{player.name}</td>
                    <td className="px-6 py-4">@{player.username}</td>
                    <td className="px-6 py-4">{player.stats.currentRating}</td>
                    <td className="px-6 py-4">{player.stats.totalGames}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            if (!isAuthenticated) {
                              setStatusMessage(t('app.notAuthenticated'));
                              return;
                            }
                            setFormMode('edit');
                            setEditingId(player.id);
                          }}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 disabled:opacity-50"
                          disabled={!isAuthenticated || actionLoading}
                        >
                          <Edit3 className="w-4 h-4" />
                          {t('common.edit')}
                        </button>
                        <button
                          onClick={() => handleDeleteClick(player.id)}
                          className="flex items-center gap-1 text-rose-600 hover:text-rose-800 disabled:opacity-50"
                          disabled={!isAuthenticated || actionLoading}
                        >
                          <Trash2 className="w-4 h-4" />
                          {t('common.delete')}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-3">{t('game.date')}</th>
                  <th className="px-6 py-3">{t('game.white')}</th>
                  <th className="px-6 py-3">{t('game.black')}</th>
                  <th className="px-6 py-3">{t('game.result')}</th>
                  <th className="px-6 py-3">{t('game.moves')}</th>
                  <th className="px-6 py-3">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {games.map(game => {
                  const whitePlayer = players.find(p => p.id === (game.color === 'white' ? game.playerId : game.opponentId));
                  const blackPlayer = players.find(p => p.id === (game.color === 'black' ? game.playerId : game.opponentId));

                  return (
                    <tr key={game.id} className="text-sm text-gray-700">
                      <td className="px-6 py-4">{format(new Date(game.date), 'MMM d, yyyy')}</td>
                      <td className="px-6 py-4 font-medium">{whitePlayer?.name || t('common.unknown')}</td>
                      <td className="px-6 py-4 font-medium">{blackPlayer?.name || t('common.unknown')}</td>
                      <td className="px-6 py-4 capitalize">
                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${game.result === 'win' && game.color === 'white' ? 'bg-emerald-100 text-emerald-700' :
                          game.result === 'loss' && game.color === 'black' ? 'bg-emerald-100 text-emerald-700' :
                            game.result === 'draw' ? 'bg-amber-100 text-amber-700' :
                              'bg-rose-100 text-rose-700'
                          }`}>
                          {game.result === 'draw' ? t('game.draw') :
                            (game.result === 'win' && game.color === 'white') || (game.result === 'loss' && game.color === 'black') ? t('game.whiteWin') : t('game.blackWin')}
                        </span>
                      </td>
                      <td className="px-6 py-4">{game.moves}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-3">
                          <button
                            onClick={() => {
                              if (!isAuthenticated) {
                                setStatusMessage(t('app.notAuthenticated'));
                                return;
                              }
                              setFormMode('edit');
                              setEditingId(game.id);
                            }}
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 disabled:opacity-50"
                            disabled={!isAuthenticated || actionLoading}
                          >
                            <Edit3 className="w-4 h-4" />
                            {t('common.edit')}
                          </button>
                          <button
                            onClick={() => handleDeleteClick(game.id)}
                            className="flex items-center gap-1 text-rose-600 hover:text-rose-800 disabled:opacity-50"
                            disabled={!isAuthenticated || actionLoading}
                          >
                            <Trash2 className="w-4 h-4" />
                            {t('common.delete')}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {renderModals()}

      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title={t('app.logout')}
        message={t('admin.logoutConfirm')}
        confirmLabel={t('app.logout')}
        cancelLabel={t('common.cancel')}
        variant="warning"
      />

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setItemToDelete(null);
        }}
        onConfirm={activeTab === 'players' ? handleDeletePlayer : handleDeleteGame}
        title={`${t('common.delete')} ${activeTab === 'players' ? t('nav.players') : t('nav.games')}`}
        message={t('admin.deleteConfirm', { item: activeTab === 'players' ? t('nav.players') : t('nav.games') })}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        variant="danger"
        loading={actionLoading}
      />
    </div>
  );
}



