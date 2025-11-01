import { Card } from '@/components/ui/Card';
import { useShiftStore } from '@/stores/useShiftStore';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { useUIStore } from '@/stores/useUIStore';
import { MONTHS } from '@/lib/constants';
import { calculatePeriodHours } from '@/lib/calculations';

export function YearlyOverviewCard() {
  const { shifts, shiftHoursOverride } = useShiftStore();
  const { fteCost } = useSettingsStore();
  const { currentYear } = useUIStore();

  const monthlyData = MONTHS.map((month, monthIdx) => {
    const daysInMonth = new Date(currentYear, monthIdx + 1, 0).getDate();
    const startOfMonth = new Date(currentYear, monthIdx, 1);
    const endOfMonth = new Date(currentYear, monthIdx + 1, 0);

    // Count work days (Mon-Fri)
    let workDays = 0;
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, monthIdx, day);
      const dayOfWeek = date.getDay();
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        workDays++;
      }
    }

    const hours = calculatePeriodHours(shifts, startOfMonth, endOfMonth, shiftHoursOverride);
    const avgFTE = shifts.reduce((sum, s) => sum + s.fte * s.numTeams, 0);
    const cost = ((avgFTE * fteCost) / 12 / 1000000).toFixed(2);

    return { month, workDays, hours, avgFTE, cost };
  });

  const totalWorkDays = monthlyData.reduce((sum, m) => sum + m.workDays, 0);
  const totalHours = monthlyData.reduce((sum, m) => sum + m.hours, 0);
  const avgYearFTE = monthlyData.reduce((sum, m) => sum + m.avgFTE, 0) / 12;
  const totalCost = ((avgYearFTE * fteCost) / 1000000).toFixed(1);

  return (
    <Card title={`Årlig Översikt ${currentYear}`} collapsible defaultOpen>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-2 py-2 text-left text-xs">Månad</th>
              <th className="px-2 py-2 text-right text-xs">Dagar</th>
              <th className="px-2 py-2 text-right text-xs">Timmar</th>
              <th className="px-2 py-2 text-right text-xs">FTE</th>
              <th className="px-2 py-2 text-right text-xs">Kostnad</th>
            </tr>
          </thead>
          <tbody className="text-gray-900">
            {monthlyData.map((data, idx) => (
              <tr key={idx} className="border-b border-gray-300">
                <td className="px-2 py-1 text-xs">{data.month}</td>
                <td className="px-2 py-1 text-right text-xs">{data.workDays}</td>
                <td className="px-2 py-1 text-right text-xs">{data.hours.toFixed(0)}</td>
                <td className="px-2 py-1 text-right text-xs">{data.avgFTE.toFixed(1)}</td>
                <td className="px-2 py-1 text-right text-xs">{data.cost}M</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-200 font-bold text-gray-900">
            <tr>
              <td className="px-2 py-2 text-xs">TOTALT</td>
              <td className="px-2 py-2 text-right text-xs">{totalWorkDays}</td>
              <td className="px-2 py-2 text-right text-xs">{totalHours.toFixed(0)}</td>
              <td className="px-2 py-2 text-right text-xs">{avgYearFTE.toFixed(1)}</td>
              <td className="px-2 py-2 text-right text-xs">{totalCost}M</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="mt-3 text-xs text-gray-600 space-y-1">
        <p>
          <strong>Svenska helgdagar 2026:</strong>
        </p>
        <p>
          Nyår (1 jan), Påsk (3-6 apr), Första Maj (1 maj), Kristi Himmelfärd (14 maj),
          Nationaldagen (6 jun), Midsommar (19-20 jun), Alla Helgons Dag (31 okt), Jul (24-26
          dec), Nyårsafton (31 dec)
        </p>
      </div>
    </Card>
  );
}
