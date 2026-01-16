import React from 'react';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';

export interface TextFieldProps {
  label?: string;
  placeholder?: string;
  required?: boolean;
  helpText?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  regexPattern?: string;
  className?: string;
  id?: string;
  type?: string;
}

export function TextField({
  label,
  placeholder = "Enter text...",
  required = false,
  helpText,
  value,
  onChange,
  disabled = false,
  regexPattern,
  className,
  id,
  type = "text",
}: TextFieldProps) {
  const fieldId = id || `text-field-${React.useId()}`;
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
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        required={required}
        pattern={regexPattern}
        aria-describedby={helpTextId}
        aria-required={required}
        aria-invalid={regexPattern && value ? !new RegExp(regexPattern).test(value) : undefined}
      />
      {helpText && (
        <p id={helpTextId} className="text-xs text-muted-foreground" role="note">
          {helpText}
        </p>
      )}
      {regexPattern && (
        <p className="text-xs text-muted-foreground font-mono" role="note">
          Pattern: {regexPattern}
        </p>
      )}
    </div>
  );
}
