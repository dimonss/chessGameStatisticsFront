import { PlayerList } from '../components/PlayerList';
import { mockPlayers } from '../data/mockPlayers';
import { Users } from 'lucide-react';

export function PlayersPage() {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
              Players
            </h1>
            <p className="text-gray-600 text-lg">View all chess players and their statistics</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="px-4 py-2 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200">
            <span className="font-semibold text-gray-900">{mockPlayers.length}</span> players total
          </span>
        </div>
      </div>
      <PlayerList players={mockPlayers} />
    </div>
  );
}

