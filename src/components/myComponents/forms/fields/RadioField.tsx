import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/shadcn/radio-group';
import { Label } from '@/components/shadcn/label';

export interface RadioFieldProps {
  label?: string;
  helpText?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  options?: string[];
  className?: string;
  id?: string;
}

export function RadioField({
  label,
  helpText,
  value,
  onChange,
  disabled = false,
  required = false,
  options = [],
  className,
  id,
}: RadioFieldProps) {
  const groupId = id || `radio-group-${React.useId()}`;
  const helpTextId = helpText ? `${groupId}-help` : undefined;

  return (
    <div className={`space-y-3 ${className || ''}`} role="none">
      {label && (
        <Label id={`${groupId}-label`}>
          {label}
          {required && <span className="text-destructive ml-1" aria-label="required">*</span>}
        </Label>
      )}
      <RadioGroup
        value={value}
        onValueChange={onChange}
        disabled={disabled}
        required={required}
        aria-labelledby={label ? `${groupId}-label` : undefined}
        aria-describedby={helpTextId}
      >
        {options.map((option, index) => {
          const itemId = `${groupId}-item-${index}`;
          return (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={itemId} />
              <Label htmlFor={itemId} className="cursor-pointer font-normal">
                {option}
              </Label>
            </div>
          );
        })}
      </RadioGroup>
      {helpText && (
        <p id={helpTextId} className="text-xs text-muted-foreground" role="note">
          {helpText}
        </p>
      )}
    </div>
  );
}
