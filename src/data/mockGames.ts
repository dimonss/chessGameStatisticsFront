import { ChessGame } from '../types/chess';

// Генерируем игры между всеми участниками
export const generateMockGames = (): ChessGame[] => {
  const games: ChessGame[] = [];
  const playerIds = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  const timeControls: Array<'bullet' | 'blitz' | 'rapid' | 'classical'> = ['bullet', 'blitz', 'rapid', 'classical'];
  const results: Array<'win' | 'loss' | 'draw'> = ['win', 'loss', 'draw'];
  
  let gameId = 1;
  const baseDate = new Date('2024-01-01');
  
  // Создаем игры между разными парами участников
  for (let i = 0; i < playerIds.length; i++) {
    for (let j = i + 1; j < playerIds.length; j++) {
      const player1Id = playerIds[i];
      const player2Id = playerIds[j];
      
      // Создаем 2-4 игры между каждой парой
      const numGames = Math.floor(Math.random() * 3) + 2;
      
      for (let k = 0; k < numGames; k++) {
        const timeControl = timeControls[Math.floor(Math.random() * timeControls.length)];
        const result = results[Math.floor(Math.random() * results.length)];
        const color: 'white' | 'black' = Math.random() > 0.5 ? 'white' : 'black';
        const moves = Math.floor(Math.random() * 50) + 20;
        
        // Определяем рейтинг и результат
        const baseRating1 = 1650 + (parseInt(player1Id) * 80);
        const baseRating2 = 1650 + (parseInt(player2Id) * 80);
        
        let ratingChange = 0;
        if (result === 'win') {
          ratingChange = Math.floor(Math.random() * 20) + 10;
        } else if (result === 'loss') {
          ratingChange = -(Math.floor(Math.random() * 20) + 10);
        }
        
        const ratingBefore = color === 'white' ? baseRating1 : baseRating2;
        const ratingAfter = ratingBefore + ratingChange;
        
        // Создаем игру от первого игрока
        const date = new Date(baseDate);
        date.setDate(date.getDate() + gameId);
        
        games.push({
          id: `game-${gameId}`,
          date: date.toISOString().split('T')[0],
          playerId: player1Id,
          opponentId: player2Id,
          result: result,
          color: color,
          timeControl: timeControl,
          moves: moves,
          rating: {
            before: ratingBefore,
            after: ratingAfter,
            change: ratingChange
          },
          opening: getRandomOpening(),
          notes: getRandomNote()
        });
        
        gameId++;
        
        // Создаем обратную игру (от второго игрока)
        const reverseResult: 'win' | 'loss' | 'draw' = result === 'win' ? 'loss' : result === 'loss' ? 'win' : 'draw';
        const reverseColor: 'white' | 'black' = color === 'white' ? 'black' : 'white';
        const reverseRatingBefore = reverseColor === 'white' ? baseRating1 : baseRating2;
        const reverseRatingChange = -ratingChange;
        const reverseRatingAfter = reverseRatingBefore + reverseRatingChange;
        
        const date2 = new Date(baseDate);
        date2.setDate(date2.getDate() + gameId);
        
        games.push({
          id: `game-${gameId}`,
          date: date2.toISOString().split('T')[0],
          playerId: player2Id,
          opponentId: player1Id,
          result: reverseResult,
          color: reverseColor,
          timeControl: timeControls[Math.floor(Math.random() * timeControls.length)],
          moves: Math.floor(Math.random() * 50) + 20,
          rating: {
            before: reverseRatingBefore,
            after: reverseRatingAfter,
            change: reverseRatingChange
          },
          opening: getRandomOpening(),
          notes: getRandomNote()
        });
        
        gameId++;
      }
    }
  }
  
  // Сортируем по дате (новые первыми)
  return games.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

function getRandomOpening(): string {
  const openings = [
    'Sicilian Defense',
    'Queen\'s Gambit',
    'Ruy Lopez',
    'French Defense',
    'Italian Game',
    'King\'s Indian Defense',
    'English Opening',
    'Nimzo-Indian Defense',
    'Catalan Opening',
    'Pirc Defense',
    'Caro-Kann Defense',
    'Scandinavian Defense',
    'London System',
    'Dutch Defense',
    'Grünfeld Defense'
  ];
  return openings[Math.floor(Math.random() * openings.length)];
}

function getRandomNote(): string {
  const notes = [
    'Great endgame technique',
    'Mistake in the opening',
    'Long endgame, well played by both',
    'Good tactical play',
    'Strong opening preparation',
    'Time trouble',
    'Excellent positional play',
    'Threefold repetition',
    'Good conversion of advantage',
    'Quick victory',
    'Brilliant combination',
    'Solid defense',
    'Aggressive play',
    'Patient endgame'
  ];
  return notes[Math.floor(Math.random() * notes.length)];
}

export const mockGames = generateMockGames();

