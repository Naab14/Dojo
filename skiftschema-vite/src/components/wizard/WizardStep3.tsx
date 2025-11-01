import { Shift } from '@/lib/types';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { SHIFT_COLORS } from '@/lib/constants';
import { useState, useEffect } from 'react';

interface WizardStep3Props {
  formData: Partial<Shift>;
  setFormData: (data: Partial<Shift>) => void;
}

export function WizardStep3({ formData, setFormData }: WizardStep3Props) {
  const [weekPatterns, setWeekPatterns] = useState<number[][]>(
    formData.weekPatterns || [[1, 2, 3, 4, 5]]
  );

  const rotationWeeks = formData.rotationWeeks || 1;

  // Initialize week patterns when rotation weeks changes
  useEffect(() => {
    if (weekPatterns.length !== rotationWeeks) {
      const newPatterns = Array.from({ length: rotationWeeks }, (_, i) =>
        weekPatterns[i] || [1, 2, 3, 4, 5]
      );
      setWeekPatterns(newPatterns);
      setFormData({ ...formData, weekPatterns: newPatterns });
    }
  }, [rotationWeeks]);

  const handleDayToggle = (weekIdx: number, day: number) => {
    const newPatterns = [...weekPatterns];
    if (!newPatterns[weekIdx]) {
      newPatterns[weekIdx] = [];
    }

    if (newPatterns[weekIdx].includes(day)) {
      newPatterns[weekIdx] = newPatterns[weekIdx].filter((d) => d !== day);
    } else {
      newPatterns[weekIdx] = [...newPatterns[weekIdx], day].sort((a, b) => a - b);
    }

    setWeekPatterns(newPatterns);
    setFormData({ ...formData, weekPatterns: newPatterns });
  };

  const days = [
    { value: 1, label: 'Mån' },
    { value: 2, label: 'Tis' },
    { value: 3, label: 'Ons' },
    { value: 4, label: 'Tor' },
    { value: 5, label: 'Fre' },
    { value: 6, label: 'Lör' },
    { value: 0, label: 'Sön' },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <Input
          label="Rotationsveckor"
          type="number"
          value={formData.rotationWeeks || 1}
          onChange={(e) =>
            setFormData({ ...formData, rotationWeeks: Number(e.target.value) })
          }
          min={1}
          max={8}
        />

        <Input
          label="Antal team"
          type="number"
          value={formData.numTeams || 1}
          onChange={(e) =>
            setFormData({ ...formData, numTeams: Number(e.target.value) })
          }
          min={1}
          max={6}
        />

        <Input
          label="FTE/team"
          type="number"
          value={formData.fte || 5}
          onChange={(e) =>
            setFormData({ ...formData, fte: Number(e.target.value) })
          }
          min={0.5}
          max={50}
          step={0.5}
        />
      </div>

      {/* Week patterns */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-900">
          Arbetsdagar
        </label>

        {Array.from({ length: rotationWeeks }, (_, weekIdx) => (
          <div
            key={weekIdx}
            className="p-3 bg-gray-100 rounded border border-gray-300"
          >
            <div className="text-sm font-medium text-gray-900 mb-2">
              Vecka {weekIdx + 1}
            </div>

            <div className="flex gap-2 flex-wrap">
              {days.map((day) => (
                <label
                  key={day.value}
                  className="flex items-center gap-1 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={weekPatterns[weekIdx]?.includes(day.value) || false}
                    onChange={() => handleDayToggle(weekIdx, day.value)}
                    className="w-5 h-5"
                  />
                  <span className="text-sm">{day.label}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Color selection */}
      <Select
        label="Färg"
        value={formData.color || 1}
        onChange={(e) => setFormData({ ...formData, color: Number(e.target.value) })}
        options={SHIFT_COLORS.map((c) => ({
          value: c.id,
          label: c.name,
        }))}
      />

      {/* Color preview */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Förhandsvisning:</span>
        <div
          className={`px-4 py-2 rounded border font-medium shift-color-${formData.color || 1}`}
        >
          {formData.name || 'Skiftnamn'}
        </div>
      </div>
    </div>
  );
}
