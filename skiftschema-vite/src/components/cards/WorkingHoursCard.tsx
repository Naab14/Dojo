import { Card } from '@/components/ui/Card';
import { useShiftStore } from '@/stores/useShiftStore';
import { useUIStore } from '@/stores/useUIStore';
import { calculatePeriodHours, getStartOfWeek, getEndOfWeek } from '@/lib/calculations';

export function WorkingHoursCard() {
  const { shifts, shiftHoursOverride } = useShiftStore();
  const { currentYear, currentMonth } = useUIStore();

  // Weekly hours
  const now = new Date(currentYear, currentMonth, 1);
  const startOfWeek = getStartOfWeek(now);
  const endOfWeek = getEndOfWeek(now);
  const weekHours = calculatePeriodHours(shifts, startOfWeek, endOfWeek, shiftHoursOverride);

  // Monthly hours
  const startOfMonth = new Date(currentYear, currentMonth, 1);
  const endOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const monthHours = calculatePeriodHours(shifts, startOfMonth, endOfMonth, shiftHoursOverride);

  // Yearly hours
  const startOfYear = new Date(currentYear, 0, 1);
  const endOfYear = new Date(currentYear, 11, 31);
  const yearHours = calculatePeriodHours(shifts, startOfYear, endOfYear, shiftHoursOverride);

  return (
    <Card title="Arbetstid Sammanfattning" collapsible defaultOpen>
      <div className="space-y-3">
        <div className="flex justify-between items-baseline">
          <span className="text-sm text-gray-600">Denna Vecka:</span>
          <span className="text-lg font-bold text-gray-900">{weekHours.toFixed(0)}h</span>
        </div>

        <div className="flex justify-between items-baseline">
          <span className="text-sm text-gray-600">Denna Månad:</span>
          <span className="text-lg font-bold text-gray-900">{monthHours.toFixed(0)}h</span>
        </div>

        <div className="flex justify-between items-baseline">
          <span className="text-sm text-gray-600">År {currentYear}:</span>
          <span className="text-lg font-bold text-gray-900">{yearHours.toFixed(0)}h</span>
        </div>

        <p className="text-xs text-gray-500 mt-2">
          Timmar räknas per skift × FTE
        </p>
      </div>
    </Card>
  );
}
