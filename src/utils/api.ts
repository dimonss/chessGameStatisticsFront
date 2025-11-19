import {
  Player,
  PlayerWithStats,
  ChessGame,
  GameStatistics,
  type PlayerFormValues
} from '../types/chess';

// Use proxy in development (via vite.config.ts) or direct URL in production
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  headers?: HeadersInit;
  authHeader?: string | null;
}

async function fetchAPI<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { method = 'GET', body, headers, authHeader } = options;

  const requestHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...headers
  };

  if (authHeader) {
    requestHeaders.Authorization = authHeader;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined
  });
  
  if (!response.ok) {
    let message = response.statusText;
    
    try {
      const errorBody = await response.json();
      if (typeof errorBody?.error === 'string') {
        message = errorBody.error;
      } else if (typeof errorBody?.message === 'string') {
        message = errorBody.message;
      }
    } catch {
      // ignore JSON parse errors
    }

    if (response.status === 404) {
      throw new Error('Resource not found');
    }

    if (response.status === 401 || response.status === 403) {
      throw new Error('Unauthorized. Please check your credentials.');
    }

    throw new Error(`API error: ${message}`);
  }
  
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

const playerCache = new Map<string, Player>();
const inFlightPlayerRequests = new Map<string, Promise<Player>>();

const cachePlayer = (player: Player) => {
  playerCache.set(player.id, player);
};

// Player API
export const playerAPI = {
  getAll: async (): Promise<PlayerWithStats[]> => {
    const players = await fetchAPI<PlayerWithStats[]>('/players');
    players.forEach(cachePlayer);
    return players;
  },
  
  getById: async (id: string): Promise<Player> => {
    const cachedPlayer = playerCache.get(id);
    if (cachedPlayer) {
      return cachedPlayer;
    }

    const existingRequest = inFlightPlayerRequests.get(id);
    if (existingRequest) {
      return existingRequest;
    }

    const request = fetchAPI<Player>(`/players/${id}`)
      .then(player => {
        cachePlayer(player);
        inFlightPlayerRequests.delete(id);
        return player;
      })
      .catch(error => {
        inFlightPlayerRequests.delete(id);
        throw error;
      });

    inFlightPlayerRequests.set(id, request);
    return request;
  },

  create: async (payload: PlayerFormValues, authHeader: string | null): Promise<Player> => {
    if (!authHeader) {
      throw new Error('Authorization header is required');
    }
    const player = await fetchAPI<Player>('/players', {
      method: 'POST',
      body: payload,
      authHeader
    });
    cachePlayer(player);
    return player;
  },

  update: async (
    id: string,
    payload: Partial<PlayerFormValues>,
    authHeader: string | null
  ): Promise<Player> => {
    if (!authHeader) {
      throw new Error('Authorization header is required');
    }
    const player = await fetchAPI<Player>(`/players/${id}`, {
      method: 'PUT',
      body: payload,
      authHeader
    });
    cachePlayer(player);
    return player;
  },

  delete: async (id: string, authHeader: string | null): Promise<void> => {
    if (!authHeader) {
      throw new Error('Authorization header is required');
    }
    await fetchAPI<void>(`/players/${id}`, {
      method: 'DELETE',
      authHeader
    });
    playerCache.delete(id);
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

