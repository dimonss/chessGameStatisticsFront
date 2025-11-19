import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { playerAPI, gameAPI } from '../utils/api';
import { Player, ChessGame, GameStatistics } from '../types/chess';
import { GameList } from '../components/GameList';
import { Analytics } from '../components/Analytics';
import { ArrowLeft, User, Trophy, Loader2, AlertCircle } from 'lucide-react';

export function PlayerPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'games' | 'analytics'>('games');
  const [player, setPlayer] = useState<Player | null>(null);
  const [playerGames, setPlayerGames] = useState<ChessGame[]>([]);
  const [statistics, setStatistics] = useState<GameStatistics | null>(null);
  const [opponents, setOpponents] = useState<Record<string, Player>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const [playerData, gamesData, statsData] = await Promise.all([
          playerAPI.getById(id),
          gameAPI.getByPlayerId(id),
          gameAPI.getPlayerStatistics(id)
        ]);
        
        setPlayer(playerData);
        setPlayerGames(gamesData);
        setStatistics(statsData);

        // Extract unique opponent IDs
        const opponentIds = new Set<string>();
        gamesData.forEach(game => opponentIds.add(game.opponentId));
        statsData.recentGames.forEach(game => opponentIds.add(game.opponentId));

        // Fetch opponents
        const uniqueOpponentIds = Array.from(opponentIds);
        const opponentsData = await Promise.all(
          uniqueOpponentIds.map(opponentId => playerAPI.getById(opponentId))
        );

        const opponentsMap: Record<string, Player> = {};
        opponentsData.forEach(opponent => {
          opponentsMap[opponent.id] = opponent;
        });
        setOpponents(opponentsMap);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load player data');
        console.error('Error fetching player data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] animate-fade-in">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading player data...</p>
        </div>
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 max-w-md mx-auto">
          {error ? (
            <>
              <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
              <p className="text-gray-700 mb-2 font-semibold">Error loading player</p>
              <p className="text-gray-500 text-sm mb-6">{error}</p>
            </>
          ) : (
            <p className="text-gray-500 mb-6 text-lg">Player not found</p>
          )}
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
          >
            Back to Players
          </button>
        </div>
      </div>
    );
  }

  // Получаем последний рейтинг
  const latestGame = playerGames[0];
  const currentRating = latestGame?.rating.after || player.rating;

  // Определяем цвет на основе рейтинга
  const getRatingColor = (rating: number) => {
    if (rating >= 2400) return 'from-purple-500 to-indigo-600';
    if (rating >= 2200) return 'from-blue-500 to-cyan-600';
    if (rating >= 2000) return 'from-emerald-500 to-green-600';
    if (rating >= 1800) return 'from-amber-500 to-yellow-600';
    return 'from-gray-500 to-gray-600';
  };

  return (
    <div className="animate-fade-in">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-900 transition-all duration-300 group"
      >
        <div className="p-2 rounded-lg bg-white shadow-md group-hover:shadow-lg transition-all">
          <ArrowLeft className="w-5 h-5" />
        </div>
        <span className="font-medium">Back to Players</span>
      </button>

      {/* Player Header */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg border border-gray-200/50 mb-6">
        <div className="flex items-center gap-6">
          <div className={`p-4 rounded-2xl bg-gradient-to-br ${getRatingColor(currentRating)} shadow-xl`}>
            <User className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{player.name}</h1>
            <p className="text-lg text-gray-600 mb-4">@{player.username}</p>
            <div className="flex items-center gap-6">
              <div>
                <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Current Rating</span>
                <p className={`text-3xl font-bold bg-gradient-to-r ${getRatingColor(currentRating)} bg-clip-text text-transparent`}>
                  {currentRating}
                </p>
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Total Games</span>
                <p className="text-3xl font-bold text-gray-900">{statistics ? statistics.totalGames : 0}</p>
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Win Rate</span>
                <p className="text-3xl font-bold text-emerald-600">
                  {statistics ? statistics.winRate.toFixed(1) : '0.0'}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('games')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
            activeTab === 'games'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/50'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Trophy className="w-5 h-5" />
          <span>Games</span>
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
            activeTab === 'analytics'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/50'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <User className="w-5 h-5" />
          <span>Analytics</span>
        </button>
      </div>

      {/* Content */}
      {activeTab === 'games' ? (
        <GameList games={playerGames} currentPlayerId={player.id} opponents={opponents} />
      ) : (
        statistics && <Analytics statistics={statistics} opponents={opponents} />
      )}
    </div>
  );
}

