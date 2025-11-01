import { create } from 'zustand';
import { Toast } from '@/lib/types';

interface UIStore {
  currentYear: number;
  currentMonth: number;
  showWizard: boolean;
  editingShiftId: number | null;
  wizardStep: number;
  toasts: Toast[];
  shiftFilter: 'all' | 'dag' | 'kvall' | 'natt';

  setYear: (year: number) => void;
  setMonth: (month: number) => void;
  nextMonth: () => void;
  previousMonth: () => void;

  openWizard: (shiftId?: number) => void;
  closeWizard: () => void;
  setWizardStep: (step: number) => void;

  addToast: (message: string, type: 'success' | 'error') => void;
  removeToast: (id: number) => void;

  setShiftFilter: (filter: 'all' | 'dag' | 'kvall' | 'natt') => void;
}

let toastId = 0;

export const useUIStore = create<UIStore>((set) => ({
  currentYear: 2026,
  currentMonth: new Date().getMonth(),
  showWizard: false,
  editingShiftId: null,
  wizardStep: 1,
  toasts: [],
  shiftFilter: 'all',

  setYear: (year) => set({ currentYear: year }),

  setMonth: (month) => set({ currentMonth: month }),

  nextMonth: () =>
    set((state) => {
      const newMonth = state.currentMonth + 1;
      if (newMonth > 11) {
        return { currentMonth: 0, currentYear: state.currentYear + 1 };
      }
      return { currentMonth: newMonth };
    }),

  previousMonth: () =>
    set((state) => {
      const newMonth = state.currentMonth - 1;
      if (newMonth < 0) {
        return { currentMonth: 11, currentYear: state.currentYear - 1 };
      }
      return { currentMonth: newMonth };
    }),

  openWizard: (shiftId) =>
    set({
      showWizard: true,
      editingShiftId: shiftId || null,
      wizardStep: 1,
    }),

  closeWizard: () =>
    set({
      showWizard: false,
      editingShiftId: null,
      wizardStep: 1,
    }),

  setWizardStep: (step) => set({ wizardStep: step }),

  addToast: (message, type) =>
    set((state) => {
      const id = toastId++;
      const newToast: Toast = { id, message, type };

      // Auto-remove after 4 seconds
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, 4000);

      return {
        toasts: [...state.toasts, newToast],
      };
    }),

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  setShiftFilter: (filter) => set({ shiftFilter: filter }),
}));
