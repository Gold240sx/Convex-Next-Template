import React from 'react';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';
import { Calendar } from 'lucide-react';

export interface DateFieldProps {
  label?: string;
  helpText?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  min?: string;
  max?: string;
  className?: string;
  id?: string;
}

export function DateField({
  label,
  helpText,
  value,
  onChange,
  disabled = false,
  required = false,
  min,
  max,
  className,
  id,
}: DateFieldProps) {
  const fieldId = id || `date-field-${React.useId()}`;
  const helpTextId = helpText ? `${fieldId}-help` : undefined;

  return (
    <div className={`space-y-2 ${className || ''}`}>
      {label && (
        <Label htmlFor={fieldId}>
          {label}
          {required && <span className="text-destructive ml-1" aria-label="required">*</span>}
        </Label>
      )}
      <div className="relative">
        <Input
          id={fieldId}
          type="date"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          required={required}
          min={min}
          max={max}
          aria-describedby={helpTextId}
          aria-required={required}
        />
        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
      </div>
      {helpText && (
        <p id={helpTextId} className="text-xs text-muted-foreground" role="note">
          {helpText}
        </p>
      )}
    </div>
  );
}
