import { create } from 'zustand';
import { Settings } from '@/lib/types';

interface SettingsStore extends Settings {
  updateSettings: (settings: Partial<Settings>) => void;
  resetSettings: () => void;
}

const defaultSettings: Settings = {
  totalFTE: 44,
  fteCost: 650000,
  hoursPerDay: 8,
  coverageMF: 24,
  coverageSat: 12,
  coverageSun: 0,
};

export const useSettingsStore = create<SettingsStore>((set) => ({
  ...defaultSettings,

  updateSettings: (newSettings) =>
    set((state) => ({
      ...state,
      ...newSettings,
    })),

  resetSettings: () => set(defaultSettings),
}));
