import { useEffect } from 'react';
import { useShiftStore } from '@/stores/useShiftStore';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { useUIStore } from '@/stores/useUIStore';

const STORAGE_KEY = 'skiftschema-data-v2';

interface StoredData {
  shifts: any[];
  shiftHoursOverride: Record<number, number>;
  settings: any;
  currentYear: number;
  currentMonth: number;
}

export function useLocalStorage() {
  const { shifts, shiftHoursOverride, setShifts } = useShiftStore();
  const settings = useSettingsStore();
  const { currentYear, currentMonth, setYear, setMonth } = useUIStore();

  // Load from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return;

        const data: StoredData = JSON.parse(saved);

        // Restore shifts
        if (data.shifts) {
          setShifts(data.shifts);
        }

        // Restore shift hours override
        if (data.shiftHoursOverride) {
          Object.entries(data.shiftHoursOverride).forEach(([id, hours]) => {
            useShiftStore.getState().setShiftHoursOverride(Number(id), hours);
          });
        }

        // Restore settings
        if (data.settings) {
          settings.updateSettings(data.settings);
        }

        // Restore UI state
        if (data.currentYear) {
          setYear(data.currentYear);
        }
        if (data.currentMonth !== undefined) {
          setMonth(data.currentMonth);
        }
      } catch (error) {
        console.error('Error loading from localStorage:', error);
      }
    };

    loadData();
  }, []); // Only run on mount

  // Save to localStorage whenever data changes
  useEffect(() => {
    const saveData = () => {
      try {
        const data: StoredData = {
          shifts,
          shiftHoursOverride,
          settings: {
            totalFTE: settings.totalFTE,
            fteCost: settings.fteCost,
            hoursPerDay: settings.hoursPerDay,
            coverageMF: settings.coverageMF,
            coverageSat: settings.coverageSat,
            coverageSun: settings.coverageSun,
          },
          currentYear,
          currentMonth,
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    };

    saveData();
  }, [shifts, shiftHoursOverride, settings, currentYear, currentMonth]);

  const exportData = () => {
    const data: StoredData = {
      shifts,
      shiftHoursOverride,
      settings: {
        totalFTE: settings.totalFTE,
        fteCost: settings.fteCost,
        hoursPerDay: settings.hoursPerDay,
        coverageMF: settings.coverageMF,
        coverageSat: settings.coverageSat,
        coverageSun: settings.coverageSun,
      },
      currentYear,
      currentMonth,
    };

    return JSON.stringify(data, null, 2);
  };

  const importData = (jsonString: string) => {
    try {
      const data: StoredData = JSON.parse(jsonString);
      setShifts(data.shifts || []);

      if (data.shiftHoursOverride) {
        Object.entries(data.shiftHoursOverride).forEach(([id, hours]) => {
          useShiftStore.getState().setShiftHoursOverride(Number(id), hours);
        });
      }

      if (data.settings) {
        settings.updateSettings(data.settings);
      }

      if (data.currentYear) setYear(data.currentYear);
      if (data.currentMonth !== undefined) setMonth(data.currentMonth);

      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  };

  return { exportData, importData };
}
