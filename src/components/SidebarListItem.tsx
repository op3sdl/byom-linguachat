import { useEffect, useRef, useState } from "react";
import { Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarListItemProps {
  title: string;
  subtitle?: string;
  onClick: () => void;
  onDelete: () => void;
}

function SidebarListItem({ title, subtitle, onClick, onDelete }: SidebarListItemProps) {
  const [pendingDelete, setPendingDelete] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (pendingDelete) {
      clearTimeout(timerRef.current!);
      timerRef.current = null;
      setPendingDelete(false);
      onDelete();
    } else {
      setPendingDelete(true);
      timerRef.current = setTimeout(() => {
        setPendingDelete(false);
        timerRef.current = null;
      }, 5000);
    }
  };

  return (
    <div
      className="relative group hover:bg-accent cursor-pointer transition-colors"
      onClick={onClick}
    >
      <div className="p-4 pr-12">
        <div className="font-medium text-sm truncate">{title}</div>
        {subtitle && (
          <div className="text-sm text-muted-foreground truncate">{subtitle}</div>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDeleteClick}
        className="absolute right-2 top-1/2 -translate-y-1/2 transition-opacity"
        aria-label={pendingDelete ? "Confirm delete" : "Delete"}
      >
        {pendingDelete ? (
          <Check className="h-4 w-4 text-destructive" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}

export default SidebarListItem;
