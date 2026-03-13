import ReactMarkdown from 'react-markdown';
import { Loader2 } from 'lucide-react';
import { useExplanationsStore } from '../store/explanationsStore';
import type { Explanation } from '../types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

export interface ExplanationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selection: string | null;
  explanation: Explanation | null;
  isLoading?: boolean;
  error?: string | null;
  onSave?: () => void;
}

export function ExplanationDialogContent({
  open,
  onOpenChange,
  selection,
  explanation,
  isLoading = false,
  error = null,
  onSave,
}: ExplanationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-screen h-screen sm:w-full sm:h-auto sm:max-w-lg sm:rounded-lg flex flex-col">
        <DialogHeader>
          <DialogTitle>Explanation</DialogTitle>
          <DialogDescription>
            {selection && `Explanation for "${selection}"`}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-4 py-4">
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            )}

            {error && !isLoading && (
              <div className="text-sm text-destructive">
                {error}
              </div>
            )}

            {explanation && !isLoading && !error && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Translation</h3>
                  <div className="text-sm">
                    <ReactMarkdown>{explanation.translation}</ReactMarkdown>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Explanation</h3>
                  <div className="text-sm">
                    <ReactMarkdown>{explanation.explanation}</ReactMarkdown>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter>
          {onSave && (
            <Button onClick={onSave} variant="default">
              Save
            </Button>
          )}
          <Button onClick={() => onOpenChange(false)} variant={onSave ? "outline" : "default"}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function LiveExplanationDialog() {
  const isDialogOpen = useExplanationsStore((state) => state.isDialogOpen);
  const explanationSelection = useExplanationsStore((state) => state.explanationSelection);
  const explanation = useExplanationsStore((state) => state.explanation);
  const isLoading = useExplanationsStore((state) => state.isLoading);
  const error = useExplanationsStore((state) => state.error);
  const closeDialog = useExplanationsStore((state) => state.closeDialog);
  const saveExplanation = useExplanationsStore((state) => state.saveExplanation);

  return (
    <ExplanationDialogContent
      open={isDialogOpen}
      onOpenChange={(open) => !open && closeDialog()}
      selection={explanationSelection}
      explanation={explanation}
      isLoading={isLoading}
      error={error}
      onSave={saveExplanation}
    />
  );
}

export function ExplanationDialog() {
  return <LiveExplanationDialog />;
}
