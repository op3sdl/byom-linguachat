import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { useSettingsStore } from '../store/settingsStore';
import { useChats } from '../hooks/useChats';
import { useExplanationsStore } from '../store/explanationsStore';
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
import AppHeader from '../components/AppHeader';

function SavedExplanationsListPage() {
  const navigate = useNavigate();
  const settings = useSettingsStore((state) => state.settings);
  const { createChat } = useChats();
  const savedExplanations = useExplanationsStore((state) => state.savedExplanations);
  const deleteExplanation = useExplanationsStore((state) => state.deleteExplanation);

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleNewChat = () => {
    const newChat = createChat(settings.nativeLanguage, settings.targetLanguage);
    navigate(`/chat/${newChat.id}`);
  };

  const handleDeleteExplanation = () => {
    if (deleteConfirmId) {
      deleteExplanation(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  const truncateText = (text: string, maxLength: number = 60): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader title="Explanations" onNewChat={handleNewChat} />

      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-lg mx-auto">
          {savedExplanations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-2">No saved explanations yet</p>
              <p className="text-sm text-muted-foreground">
                Save explanations from your chats to review them later
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {savedExplanations.map((savedExp) => (
                <Card
                  key={savedExp.id}
                  className="relative group hover:bg-accent cursor-pointer transition-colors"
                  onClick={() => navigate(`/explanation/${savedExp.id}`)}
                >
                  <div className="p-4 pr-12">
                    <div className="font-medium text-sm truncate mb-1">
                      {truncateText(savedExp.selection)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(savedExp.savedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteConfirmId(savedExp.id);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 transition-opacity"
                    aria-label="Delete explanation"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog
        open={deleteConfirmId !== null}
        onOpenChange={(open) => !open && setDeleteConfirmId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Explanation</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this saved explanation? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteExplanation}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SavedExplanationsListPage;
