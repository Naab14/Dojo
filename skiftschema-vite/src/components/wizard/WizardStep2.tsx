import { Shift } from '@/lib/types';
import { Input } from '@/components/ui/Input';
import { getShiftDuration } from '@/lib/calculations';
import { useState } from 'react';

interface WizardStep2Props {
  formData: Partial<Shift>;
  setFormData: (data: Partial<Shift>) => void;
}

export function WizardStep2({ formData, setFormData }: WizardStep2Props) {
  const [useManualHours, setUseManualHours] = useState(false);
  const [manualHours, setManualHours] = useState(8);

  const calculatedHours = getShiftDuration(
    formData.startTime || '06:00',
    formData.endTime || '14:00'
  );

  return (
    <div className="space-y-4">
      <Input
        label="Skiftnamn"
        type="text"
        value={formData.name || ''}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="t.ex. Morgonpass"
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Start (HH:MM)"
          type="time"
          value={formData.startTime || '06:00'}
          onChange={(e) =>
            setFormData({ ...formData, startTime: e.target.value })
          }
        />

        <Input
          label="Slut (HH:MM)"
          type="time"
          value={formData.endTime || '14:00'}
          onChange={(e) =>
            setFormData({ ...formData, endTime: e.target.value })
          }
        />
      </div>

      {/* Calculated hours display */}
      <div className="p-3 bg-gray-100 rounded border border-gray-300">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-900">
            Beräknade timmar:
          </span>
          <span className="text-lg font-bold text-gray-900">
            {calculatedHours.toFixed(1)}h
          </span>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={useManualHours}
            onChange={(e) => setUseManualHours(e.target.checked)}
            className="w-5 h-5"
          />
          <span className="text-sm">Anpassa timmar manuellt</span>
        </label>

        {useManualHours && (
          <div className="mt-2">
            <Input
              label="Timmar per skift"
              type="number"
              value={manualHours}
              onChange={(e) => setManualHours(Number(e.target.value))}
              min={0.5}
              max={24}
              step={0.5}
            />
          </div>
        )}
      </div>

      <p className="text-sm text-gray-600">
        Format: 24-timmars (06:00, 14:00, 22:00). Midnattsövergång hanteras
        automatiskt.
      </p>
    </div>
  );
}
