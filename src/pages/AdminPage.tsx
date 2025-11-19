import { useEffect, useMemo, useState } from 'react';
import { ShieldCheck, Lock, Loader2, Edit3, Trash2, Plus, LogOut, AlertCircle } from 'lucide-react';
import { PlayerForm } from '../components/PlayerForm';
import { ConfirmModal } from '../components/ConfirmModal';
import { playerAPI } from '../utils/api';
import { PlayerWithStats, type PlayerFormValues } from '../types/chess';
import { useAuth } from '../context/AuthContext';

type FormMode = 'create' | 'edit' | null;

export function AdminPage() {
  const { isAuthenticated, username, authHeader, login, logout } = useAuth();
  const [players, setPlayers] = useState<PlayerWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [formMode, setFormMode] = useState<FormMode>(null);
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [playerToDelete, setPlayerToDelete] = useState<string | null>(null);

  const editingPlayer = useMemo(
    () => players.find(player => player.id === editingPlayerId),
    [players, editingPlayerId]
  );

  const loadPlayers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await playerAPI.getAll();
      setPlayers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load players');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlayers();
  }, []);

  const handleLoginSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    try {
      login(loginForm.username, loginForm.password);
      setLoginForm({ username: '', password: '' });
      setLoginError(null);
      setStatusMessage('Authenticated successfully.');
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Failed to authenticate');
    }
  };

  const handleLogout = () => {
    logout();
    setStatusMessage('Logged out.');
    setShowLogoutModal(false);
  };

  const handleCreate = async (values: PlayerFormValues) => {
    if (!authHeader) return;
    try {
      setActionLoading(true);
      await playerAPI.create(values, authHeader);
      await loadPlayers();
      setStatusMessage('Player created successfully.');
      setFormMode(null);
    } catch (err) {
      setStatusMessage(err instanceof Error ? err.message : 'Failed to create player');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdate = async (values: PlayerFormValues) => {
    if (!authHeader || !editingPlayerId) return;
    try {
      setActionLoading(true);
      await playerAPI.update(editingPlayerId, values, authHeader);
      await loadPlayers();
      setStatusMessage('Player updated successfully.');
      setFormMode(null);
      setEditingPlayerId(null);
    } catch (err) {
      setStatusMessage(err instanceof Error ? err.message : 'Failed to update player');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteClick = (playerId: string) => {
    if (!isAuthenticated) {
      setStatusMessage('Please sign in to delete players.');
      return;
    }
    setPlayerToDelete(playerId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!authHeader || !playerToDelete) return;

    try {
      setActionLoading(true);
      await playerAPI.delete(playerToDelete, authHeader);
      await loadPlayers();
      setStatusMessage('Player deleted.');
      setShowDeleteModal(false);
      setPlayerToDelete(null);
    } catch (err) {
      setStatusMessage(err instanceof Error ? err.message : 'Failed to delete player');
    } finally {
      setActionLoading(false);
    }
  };

  const renderLoginPanel = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg">
          <Lock className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Admin access</h2>
          <p className="text-gray-600 text-sm">Provide Basic Auth credentials</p>
        </div>
      </div>
      <form onSubmit={handleLoginSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            type="text"
            value={loginForm.username}
            onChange={event => setLoginForm(prev => ({ ...prev, username: event.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            placeholder="admin"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
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
          Sign in
        </button>
      </form>
    </div>
  );

  const renderFormPanel = () => {
    if (!isAuthenticated) {
      return null;
    }

    if (formMode === 'edit' && editingPlayer) {
      return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Edit player</h3>
              <p className="text-sm text-gray-500">Update profile information</p>
            </div>
          </div>
          <PlayerForm
            initialValues={{
              name: editingPlayer.name,
              username: editingPlayer.username,
              rating: editingPlayer.stats.currentRating,
              avatar: editingPlayer.avatar
            }}
            submitLabel="Save changes"
            loading={actionLoading}
            onSubmit={handleUpdate}
            onCancel={() => {
              setFormMode(null);
              setEditingPlayerId(null);
            }}
          />
        </div>
      );
    }

    if (formMode === 'create') {
      return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Add new player</h3>
              <p className="text-sm text-gray-500">Create a new profile</p>
            </div>
          </div>
          <PlayerForm
            loading={actionLoading}
            onSubmit={handleCreate}
            onCancel={() => setFormMode(null)}
          />
        </div>
      );
    }

    return null;
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
            <h1 className="text-4xl font-bold text-gray-900">Admin zone</h1>
            <p className="text-gray-600">
              Manage player records. Authentication is required for sensitive actions.
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
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </>
          ) : (
            <div className="px-4 py-2 bg-white rounded-xl border border-gray-200 text-sm text-gray-600 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Not authenticated
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

      <section className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Players</h2>
            <p className="text-sm text-gray-500">Total: {players.length}</p>
          </div>
          <button
            onClick={() => {
              if (!isAuthenticated) {
                setStatusMessage('Please sign in to add players.');
                return;
              }
              setFormMode('create');
              setEditingPlayerId(null);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium disabled:opacity-70"
            disabled={!isAuthenticated}
          >
            <Plus className="w-4 h-4" />
            Add player
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Username</th>
                <th className="px-6 py-3">Rating</th>
                <th className="px-6 py-3">Games</th>
                <th className="px-6 py-3">Actions</th>
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
                            setStatusMessage('Please sign in to edit players.');
                            return;
                          }
                          setFormMode('edit');
                          setEditingPlayerId(player.id);
                        }}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 disabled:opacity-50"
                        disabled={!isAuthenticated || actionLoading}
                      >
                        <Edit3 className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(player.id)}
                        className="flex items-center gap-1 text-rose-600 hover:text-rose-800 disabled:opacity-50"
                        disabled={!isAuthenticated || actionLoading}
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {renderFormPanel()}

      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out? You will need to authenticate again to perform admin actions."
        confirmLabel="Logout"
        cancelLabel="Cancel"
        variant="warning"
      />

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setPlayerToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Player"
        message={
          playerToDelete
            ? `Are you sure you want to delete "${players.find(p => p.id === playerToDelete)?.name || 'this player'}"? This action cannot be undone.`
            : 'Are you sure you want to delete this player? This action cannot be undone.'
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        loading={actionLoading}
      />
    </div>
  );
}


