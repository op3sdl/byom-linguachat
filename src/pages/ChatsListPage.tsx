import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Settings, Trash2 } from 'lucide-react';
import { useSettingsStore } from '../store/settingsStore';
import { useChats } from '../hooks/useChats';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function ChatsListPage() {
  const navigate = useNavigate();
  const settings = useSettingsStore((state) => state.settings);

  const { chats, createChat, deleteChat } = useChats();
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleNewChat = () => {
    const newChat = createChat(
      settings.nativeLanguage,
      settings.targetLanguage
    );
    navigate(`/chat/${newChat.id}`);
  };

  const handleSelectChat = (chatId: string) => {
    navigate(`/chat/${chatId}`);
  };

  const handleDeleteChat = () => {
    if (deleteConfirmId) {
      deleteChat(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">LinguaChat</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" aria-label="Saved Explanations" asChild>
              <Link to="/saved-explanations">
                <BookOpen className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" aria-label="Settings" asChild>
              <Link to="/settings">
                <Settings className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>

        <Button onClick={handleNewChat} className="w-full mb-4">
          New Chat
        </Button>

        {chats.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-2">No chats yet</p>
            <p className="text-sm text-muted-foreground">
              Click "New Chat" above to start your first chat
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {chats.map((chat) => (
              <Card
                key={chat.id}
                className="relative group hover:bg-accent cursor-pointer transition-colors"
                onClick={() => handleSelectChat(chat.id)}
              >
                <div className="p-4 pr-12">
                  <div className="font-medium text-sm truncate mb-1">
                    {chat.title}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(chat.updatedAt).toLocaleDateString()}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteConfirmId(chat.id);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 transition-opacity"
                  aria-label="Delete chat"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmId !== null}
        onOpenChange={(open) => !open && setDeleteConfirmId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Chat</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this chat? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteChat}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ChatsListPage;
