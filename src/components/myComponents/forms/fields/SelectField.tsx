import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select';
import { Label } from '@/components/shadcn/label';

export interface SelectFieldProps {
  label?: string;
  placeholder?: string;
  required?: boolean;
  helpText?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  options?: string[];
  className?: string;
  id?: string;
}

export function SelectField({
  label,
  placeholder = "Select an option...",
  required = false,
  helpText,
  value,
  onChange,
  disabled = false,
  options = [],
  className,
  id,
}: SelectFieldProps) {
  const fieldId = id || `select-field-${React.useId()}`;
  const helpTextId = helpText ? `${fieldId}-help` : undefined;

  return (
    <div className={`space-y-2 ${className || ''}`}>
      {label && (
        <Label htmlFor={fieldId}>
          {label}
          {required && <span className="text-destructive ml-1" aria-label="required">*</span>}
        </Label>
      )}
      <Select value={value} onValueChange={onChange} disabled={disabled} required={required}>
        <SelectTrigger id={fieldId} aria-describedby={helpTextId} aria-required={required}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option, index) => (
            <SelectItem key={index} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {helpText && (
        <p id={helpTextId} className="text-xs text-muted-foreground" role="note">
          {helpText}
        </p>
      )}
    </div>
  );
}
