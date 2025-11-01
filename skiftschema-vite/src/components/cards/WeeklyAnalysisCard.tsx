import { Card } from '@/components/ui/Card';
import { useShiftStore } from '@/stores/useShiftStore';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { WEEKDAYS } from '@/lib/constants';
import { getShiftDuration } from '@/lib/calculations';

export function WeeklyAnalysisCard() {
  const { shifts } = useShiftStore();
  const settings = useSettingsStore();

  const weeklyData = WEEKDAYS.map((dayName, dayIdx) => {
    let coverage = 0;

    shifts.forEach((shift) => {
      shift.weekPatterns.forEach((pattern) => {
        if (pattern.includes(dayIdx)) {
          const hours = getShiftDuration(shift.startTime, shift.endTime, shift.id);
          coverage += hours;
        }
      });
    });

    const required =
      dayIdx >= 1 && dayIdx <= 5
        ? settings.coverageMF
        : dayIdx === 6
        ? settings.coverageSat
        : settings.coverageSun;

    const status = coverage >= required ? '●' : coverage >= required * 0.8 ? '◐' : '○';

    return { dayName, coverage, required, status };
  });

  return (
    <Card title="Veckoöversikt" collapsible defaultOpen>
      <div className="space-y-2 text-sm">
        {weeklyData.map((day) => (
          <div key={day.dayName} className="flex justify-between text-gray-900">
            <span>{day.dayName}</span>
            <span className="font-medium">
              {day.coverage.toFixed(1)}/{day.required}h{' '}
              <span className="font-bold">{day.status}</span>
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
