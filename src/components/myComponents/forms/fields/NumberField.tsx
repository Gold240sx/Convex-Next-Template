import React from 'react';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';

export interface NumberFieldProps {
  label?: string;
  placeholder?: string;
  required?: boolean;
  helpText?: string;
  value?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  id?: string;
}

export function NumberField({
  label,
  placeholder = "Enter a number...",
  required = false,
  helpText,
  value,
  onChange,
  disabled = false,
  min,
  max,
  step = 1,
  className,
  id,
}: NumberFieldProps) {
  const fieldId = id || `number-field-${React.useId()}`;
  const helpTextId = helpText ? `${fieldId}-help` : undefined;

  return (
    <div className={`space-y-2 ${className || ''}`}>
      {label && (
        <Label htmlFor={fieldId}>
          {label}
          {required && <span className="text-destructive ml-1" aria-label="required">*</span>}
        </Label>
      )}
      <Input
        id={fieldId}
        type="number"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(parseFloat(e.target.value))}
        disabled={disabled}
        required={required}
        min={min}
        max={max}
        step={step}
        aria-describedby={helpTextId}
        aria-required={required}
        aria-valuemin={min}
        aria-valuemax={max}
      />
      {helpText && (
        <p id={helpTextId} className="text-xs text-muted-foreground" role="note">
          {helpText}
        </p>
      )}
    </div>
  );
}
