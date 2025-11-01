import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useUIStore } from '@/stores/useUIStore';
import { useShiftStore } from '@/stores/useShiftStore';
import { useState, useEffect } from 'react';
import { WizardStep1 } from './WizardStep1';
import { WizardStep2 } from './WizardStep2';
import { WizardStep3 } from './WizardStep3';
import { Shift } from '@/lib/types';
import { clsx } from 'clsx';

export function ShiftWizard() {
  const { showWizard, closeWizard, wizardStep, setWizardStep, editingShiftId, addToast } =
    useUIStore();
  const { shifts, addShift, updateShift } = useShiftStore();

  const [template, setTemplate] = useState<string>('custom');
  const [formData, setFormData] = useState<Partial<Shift>>({
    name: '',
    startTime: '06:00',
    endTime: '14:00',
    rotationWeeks: 1,
    numTeams: 1,
    fte: 5,
    color: 1,
    weekPatterns: [[1, 2, 3, 4, 5]], // Default Mon-Fri
  });

  // Load shift data if editing
  useEffect(() => {
    if (editingShiftId && showWizard) {
      const shift = shifts.find((s) => s.id === editingShiftId);
      if (shift) {
        setFormData(shift);
      }
    } else if (showWizard) {
      // Reset form for new shift
      setFormData({
        name: '',
        startTime: '06:00',
        endTime: '14:00',
        rotationWeeks: 1,
        numTeams: 1,
        fte: 5,
        color: 1,
        weekPatterns: [[1, 2, 3, 4, 5]],
      });
      setTemplate('custom');
    }
  }, [editingShiftId, showWizard, shifts]);

  const handleNext = () => {
    if (wizardStep < 3) {
      setWizardStep(wizardStep + 1);
    }
  };

  const handleBack = () => {
    if (wizardStep > 1) {
      setWizardStep(wizardStep - 1);
    }
  };

  const handleFinish = () => {
    // Validate
    if (!formData.name || !formData.weekPatterns || formData.weekPatterns.every((p) => p.length === 0)) {
      addToast('Fyll i alla obligatoriska fält', 'error');
      return;
    }

    if (editingShiftId) {
      updateShift(editingShiftId, formData);
      addToast('Skift uppdaterat', 'success');
    } else {
      const newShift: Shift = {
        id: Date.now(),
        name: formData.name!,
        startTime: formData.startTime!,
        endTime: formData.endTime!,
        rotationWeeks: formData.rotationWeeks!,
        numTeams: formData.numTeams!,
        weekPatterns: formData.weekPatterns!,
        fte: formData.fte!,
        color: formData.color!,
      };
      addShift(newShift);
      addToast('Skift skapat', 'success');
    }

    closeWizard();
  };

  return (
    <Modal
      isOpen={showWizard}
      onClose={closeWizard}
      title={editingShiftId ? 'Redigera skift' : 'Skapa nytt skift'}
      maxWidth="lg"
    >
      {/* Progress indicator */}
      <div className="flex justify-between mb-6">
        <StepIndicator
          step={1}
          active={wizardStep === 1}
          complete={wizardStep > 1}
          label="Typ"
        />
        <StepIndicator
          step={2}
          active={wizardStep === 2}
          complete={wizardStep > 2}
          label="Tider"
        />
        <StepIndicator
          step={3}
          active={wizardStep === 3}
          complete={false}
          label="Bemanning"
        />
      </div>

      {/* Step content */}
      <div className="min-h-[300px]">
        {wizardStep === 1 && (
          <WizardStep1
            template={template}
            setTemplate={setTemplate}
            formData={formData}
            setFormData={setFormData}
          />
        )}
        {wizardStep === 2 && (
          <WizardStep2 formData={formData} setFormData={setFormData} />
        )}
        {wizardStep === 3 && (
          <WizardStep3 formData={formData} setFormData={setFormData} />
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex gap-2 mt-6">
        {wizardStep > 1 && (
          <Button onClick={handleBack} variant="secondary">
            Tillbaka
          </Button>
        )}

        {wizardStep < 3 ? (
          <Button onClick={handleNext} className="flex-1">
            Nästa
          </Button>
        ) : (
          <Button onClick={handleFinish} className="flex-1">
            Slutför
          </Button>
        )}

        <Button onClick={closeWizard} variant="secondary">
          Avbryt
        </Button>
      </div>
    </Modal>
  );
}

interface StepIndicatorProps {
  step: number;
  active: boolean;
  complete: boolean;
  label: string;
}

function StepIndicator({ step, active, complete, label }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={clsx(
          'w-9 h-9 rounded-full flex items-center justify-center font-bold text-base border-2',
          active && 'bg-gray-700 text-white border-gray-900',
          complete && 'bg-gray-900 text-white border-gray-900',
          !active && !complete && 'bg-gray-200 text-gray-600 border-gray-300'
        )}
      >
        {step}
      </div>
      <span className="text-sm font-medium text-gray-900">{label}</span>
    </div>
  );
}
