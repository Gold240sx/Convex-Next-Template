import React from 'react';
import { Checkbox } from '@/components/shadcn/checkbox';
import { Label } from '@/components/shadcn/label';

export interface CheckboxFieldProps {
  label?: string;
  helpText?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  id?: string;
}

export function CheckboxField({
  label,
  helpText,
  checked = false,
  onChange,
  disabled = false,
  required = false,
  className,
  id,
}: CheckboxFieldProps) {
  const fieldId = id || `checkbox-field-${React.useId()}`;
  const helpTextId = helpText ? `${fieldId}-help` : undefined;

  return (
    <div className={`flex items-start space-x-3 ${className || ''}`}>
      <Checkbox
        id={fieldId}
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
        required={required}
        aria-describedby={helpTextId}
        aria-required={required}
      />
      <div className="space-y-1 leading-none">
        {label && (
          <Label htmlFor={fieldId} className="cursor-pointer">
            {label}
            {required && <span className="text-destructive ml-1" aria-label="required">*</span>}
          </Label>
        )}
        {helpText && (
          <p id={helpTextId} className="text-xs text-muted-foreground" role="note">
            {helpText}
          </p>
        )}
      </div>
    </div>
  );
}
