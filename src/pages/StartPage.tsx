import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useSettingsStore } from '../store/settingsStore';
import { useChats } from '../hooks/useChats';

function StartPage() {
  const navigate = useNavigate();
  const settings = useSettingsStore((state) => state.settings);
  const { createChat } = useChats();
  const created = useRef(false);

  useEffect(() => {
    // Guard against StrictMode double-fire
    if (created.current) return;
    created.current = true;

    const newChat = createChat(settings.nativeLanguage, settings.targetLanguage);
    navigate(`/chat/${newChat.id}`, { replace: true });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}

export default StartPage;
