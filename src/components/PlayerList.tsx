import { Player } from '../types/chess';
import { PlayerCard } from './PlayerCard';

interface PlayerListProps {
  players: Player[];
}

export function PlayerList({ players }: PlayerListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {players.length === 0 ? (
        <div className="col-span-full text-center py-12 text-gray-500">
          <p>No players found.</p>
        </div>
      ) : (
        players.map((player, index) => (
          <div key={player.id} style={{ animationDelay: `${index * 100}ms` }} className="animate-slide-up">
            <PlayerCard player={player} />
          </div>
        ))
      )}
    </div>
  );
}

