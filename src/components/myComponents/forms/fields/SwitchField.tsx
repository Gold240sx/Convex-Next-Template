import React from 'react';
import { Switch } from '@/components/shadcn/switch';
import { Label } from '@/components/shadcn/label';

export interface SwitchFieldProps {
  label?: string;
  helpText?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export function SwitchField({
  label,
  helpText,
  checked = false,
  onChange,
  disabled = false,
  className,
  id,
}: SwitchFieldProps) {
  const fieldId = id || `switch-field-${React.useId()}`;
  const helpTextId = helpText ? `${fieldId}-help` : undefined;

  return (
    <div className={`flex items-center justify-between space-x-4 ${className || ''}`}>
      <div className="space-y-0.5 flex-1">
        {label && (
          <Label htmlFor={fieldId} className="cursor-pointer">
            {label}
          </Label>
        )}
        {helpText && (
          <p id={helpTextId} className="text-xs text-muted-foreground" role="note">
            {helpText}
          </p>
        )}
      </div>
      <Switch
        id={fieldId}
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
        aria-describedby={helpTextId}
        role="switch"
      />
    </div>
  );
}
