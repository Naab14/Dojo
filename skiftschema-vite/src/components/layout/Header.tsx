import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { useUIStore } from '@/stores/useUIStore';
import { useShiftStore } from '@/stores/useShiftStore';
import { Shift } from '@/lib/types';

export function Header() {
  const { currentYear, setYear, addToast, previousMonth, nextMonth } = useUIStore();
  const { shifts } = useShiftStore();

  const handleSave = () => {
    // Data is auto-saved via useLocalStorage hook
    addToast('Schema sparat', 'success');
  };

  const handleExport = () => {
    let csv = 'Skiftnamn,Start,Slut,Veckor,Team,FTE/team,Total FTE\n';
    shifts.forEach((shift: Shift) => {
      csv += `${shift.name},${shift.startTime},${shift.endTime},${shift.rotationWeeks},${shift.numTeams},${shift.fte},${shift.fte * shift.numTeams}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `skiftschema-${currentYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('Schema exporterat', 'success');
  };

  return (
    <header className="bg-gray-50 rounded shadow-sm p-4 mb-3 border border-gray-300">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Skiftschema Analysator</h1>

          <Select
            options={[
              { value: 2024, label: '2024' },
              { value: 2025, label: '2025' },
              { value: 2026, label: '2026' },
              { value: 2027, label: '2027' },
            ]}
            value={currentYear}
            onChange={(e) => setYear(Number(e.target.value))}
            className="font-medium"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button onClick={previousMonth} variant="secondary" size="md">
            ←
          </Button>
          <Button onClick={nextMonth} variant="secondary" size="md">
            →
          </Button>
          <Button onClick={handleSave}>Spara</Button>
          <Button onClick={handleExport}>Exportera CSV</Button>
        </div>
      </div>
    </header>
  );
}
