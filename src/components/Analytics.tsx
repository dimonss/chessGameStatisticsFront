import { GameStatistics } from '../types/chess';
import { Trophy, TrendingUp, TrendingDown, Minus, BarChart3, Target, Award, Activity, Clock } from 'lucide-react';
import { GameCard } from './GameCard';

interface AnalyticsProps {
  statistics: GameStatistics;
}

export function Analytics({ statistics }: AnalyticsProps) {
  const statCards = [
    {
      label: 'Total Games',
      value: statistics.totalGames,
      icon: BarChart3,
      gradient: 'from-blue-500 to-cyan-600',
      bgGradient: 'from-blue-50 to-cyan-50',
      textColor: 'text-blue-600'
    },
    {
      label: 'Wins',
      value: statistics.wins,
      icon: Trophy,
      gradient: 'from-emerald-500 to-green-600',
      bgGradient: 'from-emerald-50 to-green-50',
      textColor: 'text-emerald-600'
    },
    {
      label: 'Losses',
      value: statistics.losses,
      icon: TrendingDown,
      gradient: 'from-rose-500 to-red-600',
      bgGradient: 'from-rose-50 to-red-50',
      textColor: 'text-rose-600'
    },
    {
      label: 'Draws',
      value: statistics.draws,
      icon: Minus,
      gradient: 'from-amber-500 to-yellow-600',
      bgGradient: 'from-amber-50 to-yellow-50',
      textColor: 'text-amber-600'
    }
  ];

  const timeControlColors: Record<string, { gradient: string; bg: string }> = {
    bullet: { gradient: 'from-purple-500 to-pink-600', bg: 'bg-purple-500' },
    blitz: { gradient: 'from-blue-500 to-indigo-600', bg: 'bg-blue-500' },
    rapid: { gradient: 'from-cyan-500 to-teal-600', bg: 'bg-cyan-500' },
    classical: { gradient: 'from-emerald-500 to-green-600', bg: 'bg-emerald-500' }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={stat.label} 
              className={`relative overflow-hidden bg-gradient-to-br ${stat.bgGradient} rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 hover:scale-105 animate-slide-up`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.gradient} opacity-20 rounded-bl-full transform translate-x-8 -translate-y-8`} />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="mb-2">
                  <p className="text-4xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p className={`text-sm font-semibold ${stat.textColor} uppercase tracking-wide`}>{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
              <Target className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Performance</h3>
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 font-medium">Win Rate</span>
                <span className="font-bold text-2xl text-gray-900">{statistics.winRate.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-green-600 rounded-full transition-all duration-1000 ease-out shadow-lg"
                  style={{ width: `${statistics.winRate}%` }}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-100">
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Avg Rating</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{statistics.averageRating}</p>
              </div>
              <div className={`p-4 rounded-xl border ${
                statistics.ratingChange > 0 
                  ? 'bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-100' 
                  : statistics.ratingChange < 0
                  ? 'bg-gradient-to-br from-rose-50 to-red-50 border-rose-100'
                  : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  {statistics.ratingChange > 0 ? (
                    <TrendingUp className={`w-4 h-4 ${statistics.ratingChange > 0 ? 'text-emerald-600' : ''}`} />
                  ) : statistics.ratingChange < 0 ? (
                    <TrendingDown className="w-4 h-4 text-rose-600" />
                  ) : (
                    <Minus className="w-4 h-4 text-gray-600" />
                  )}
                  <span className={`text-xs font-semibold uppercase tracking-wide ${
                    statistics.ratingChange > 0 ? 'text-emerald-600' : 
                    statistics.ratingChange < 0 ? 'text-rose-600' : 'text-gray-600'
                  }`}>
                    Change
                  </span>
                </div>
                <p className={`text-2xl font-bold ${
                  statistics.ratingChange > 0 ? 'text-emerald-600' : 
                  statistics.ratingChange < 0 ? 'text-rose-600' : 'text-gray-600'
                }`}>
                  {statistics.ratingChange > 0 ? '+' : ''}{statistics.ratingChange}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Time Control</h3>
          </div>
          <div className="space-y-4">
            {Object.entries(statistics.gamesByTimeControl).map(([control, count], index) => {
              const percentage = statistics.totalGames > 0 ? (count / statistics.totalGames) * 100 : 0;
              const colors = timeControlColors[control] || { gradient: 'from-gray-500 to-gray-600', bg: 'bg-gray-500' };
              return (
                <div key={control} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-semibold capitalize">{control}</span>
                    <span className="font-bold text-lg text-gray-900">{count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                    <div
                      className={`h-full bg-gradient-to-r ${colors.gradient} rounded-full transition-all duration-1000 ease-out shadow-md`}
                      style={{ width: `${percentage}%`, transitionDelay: `${index * 100}ms` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg">
            <Award className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Games by Color</h3>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="relative overflow-hidden text-center p-8 bg-gradient-to-br from-chess-light to-white rounded-xl border-4 border-chess-dark shadow-xl transform hover:scale-105 transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-chess-dark opacity-10 rounded-bl-full transform translate-x-8 -translate-y-8" />
            <div className="relative">
              <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-chess-dark">
                <span className="text-2xl">♔</span>
              </div>
              <p className="text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide">White</p>
              <p className="text-5xl font-bold text-gray-900">{statistics.gamesByColor.white}</p>
            </div>
          </div>
          <div className="relative overflow-hidden text-center p-8 bg-gradient-to-br from-chess-dark to-gray-700 rounded-xl border-4 border-chess-dark shadow-xl transform hover:scale-105 transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-bl-full transform translate-x-8 -translate-y-8" />
            <div className="relative">
              <div className="w-16 h-16 mx-auto mb-4 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border-4 border-white/30">
                <span className="text-2xl">♚</span>
              </div>
              <p className="text-sm font-bold text-white/90 mb-2 uppercase tracking-wide">Black</p>
              <p className="text-5xl font-bold text-white">{statistics.gamesByColor.black}</p>
            </div>
          </div>
        </div>
      </div>

      {statistics.recentGames.length > 0 && (
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg border border-gray-200/50">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            Recent Games
          </h3>
          <div className="space-y-4">
            {statistics.recentGames.map((game, index) => (
              <div key={game.id} style={{ animationDelay: `${index * 100}ms` }} className="animate-slide-up">
                <GameCard game={game} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

