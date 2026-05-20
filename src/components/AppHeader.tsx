import { useState, type ReactNode } from "react";
import { Menu, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import SidebarMenu from "./SidebarMenu";

interface AppHeaderProps {
  title: string;
  children?: ReactNode;
  onNewChat?: () => void;
}

function AppHeader({ title, children, onNewChat }: AppHeaderProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <header className="bg-card border-b border-border px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open menu"
            onClick={() => setSidebarOpen(true)}
            className="flex-shrink-0"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="flex-1 text-center font-semibold text-foreground truncate px-2">
            {title}
          </h1>
          <div className="flex items-center gap-1 flex-shrink-0">
            {children}
            {onNewChat && (
              <Button
                variant="ghost"
                size="icon"
                aria-label="New chat"
                onClick={onNewChat}
              >
                <Plus className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </header>
      <SidebarMenu open={sidebarOpen} onOpenChange={setSidebarOpen} />
    </>
  );
}

export default AppHeader;
