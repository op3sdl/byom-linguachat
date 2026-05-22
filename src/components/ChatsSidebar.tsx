import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useChats } from "../hooks/useChats";
import { useSettingsStore } from "../store/settingsStore";
import SidebarListItem from "./SidebarListItem";

interface ChatsSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function ChatsSidebar({ open, onOpenChange }: ChatsSidebarProps) {
  const navigate = useNavigate();
  const { chats, createChat, deleteChat } = useChats();
  const settings = useSettingsStore((state) => state.settings);

  const handleNewChat = () => {
    const newChat = createChat(settings.nativeLanguage, settings.targetLanguage);
    onOpenChange(false);
    navigate(`/chat/${newChat.id}`);
  };

  const handleNavigateToChat = (id: string) => {
    onOpenChange(false);
    navigate(`/chat/${id}`);
  };

  const handleNavigateToSettings = () => {
    onOpenChange(false);
    navigate("/settings");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-full sm:max-w-[400px] p-0 flex flex-col">
        <div className="flex-shrink-0 px-6 py-4 border-b">
          <SheetHeader>
            <SheetTitle>Chats</SheetTitle>
            <SheetDescription className="sr-only">
              Browse and manage your chats
            </SheetDescription>
          </SheetHeader>
        </div>

        <div className="flex-shrink-0 px-6 py-3 border-b">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleNewChat}
          >
            New Chat
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {chats.length === 0 ? (
            <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
              No chats yet
            </div>
          ) : (
            chats.map((chat) => (
              <SidebarListItem
                key={chat.id}
                title={chat.title}
                subtitle={new Date(chat.updatedAt).toLocaleDateString()}
                onClick={() => handleNavigateToChat(chat.id)}
                onDelete={() => deleteChat(chat.id)}
              />
            ))
          )}
        </div>

        <div className="flex-shrink-0 border-t">
          <button
            onClick={handleNavigateToSettings}
            className="flex items-center gap-3 w-full px-6 py-4 text-sm font-medium text-foreground hover:bg-accent transition-colors"
          >
            <Settings className="h-4 w-4 text-muted-foreground" />
            Settings
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default ChatsSidebar;
