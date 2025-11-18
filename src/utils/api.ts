import { Player, PlayerWithStats, ChessGame, GameStatistics } from '../types/chess';

// Use proxy in development (via vite.config.ts) or direct URL in production
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

async function fetchAPI<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Resource not found');
    }
    throw new Error(`API error: ${response.statusText}`);
  }
  
  return response.json();
}

// Player API
export const playerAPI = {
  getAll: async (): Promise<PlayerWithStats[]> => {
    return fetchAPI<PlayerWithStats[]>('/players');
  },
  
  getById: async (id: string): Promise<Player> => {
    return fetchAPI<Player>(`/players/${id}`);
  }
};

// Game API
export const gameAPI = {
  getAll: async (playerId?: string): Promise<ChessGame[]> => {
    const url = playerId ? `/games?playerId=${playerId}` : '/games';
    return fetchAPI<ChessGame[]>(url);
  },
  
  getById: async (id: string): Promise<ChessGame> => {
    return fetchAPI<ChessGame>(`/games/${id}`);
  },
  
  getByPlayerId: async (playerId: string): Promise<ChessGame[]> => {
    return fetchAPI<ChessGame[]>(`/games/player/${playerId}`);
  },
  
  getPlayerStatistics: async (playerId: string): Promise<GameStatistics> => {
    return fetchAPI<GameStatistics>(`/games/player/${playerId}/statistics`);
  }
};

