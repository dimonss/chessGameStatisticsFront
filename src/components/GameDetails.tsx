import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { gameAPI, playerAPI } from '../utils/api';
import { ChessGame, Player } from '../types/chess';
import { format } from 'date-fns';
import { ArrowLeft, Trophy, TrendingDown, TrendingUp, Minus, User, Clock, Move, Calendar, Target, Loader2, AlertCircle } from 'lucide-react';

export function GameDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<ChessGame | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [opponent, setOpponent] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        const gameData = await gameAPI.getById(id);
        setGame(gameData);

        // Fetch player and opponent in parallel
        const [playerData, opponentData] = await Promise.all([
          playerAPI.getById(gameData.playerId),
          playerAPI.getById(gameData.opponentId)
        ]);

        setPlayer(playerData);
        setOpponent(opponentData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load game data');
        console.error('Error fetching game data:', err);
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
          <p className="text-gray-600">Loading game details...</p>
        </div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 max-w-md mx-auto">
          {error ? (
            <>
              <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
              <p className="text-gray-700 mb-2 font-semibold">Error loading game</p>
              <p className="text-gray-500 text-sm mb-6">{error}</p>
            </>
          ) : (
            <p className="text-gray-500 mb-6 text-lg">Game not found</p>
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

  const resultIcons = {
    win: <Trophy className="w-8 h-8 text-emerald-500" />,
    loss: <TrendingDown className="w-8 h-8 text-rose-500" />,
    draw: <Minus className="w-8 h-8 text-amber-500" />
  };

  const resultGradients = {
    win: 'from-emerald-50 via-green-50 to-emerald-50 border-emerald-200/60',
    loss: 'from-rose-50 via-red-50 to-rose-50 border-rose-200/60',
    draw: 'from-amber-50 via-yellow-50 to-amber-50 border-amber-200/60'
  };

  const resultBadges = {
    win: 'bg-gradient-to-r from-emerald-500 to-green-600 text-white',
    loss: 'bg-gradient-to-r from-rose-500 to-red-600 text-white',
    draw: 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white'
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <button
        onClick={() => navigate(game.playerId ? `/player/${game.playerId}` : '/')}
        className="flex items-center gap-2 mb-8 text-gray-600 hover:text-gray-900 transition-all duration-300 group"
      >
        <div className="p-2 rounded-lg bg-white shadow-md group-hover:shadow-lg transition-all">
          <ArrowLeft className="w-5 h-5" />
        </div>
        <span className="font-medium">Back to {player?.name || 'Players'}</span>
      </button>

      <div className={`relative overflow-hidden bg-gradient-to-br ${resultGradients[game.result]} border-2 rounded-3xl shadow-xl`}>
        <div className={`absolute top-0 right-0 w-64 h-64 ${resultBadges[game.result]} opacity-10 rounded-bl-full transform translate-x-16 -translate-y-16`} />

        <div className="relative p-8">
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-2xl ${resultBadges[game.result]} shadow-xl`}>
                {resultIcons[game.result]}
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2 capitalize">{game.result}</h1>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">{format(new Date(game.date), 'MMMM dd, yyyy')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center overflow-hidden">
                  {opponent?.avatar ? (
                    <img
                      src={opponent.avatar}
                      alt={opponent.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 text-white" />
                  )}
                </div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Opponent</p>
              </div>
              <p className="font-bold text-2xl text-gray-900">{opponent?.name || 'Unknown'}</p>
              <p className="text-sm text-gray-500 mt-1">@{opponent?.username || 'unknown'}</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${game.color === 'white' ? 'bg-gradient-to-br from-gray-300 to-gray-400' : 'bg-gradient-to-br from-gray-700 to-gray-900'}`}>
                  <span className="text-white text-lg">{game.color === 'white' ? '♔' : '♚'}</span>
                </div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Color</p>
              </div>
              <p className="font-bold text-2xl text-gray-900 capitalize">{game.color}</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Time Control</p>
              </div>
              <p className="font-bold text-2xl text-gray-900 capitalize">{game.timeControl}</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600">
                  <Move className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Moves</p>
              </div>
              <p className="font-bold text-2xl text-gray-900">{game.moves}</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/50 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Rating</h3>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Before</p>
                  <p className="text-3xl font-bold text-gray-700">{game.rating.before}</p>
                </div>
                <div className="text-2xl text-gray-400">→</div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">After</p>
                  <p className="text-3xl font-bold text-gray-900">{game.rating.after}</p>
                </div>
              </div>
              <div className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold shadow-lg ${game.rating.change > 0
                  ? 'text-emerald-600 bg-emerald-50'
                  : game.rating.change < 0
                    ? 'text-rose-600 bg-rose-50'
                    : 'text-gray-600 bg-gray-50'
                }`}>
                {game.rating.change > 0 && <TrendingUp className="w-6 h-6" />}
                {game.rating.change < 0 && <TrendingDown className="w-6 h-6" />}
                <span className="text-xl">{game.rating.change > 0 ? '+' : ''}{game.rating.change}</span>
              </div>
            </div>
          </div>

          {game.opening && (
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50 mb-6">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Opening</p>
              <p className="font-bold text-xl text-gray-900 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {game.opening}
              </p>
            </div>
          )}

          {game.notes && (
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Notes</p>
              <p className="text-gray-800 leading-relaxed">{game.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

