import { Card } from '@/components/ui/Card';
import { useShiftStore } from '@/stores/useShiftStore';
import { useSettingsStore } from '@/stores/useSettingsStore';

export function CostAnalysisCard() {
  const { shifts } = useShiftStore();
  const { fteCost } = useSettingsStore();

  return (
    <Card title="Skiftkostnader" collapsible defaultOpen>
      <div className="space-y-2 text-sm">
        {shifts.map((shift) => {
          const totalFTE = shift.fte * shift.numTeams;
          const cost = ((totalFTE * fteCost) / 1000).toFixed(0);

          return (
            <div key={shift.id} className="flex justify-between text-gray-900">
              <span>{shift.name}</span>
              <span className="font-medium">{cost}k kr</span>
            </div>
          );
        })}

        {shifts.length === 0 && (
          <div className="text-center py-2 text-gray-500">Inga skift</div>
        )}
      </div>
    </Card>
  );
}
