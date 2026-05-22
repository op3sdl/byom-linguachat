import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SavedExplanation } from "../types";

interface ExplanationDetailSheetProps {
  explanation: SavedExplanation | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function ExplanationDetailSheet({
  explanation,
  open,
  onOpenChange,
}: ExplanationDetailSheetProps) {
  if (!explanation) return null;

  const title =
    explanation.selection.length > 50
      ? explanation.selection.substring(0, 50) + "..."
      : explanation.selection;

  const formattedDate = new Date(explanation.savedAt).toLocaleDateString();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetPortal>
        <SheetOverlay className="bg-black/0" />
        <DialogPrimitive.Content
          className={cn(
            "fixed z-50 bg-background shadow-lg transition ease-in-out",
            "data-[state=closed]:duration-300 data-[state=open]:duration-500",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "inset-y-0 right-0 h-full w-full border-l",
            "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
            "sm:max-w-[400px] p-0 flex flex-col"
          )}
        >
          <DialogPrimitive.Close className="absolute right-3 top-4 rounded-sm p-1 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>

          <div className="flex-shrink-0 px-6 py-4 border-b">
            <SheetHeader>
              <SheetTitle className="truncate pr-8">{title}</SheetTitle>
              <SheetDescription className="sr-only">
                View explanation details
              </SheetDescription>
              <p className="text-sm text-muted-foreground">{formattedDate}</p>
            </SheetHeader>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            <blockquote className="border-l-4 border-border pl-4 text-lg font-medium text-foreground">
              {explanation.selection}
            </blockquote>

            <div>
              <h2 className="font-semibold text-base mb-2">Translation</h2>
              <div className="text-sm text-foreground prose prose-sm max-w-none">
                <ReactMarkdown>{explanation.explanation.translation}</ReactMarkdown>
              </div>
            </div>

            <div>
              <h2 className="font-semibold text-base mb-2">Explanation</h2>
              <div className="text-sm text-foreground prose prose-sm max-w-none">
                <ReactMarkdown>{explanation.explanation.explanation}</ReactMarkdown>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 border-t px-6 py-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          </div>
        </DialogPrimitive.Content>
      </SheetPortal>
    </Sheet>
  );
}

export default ExplanationDetailSheet;
