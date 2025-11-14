import { ChessGame } from '../types/chess';
import { format } from 'date-fns';
import { Trophy, TrendingDown, TrendingUp, Minus, User, Clock, Move } from 'lucide-react';
import { mockPlayers } from '../data/mockPlayers';

interface GameCardProps {
  game: ChessGame;
  onClick?: () => void;
  currentPlayerId?: string;
}

export function GameCard({ game, onClick, currentPlayerId }: GameCardProps) {
  const opponent = mockPlayers.find(p => p.id === game.opponentId);
  const opponentName = opponent?.name || 'Unknown';
  console.log(currentPlayerId);
  const resultIcons = {
    win: <Trophy className="w-6 h-6 text-emerald-500" />,
    loss: <TrendingDown className="w-6 h-6 text-rose-500" />,
    draw: <Minus className="w-6 h-6 text-amber-500" />
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

  const ratingChangeColor = game.rating.change > 0 
    ? 'text-emerald-600 bg-emerald-50' 
    : game.rating.change < 0 
    ? 'text-rose-600 bg-rose-50' 
    : 'text-gray-600 bg-gray-50';

  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden bg-gradient-to-br ${resultGradients[game.result]} border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-opacity-100 animate-fade-in`}
    >
      {/* Decorative corner accent */}
      <div className={`absolute top-0 right-0 w-32 h-32 ${resultBadges[game.result]} opacity-10 rounded-bl-full transform translate-x-8 -translate-y-8`} />
      
      <div className="relative p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${resultBadges[game.result]} shadow-lg`}>
              {resultIcons[game.result]}
            </div>
            <div>
              <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold capitalize ${resultBadges[game.result]} shadow-md`}>
                {game.result}
              </span>
            </div>
          </div>
          <span className="text-sm font-medium text-gray-500 bg-white/60 px-3 py-1.5 rounded-full backdrop-blur-sm">
            {format(new Date(game.date), 'MMM dd, yyyy')}
          </span>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <User className="w-4 h-4 text-gray-400" />
            <p className="font-bold text-xl text-gray-900">vs {opponentName}</p>
          </div>
          <div className="flex items-center gap-3 mt-3 text-sm text-gray-600">
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/70 rounded-lg backdrop-blur-sm font-medium">
              <span className={`w-2 h-2 rounded-full ${game.color === 'white' ? 'bg-gray-300' : 'bg-gray-700'}`} />
              <span className="capitalize">{game.color}</span>
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/70 rounded-lg backdrop-blur-sm font-medium">
              <Clock className="w-3.5 h-3.5" />
              <span className="capitalize">{game.timeControl}</span>
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/70 rounded-lg backdrop-blur-sm font-medium">
              <Move className="w-3.5 h-3.5" />
              <span>{game.moves} moves</span>
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/50">
          <div className="flex items-baseline gap-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Rating</span>
            <span className="text-2xl font-bold text-gray-900">{game.rating.after}</span>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold ${ratingChangeColor} shadow-sm`}>
            {game.rating.change > 0 && <TrendingUp className="w-4 h-4" />}
            {game.rating.change < 0 && <TrendingDown className="w-4 h-4" />}
            {game.rating.change !== 0 && (
              <span>{game.rating.change > 0 ? '+' : ''}{game.rating.change}</span>
            )}
            {game.rating.change === 0 && <span>0</span>}
          </div>
        </div>

        {game.opening && (
          <div className="mt-4 pt-4 border-t border-white/50">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Opening</span>
              <span className="text-sm font-semibold text-gray-700 bg-white/60 px-2.5 py-1 rounded-lg">{game.opening}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
