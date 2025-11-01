import { create } from 'zustand';
import { Shift } from '@/lib/types';

interface ShiftStore {
  shifts: Shift[];
  shiftHoursOverride: Record<number, number>;
  addShift: (shift: Shift) => void;
  updateShift: (id: number, shift: Partial<Shift>) => void;
  deleteShift: (id: number) => void;
  setShifts: (shifts: Shift[]) => void;
  setShiftHoursOverride: (id: number, hours: number) => void;
  clearShiftHoursOverride: (id: number) => void;
}

export const useShiftStore = create<ShiftStore>((set) => ({
  shifts: [],
  shiftHoursOverride: {},

  addShift: (shift) =>
    set((state) => ({
      shifts: [...state.shifts, shift],
    })),

  updateShift: (id, updatedShift) =>
    set((state) => ({
      shifts: state.shifts.map((shift) =>
        shift.id === id ? { ...shift, ...updatedShift } : shift
      ),
    })),

  deleteShift: (id) =>
    set((state) => ({
      shifts: state.shifts.filter((shift) => shift.id !== id),
      shiftHoursOverride: Object.fromEntries(
        Object.entries(state.shiftHoursOverride).filter(([key]) => Number(key) !== id)
      ),
    })),

  setShifts: (shifts) => set({ shifts }),

  setShiftHoursOverride: (id, hours) =>
    set((state) => ({
      shiftHoursOverride: { ...state.shiftHoursOverride, [id]: hours },
    })),

  clearShiftHoursOverride: (id) =>
    set((state) => {
      const newOverrides = { ...state.shiftHoursOverride };
      delete newOverrides[id];
      return { shiftHoursOverride: newOverrides };
    }),
}));
