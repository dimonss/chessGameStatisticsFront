import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PlayerList } from '../components/PlayerList';
import { playerAPI } from '../utils/api';
import { PlayerWithStats } from '../types/chess';
import { Users, Loader2, AlertCircle } from 'lucide-react';

export function PlayersPage() {
  const { t } = useTranslation();
  const [players, setPlayers] = useState<PlayerWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await playerAPI.getAll();
        setPlayers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('common.error'));
        console.error('Error fetching players:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, [t]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] animate-fade-in">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] animate-fade-in">
        <div className="text-center bg-white rounded-2xl p-8 shadow-lg border border-gray-200 max-w-md">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <p className="text-gray-700 mb-2 font-semibold">{t('common.error')}</p>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
              {t('nav.players')}
            </h1>
            <p className="text-gray-600 text-lg">{t('player.subtitle')}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="px-4 py-2 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200">
            <span className="font-semibold text-gray-900">{players.length}</span> {t('player.total')}
          </span>
        </div>
      </div>
      <PlayerList players={players} />
    </div>
  );
}

