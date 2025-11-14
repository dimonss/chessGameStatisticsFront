import { ChessGame, GameStatistics, TimeControl } from '../types/chess';

export function calculateStatistics(games: ChessGame[]): GameStatistics {
  if (games.length === 0) {
    return {
      totalGames: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      winRate: 0,
      averageRating: 0,
      ratingChange: 0,
      gamesByTimeControl: {
        bullet: 0,
        blitz: 0,
        rapid: 0,
        classical: 0
      },
      gamesByColor: {
        white: 0,
        black: 0
      },
      recentGames: []
    };
  }

  const wins = games.filter(g => g.result === 'win').length;
  const losses = games.filter(g => g.result === 'loss').length;
  const draws = games.filter(g => g.result === 'draw').length;
  const winRate = (wins / games.length) * 100;

  const latestRating = games[0]?.rating.after || 0;
  const oldestRating = games[games.length - 1]?.rating.before || 0;
  const ratingChange = latestRating - oldestRating;

  const averageRating = games.reduce((sum, g) => sum + g.rating.after, 0) / games.length;

  const gamesByTimeControl: Record<TimeControl, number> = {
    bullet: 0,
    blitz: 0,
    rapid: 0,
    classical: 0
  };

  games.forEach(game => {
    gamesByTimeControl[game.timeControl]++;
  });

  const gamesByColor = {
    white: games.filter(g => g.color === 'white').length,
    black: games.filter(g => g.color === 'black').length
  };

  return {
    totalGames: games.length,
    wins,
    losses,
    draws,
    winRate,
    averageRating: Math.round(averageRating),
    ratingChange,
    gamesByTimeControl,
    gamesByColor,
    recentGames: games.slice(0, 5)
  };
}

