import { create } from 'zustand';
import type { Explanation } from '../types';

interface ExplanationsState {
  explanationSelection: string | null;
  explanationSelectionContext: string | null;
  explanation: Explanation | null;
  isLoading: boolean;
  isDialogOpen: boolean;
  error: string | null;
  setSelection: (selection: string, context: string) => void;
  setExplanation: (explanation: Explanation) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  openDialog: () => void;
  closeDialog: () => void;
  reset: () => void;
}

export const useExplanationsStore = create<ExplanationsState>((set) => ({
  explanationSelection: null,
  explanationSelectionContext: null,
  explanation: null,
  isLoading: false,
  isDialogOpen: false,
  error: null,
  setSelection: (selection, context) =>
    set({ explanationSelection: selection, explanationSelectionContext: context }),
  setExplanation: (explanation) => set({ explanation }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  openDialog: () => set({ isDialogOpen: true }),
  closeDialog: () =>
    set({
      isDialogOpen: false,
      explanationSelection: null,
      explanationSelectionContext: null,
      explanation: null,
      error: null,
      isLoading: false,
    }),
  reset: () =>
    set({
      explanationSelection: null,
      explanationSelectionContext: null,
      explanation: null,
      isLoading: false,
      isDialogOpen: false,
      error: null,
    }),
}));
