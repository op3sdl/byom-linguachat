import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useExplanationsStore } from "../store/explanationsStore";
import SidebarListItem from "./SidebarListItem";
import ExplanationDetailSheet from "./ExplanationDetailSheet";
import type { SavedExplanation } from "../types";

interface ExplanationsSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function ExplanationsSidebar({ open, onOpenChange }: ExplanationsSidebarProps) {
  const savedExplanations = useExplanationsStore((state) => state.savedExplanations);
  const deleteExplanation = useExplanationsStore((state) => state.deleteExplanation);
  const [selectedExplanation, setSelectedExplanation] = useState<SavedExplanation | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const handleOpenDetail = (explanation: SavedExplanation) => {
    setSelectedExplanation(explanation);
    setDetailOpen(true);
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-[400px] p-0 flex flex-col">
          <div className="flex-shrink-0 px-6 py-4 border-b">
            <SheetHeader>
              <SheetTitle>Explanations</SheetTitle>
              <SheetDescription className="sr-only">
                Browse your saved explanations
              </SheetDescription>
            </SheetHeader>
          </div>

          <div className="flex-1 overflow-y-auto">
            {savedExplanations.length === 0 ? (
              <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                No saved explanations yet
              </div>
            ) : (
              savedExplanations.map((explanation) => (
                <SidebarListItem
                  key={explanation.id}
                  title={explanation.selection}
                  date={explanation.savedAt}
                  subtitle={explanation.explanation.translation}
                  onClick={() => handleOpenDetail(explanation)}
                  onDelete={() => deleteExplanation(explanation.id)}
                />
              ))
            )}
          </div>
        </SheetContent>
      </Sheet>

      <ExplanationDetailSheet
        explanation={selectedExplanation}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </>
  );
}

export default ExplanationsSidebar;
