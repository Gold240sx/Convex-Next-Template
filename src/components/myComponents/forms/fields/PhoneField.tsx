import React from 'react';
import { PhoneNoInput } from '../phone-no-input';
import { Label } from '@/components/shadcn/label';

export interface PhoneFieldProps {
  label?: string;
  helpText?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  id?: string;
}

export function PhoneField({
  label,
  helpText,
  value = '',
  onChange,
  disabled = false,
  required = false,
  className,
  id,
}: PhoneFieldProps) {
  const fieldId = id || `phone-field-${React.useId()}`;
  const helpTextId = helpText ? `${fieldId}-help` : undefined;

  return (
    <div className={`space-y-2 ${className || ''}`}>
      {label && (
        <Label htmlFor={fieldId}>
          {label}
          {required && <span className="text-destructive ml-1" aria-label="required">*</span>}
        </Label>
      )}
      <PhoneNoInput
        phoneNo={value}
        updateFields={(fields) => onChange?.(fields.phoneNo)}
      />
      {helpText && (
        <p id={helpTextId} className="text-xs text-muted-foreground" role="note">
          {helpText}
        </p>
      )}
    </div>
  );
}
