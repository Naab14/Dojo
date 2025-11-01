import { Card } from '@/components/ui/Card';
import { useShiftStore } from '@/stores/useShiftStore';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { calculateTotalFTE, calculateUtilization, formatCurrency } from '@/lib/calculations';

export function KPICard() {
  const { shifts } = useShiftStore();
  const { totalFTE, fteCost } = useSettingsStore();

  const totalFTEUsed = calculateTotalFTE(shifts);
  const utilization = calculateUtilization(totalFTEUsed, totalFTE);
  const totalCost = totalFTEUsed * fteCost;

  return (
    <Card title="Översikt" collapsible defaultOpen>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">FTE:</span>
          <span className="text-gray-900 font-bold">
            {totalFTEUsed.toFixed(1)}/{totalFTE}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Utnyttjande:</span>
          <span className="font-bold text-gray-900">{utilization.toFixed(0)}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Kostnad:</span>
          <span className="font-bold text-gray-900">{formatCurrency(totalCost)}</span>
        </div>
      </div>
    </Card>
  );
}
