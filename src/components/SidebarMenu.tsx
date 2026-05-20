import { Link } from "react-router-dom";
import { MessageSquare, BookOpen, Settings } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface SidebarMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const navItems = [
  { to: "/chats", label: "Chats", Icon: MessageSquare },
  { to: "/explanations", label: "Explanations", Icon: BookOpen },
  { to: "/settings", label: "Settings", Icon: Settings },
];

function SidebarMenu({ open, onOpenChange }: SidebarMenuProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-64 p-0">
        <SheetHeader className="px-6 py-4 border-b border-border">
          <SheetTitle>llmingo</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col py-2">
          {navItems.map(({ to, label, Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => onOpenChange(false)}
              className="flex items-center gap-3 px-6 py-3 text-sm font-medium text-foreground hover:bg-accent transition-colors"
            >
              <Icon className="h-4 w-4 text-muted-foreground" />
              {label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export default SidebarMenu;
