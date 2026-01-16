import React from 'react';
import { Slider } from '@/components/shadcn/slider';
import { Label } from '@/components/shadcn/label';

export interface SliderFieldProps {
  label?: string;
  helpText?: string;
  value?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  showValue?: boolean;
  className?: string;
  id?: string;
}

export function SliderField({
  label,
  helpText,
  value = 50,
  onChange,
  disabled = false,
  min = 0,
  max = 100,
  step = 1,
  showValue = true,
  className,
  id,
}: SliderFieldProps) {
  const fieldId = id || `slider-field-${React.useId()}`;
  const helpTextId = helpText ? `${fieldId}-help` : undefined;

  return (
    <div className={`space-y-3 ${className || ''}`}>
      {label && (
        <div className="flex items-center justify-between">
          <Label htmlFor={fieldId}>{label}</Label>
          {showValue && (
            <span className="text-sm font-medium text-muted-foreground" aria-live="polite">
              {value}
            </span>
          )}
        </div>
      )}
      <Slider
        id={fieldId}
        value={[value]}
        onValueChange={(values) => onChange?.(values[0])}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        className="w-full"
        aria-describedby={helpTextId}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
      />
      {helpText && (
        <p id={helpTextId} className="text-xs text-muted-foreground" role="note">
          {helpText}
        </p>
      )}
      <div className="flex justify-between text-xs text-muted-foreground" aria-hidden="true">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
