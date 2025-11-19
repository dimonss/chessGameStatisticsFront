import { ChessGame, Player } from '../types/chess';
import { GameCard } from './GameCard';
import { useNavigate } from 'react-router-dom';

interface GameListProps {
  games: ChessGame[];
  currentPlayerId?: string;
  opponents?: Record<string, Player>;
}

export function GameList({ games, currentPlayerId, opponents }: GameListProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {games.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No games recorded yet.</p>
        </div>
      ) : (
        games.map((game, index) => (
          <div key={game.id} style={{ animationDelay: `${index * 50}ms` }} className="animate-slide-up">
            <GameCard
              game={game}
              currentPlayerId={currentPlayerId}
              onClick={() => navigate(`/game/${game.id}`)}
              opponent={opponents ? opponents[game.opponentId] : undefined}
            />
          </div>
        ))
      )}
    </div>
  );
}

