import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ChatsListPage from './pages/ChatsListPage';
import ChatViewPage from './pages/ChatViewPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ChatsListPage />} />
        <Route path="/chat/:id" element={<ChatViewPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;