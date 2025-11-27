import { useTranslation } from 'react-i18next';
import { PlayerWithStats } from '../types/chess';
import { User, TrendingUp, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../utils/image';

interface PlayerCardProps {
  player: PlayerWithStats;
}

export function PlayerCard({ player }: PlayerCardProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Используем статистику из пропсов (приходит с API)
  const { stats } = player;
  const { wins, losses, draws, totalGames, winRate, currentRating } = stats;

  // Определяем цвет карточки на основе рейтинга
  const getRatingColor = (rating: number) => {
    if (rating >= 2400) return 'from-purple-500 to-indigo-600';
    if (rating >= 2200) return 'from-blue-500 to-cyan-600';
    if (rating >= 2000) return 'from-emerald-500 to-green-600';
    if (rating >= 1800) return 'from-amber-500 to-yellow-600';
    return 'from-gray-500 to-gray-600';
  };

  return (
    <div
      onClick={() => navigate(`/player/${player.id}`)}
      className="group relative overflow-hidden bg-gradient-to-br from-white to-gray-50 rounded-2xl border-2 border-gray-200 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-blue-300 animate-fade-in"
    >
      {/* Decorative corner accent */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${getRatingColor(currentRating)} opacity-10 rounded-bl-full transform translate-x-8 -translate-y-8`} />

      <div className="relative p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getRatingColor(currentRating)} shadow-lg flex items-center justify-center overflow-hidden`}>
              {player.avatar ? (
                <img
                  src={getImageUrl(player.avatar)}
                  alt={player.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-xl text-gray-900 mb-1">{player.name}</h3>
              <p className="text-sm text-gray-500">@{player.username}</p>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{t('player.rating')}</span>
            <span className={`text-3xl font-bold bg-gradient-to-r ${getRatingColor(currentRating)} bg-clip-text text-transparent`}>
              {currentRating}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-200">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Award className="w-4 h-4 text-emerald-500" />
              <span className="text-lg font-bold text-gray-900">{wins}</span>
            </div>
            <p className="text-xs text-gray-500">{t('player.wins')}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="w-4 h-4 text-rose-500" />
              <span className="text-lg font-bold text-gray-900">{losses}</span>
            </div>
            <p className="text-xs text-gray-500">{t('player.losses')}</p>
          </div>
          <div className="text-center">
            <span className="text-lg font-bold text-gray-900 block mb-1">{draws}</span>
            <p className="text-xs text-gray-500">{t('player.draws')}</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{t('player.totalGames')}</span>
            <span className="font-bold text-lg text-gray-900">{totalGames}</span>
          </div>
          <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-600">{t('player.winRate')}</span>
              <span className="text-sm font-bold text-emerald-600">{winRate.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-green-600 rounded-full transition-all duration-1000"
                style={{ width: `${winRate}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


