import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { PlayersPage } from './pages/PlayersPage';
import { PlayerPage } from './pages/PlayerPage';
import { GameDetails } from './components/GameDetails';

function App() {
  return (
    <BrowserRouter basename="/chessStatistics">
      <Layout>
        <Routes>
          <Route path="/" element={<PlayersPage />} />
          <Route path="/player/:id" element={<PlayerPage />} />
          <Route path="/game/:id" element={<GameDetails />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;

