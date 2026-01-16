import React from 'react';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';
import { Link as LinkIcon } from 'lucide-react';

export interface UrlFieldProps {
  label?: string;
  placeholder?: string;
  required?: boolean;
  helpText?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export function UrlField({
  label,
  placeholder = "https://example.com",
  required = false,
  helpText,
  value,
  onChange,
  disabled = false,
  className,
  id,
}: UrlFieldProps) {
  const fieldId = id || `url-field-${React.useId()}`;
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
        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
        <Input
          id={fieldId}
          type="url"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          required={required}
          className="pl-10"
          aria-describedby={helpTextId}
          aria-required={required}
        />
      </div>
      {helpText && (
        <p id={helpTextId} className="text-xs text-muted-foreground" role="note">
          {helpText}
        </p>
      )}
    </div>
  );
}
