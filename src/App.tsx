import { BrowserRouter, Routes, Route } from 'react-router-dom';
import StartPage from './pages/StartPage';
import ChatViewPage from './pages/ChatViewPage';
import SettingsPage from './pages/SettingsPage';
import ExplanationViewPage from './pages/ExplanationViewPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/chat/:id" element={<ChatViewPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/explanation/:id" element={<ExplanationViewPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;