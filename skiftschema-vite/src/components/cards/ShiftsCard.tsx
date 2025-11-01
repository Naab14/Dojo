import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { useShiftStore } from '@/stores/useShiftStore';
import { useUIStore } from '@/stores/useUIStore';
import { getShiftDuration } from '@/lib/calculations';
import { Trash2 } from 'lucide-react';

export function ShiftsCard() {
  const { shifts, deleteShift, shiftHoursOverride } = useShiftStore();
  const { openWizard, shiftFilter, setShiftFilter, addToast } = useUIStore();

  const filteredShifts = shifts.filter((shift) => {
    if (shiftFilter === 'all') return true;
    const startHour = parseInt(shift.startTime.split(':')[0]);
    if (shiftFilter === 'dag') return startHour >= 6 && startHour < 14;
    if (shiftFilter === 'kvall') return startHour >= 14 && startHour < 22;
    if (shiftFilter === 'natt') return startHour >= 22 || startHour < 6;
    return true;
  });

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Ta bort "${name}"?`)) {
      deleteShift(id);
      addToast('Skift borttaget', 'success');
    }
  };

  return (
    <Card title="Aktiva Skift" collapsible defaultOpen>
      <div className="space-y-3">
        <Select
          options={[
            { value: 'all', label: 'Alla skift' },
            { value: 'dag', label: 'Dag (06:00-18:00)' },
            { value: 'kvall', label: 'Kväll (14:00-23:00)' },
            { value: 'natt', label: 'Natt (22:00-08:00)' },
          ]}
          value={shiftFilter}
          onChange={(e) => setShiftFilter(e.target.value as any)}
        />

        <div className="space-y-2">
          {filteredShifts.map((shift) => {
            const hours = getShiftDuration(
              shift.startTime,
              shift.endTime,
              shift.id,
              shiftHoursOverride
            );

            return (
              <motion.div
                key={shift.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                whileHover={{ scale: 1.01 }}
                onClick={() => openWizard(shift.id)}
                className="p-2 bg-gray-50 rounded border border-gray-300 cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded shift-color-${shift.color} border`}
                    />
                    <span className="text-gray-900 font-medium text-sm">
                      {shift.name}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(shift.id, shift.name);
                    }}
                    className="text-gray-600 hover:text-gray-900 p-1"
                    aria-label="Ta bort skift"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-gray-600 text-xs mt-1">
                  {shift.startTime}-{shift.endTime}{' '}
                  <span className="font-semibold">({hours.toFixed(1)}h)</span>
                </div>
              </motion.div>
            );
          })}

          {filteredShifts.length === 0 && (
            <div className="text-center py-4 text-sm text-gray-500">
              Inga skift att visa
            </div>
          )}
        </div>

        <Button onClick={() => openWizard()} className="w-full">
          Lägg till skift
        </Button>
      </div>
    </Card>
  );
}
