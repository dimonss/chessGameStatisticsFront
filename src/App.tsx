import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { PlayersPage } from './pages/PlayersPage';
import { PlayerPage } from './pages/PlayerPage';
import { GameDetails } from './components/GameDetails';
import { AdminPage } from './pages/AdminPage';

function App() {
  return (
    <BrowserRouter basename="/chess_statistics">
      <Layout>
        <Routes>
          <Route path="/" element={<PlayersPage />} />
          <Route path="/player/:id" element={<PlayerPage />} />
          <Route path="/game/:id" element={<GameDetails />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;

