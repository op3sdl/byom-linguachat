import { BrowserRouter, Routes, Route } from 'react-router-dom';
import StartPage from './pages/StartPage';
import ChatsListPage from './pages/ChatsListPage';
import ChatViewPage from './pages/ChatViewPage';
import SettingsPage from './pages/SettingsPage';
import SavedExplanationsListPage from './pages/SavedExplanationsListPage';
import ExplanationViewPage from './pages/ExplanationViewPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/chats" element={<ChatsListPage />} />
        <Route path="/chat/:id" element={<ChatViewPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/explanations" element={<SavedExplanationsListPage />} />
        <Route path="/explanation/:id" element={<ExplanationViewPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;