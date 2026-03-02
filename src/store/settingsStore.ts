import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Settings } from '../types';

const SETTINGS_STORAGE_KEY = 'linguachat_settings';

export const DEFAULT_SETTINGS: Settings = {
  apiKey: '',
  apiBaseUrl: 'https://api.openai.com/v1',
  nativeLanguage: 'English',
  targetLanguage: 'Danish',
  model: 'gpt-5-mini',
};

interface SettingsState {
  settings: Settings;
  updateSettings: (settings: Settings) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: DEFAULT_SETTINGS,
      updateSettings: (settings) => set({ settings }),
    }),
    {
      name: SETTINGS_STORAGE_KEY,
    }
  )
);
