# Chess Game Statistics

A modern web application for tracking and analyzing chess games with comprehensive statistics and analytics.

## Features

- 👥 **Players Management**: View all chess players and their profiles
- 📊 **Game Tracking**: Record and view all chess games between players
- 📈 **Analytics Dashboard**: Comprehensive statistics including win rate, rating changes, and performance metrics for each player
- 🎨 **Modern UI**: Beautiful, responsive design built with Tailwind CSS
- 🔍 **Game Details**: Detailed view of individual games with all relevant information
- 📱 **Responsive**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icon library
- **date-fns** - Date formatting utilities

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173/chessStatistics`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

The preview will be available at `http://localhost:4173/chessStatistics`

### Deployment

The application is configured to be deployed at the `/chessStatistics` path. 

**Important:** When deploying to a server:
- Make sure your web server is configured to serve the application from `/chessStatistics`
- For Apache, you may need to configure `.htaccess` with base path rewrite rules
- For Nginx, configure the location block to serve from `/chessStatistics`
- For static hosting (like GitHub Pages, Netlify, Vercel), ensure the base path is set correctly in your hosting configuration

The application uses:
- Base path: `/chessStatistics/` (configured in `vite.config.ts`)
- React Router basename: `/chessStatistics` (configured in `App.tsx`)

## Project Structure

```
src/
  ├── components/     # React components
  │   ├── Analytics.tsx
  │   ├── GameCard.tsx
  │   ├── GameDetails.tsx
  │   ├── GameList.tsx
  │   ├── Layout.tsx
  │   ├── PlayerCard.tsx
  │   └── PlayerList.tsx
  ├── data/          # Mock data
  │   ├── mockGames.ts
  │   └── mockPlayers.ts
  ├── pages/         # Page components
  │   ├── PlayerPage.tsx
  │   └── PlayersPage.tsx
  ├── types/         # TypeScript types
  │   └── chess.ts
  ├── utils/         # Utility functions
  │   └── statistics.ts
  ├── App.tsx        # Main app component
  ├── main.tsx       # Entry point
  └── index.css      # Global styles
```

## Current Status

The application currently uses mock data. Future enhancements could include:
- Backend integration for persistent storage
- User authentication
- Real-time game import from chess platforms
- Advanced analytics and visualizations
- Game replay functionality

## License

MIT

