import { useState, type ReactNode } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChatsSidebar from "./ChatsSidebar";

interface AppHeaderProps {
  title: string;
  children?: ReactNode;
  leftAction?: ReactNode;
}

function AppHeader({ title, children, leftAction }: AppHeaderProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <header className="bg-card border-b border-border px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          {leftAction ? (
            <div className="flex-shrink-0">{leftAction}</div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open menu"
              onClick={() => setSidebarOpen(true)}
              className="flex-shrink-0"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <h1 className="flex-1 text-center font-semibold text-foreground truncate px-2">
            {title}
          </h1>
          <div className="flex items-center gap-1 flex-shrink-0">
            {children}
          </div>
        </div>
      </header>
      {!leftAction && (
        <ChatsSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
      )}
    </>
  );
}

export default AppHeader;
