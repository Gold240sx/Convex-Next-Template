import React from 'react';
import { Textarea } from '@/components/shadcn/textarea';
import { Label } from '@/components/shadcn/label';
import { cn } from '@/lib/utils';

export interface TextAreaFieldProps {
  label?: string;
  placeholder?: string;
  required?: boolean;
  helpText?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  rows?: number;
  resizable?: boolean;
  className?: string;
  id?: string;
}

export function TextAreaField({
  label,
  placeholder = "Enter your message...",
  required = false,
  helpText,
  value,
  onChange,
  disabled = false,
  rows = 4,
  resizable = true,
  className,
  id,
}: TextAreaFieldProps) {
  const fieldId = id || `textarea-field-${React.useId()}`;
  const helpTextId = helpText ? `${fieldId}-help` : undefined;

  return (
    <div className={`space-y-2 ${className || ''}`}>
      {label && (
        <Label htmlFor={fieldId}>
          {label}
          {required && <span className="text-destructive ml-1" aria-label="required">*</span>}
        </Label>
      )}
      <Textarea
        id={fieldId}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        required={required}
        rows={rows}
        className={cn(!resizable && "resize-none")}
        aria-describedby={helpTextId}
        aria-required={required}
      />
      {helpText && (
        <p id={helpTextId} className="text-xs text-muted-foreground" role="note">
          {helpText}
        </p>
      )}
    </div>
  );
}
