import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Explanation, SavedExplanation } from '../types';

const SAVED_EXPLANATIONS_STORAGE_KEY = 'linguachat_saved_explanations';

interface ExplanationsState {
  explanationSelection: string | null;
  explanationSelectionContext: string | null;
  explanation: Explanation | null;
  isLoading: boolean;
  isDialogOpen: boolean;
  error: string | null;
  savedExplanations: SavedExplanation[];
  setSelection: (selection: string, context: string) => void;
  setExplanation: (explanation: Explanation) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  openDialog: () => void;
  closeDialog: () => void;
  reset: () => void;
  saveExplanation: () => void;
  deleteExplanation: (id: string) => void;
}

export const useExplanationsStore = create<ExplanationsState>()(
  persist(
    (set, get) => ({
      explanationSelection: null,
      explanationSelectionContext: null,
      explanation: null,
      isLoading: false,
      isDialogOpen: false,
      error: null,
      savedExplanations: [],
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
      saveExplanation: () => {
        const state = get();
        if (!state.explanationSelection || !state.explanation) {
          return;
        }

        const newSavedExplanation: SavedExplanation = {
          id: uuidv4(),
          selection: state.explanationSelection,
          context: state.explanationSelectionContext || '',
          explanation: state.explanation,
          savedAt: new Date().toISOString(),
        };

        set((state) => ({
          savedExplanations: [newSavedExplanation, ...state.savedExplanations],
        }));
      },
      deleteExplanation: (id) => {
        set((state) => ({
          savedExplanations: state.savedExplanations.filter((exp) => exp.id !== id),
        }));
      },
    }),
    {
      name: SAVED_EXPLANATIONS_STORAGE_KEY,
      partialize: (state) => ({ savedExplanations: state.savedExplanations }),
    }
  )
);
