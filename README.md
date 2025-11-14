# Chess Game Statistics

A modern web application for tracking and analyzing chess games with comprehensive statistics and analytics.

## Features

- 📊 **Game Tracking**: Record and view all your chess games
- 📈 **Analytics Dashboard**: Comprehensive statistics including win rate, rating changes, and performance metrics
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

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
  ├── components/     # React components
  │   ├── Analytics.tsx
  │   ├── GameCard.tsx
  │   ├── GameDetails.tsx
  │   ├── GameList.tsx
  │   └── Layout.tsx
  ├── data/          # Mock data
  │   └── mockData.ts
  ├── pages/         # Page components
  │   ├── AnalyticsPage.tsx
  │   └── GamesPage.tsx
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

