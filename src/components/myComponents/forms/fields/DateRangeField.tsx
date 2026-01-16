import React from 'react';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';
import { Calendar } from 'lucide-react';

export interface DateRangeValue {
  startDate: string;
  endDate: string;
}

export interface DateRangeFieldProps {
  label?: string;
  helpText?: string;
  value?: DateRangeValue;
  onChange?: (value: DateRangeValue) => void;
  disabled?: boolean;
  required?: boolean;
  allowSameDay?: boolean;
  min?: string;
  max?: string;
  className?: string;
  id?: string;
}

export function DateRangeField({
  label,
  helpText,
  value = { startDate: '', endDate: '' },
  onChange,
  disabled = false,
  required = false,
  allowSameDay = true,
  min,
  max,
  className,
  id,
}: DateRangeFieldProps) {
  const groupId = id || `date-range-${React.useId()}`;
  const startId = `${groupId}-start`;
  const endId = `${groupId}-end`;
  const helpTextId = helpText ? `${groupId}-help` : undefined;

  const handleStartDateChange = (startDate: string) => {
    const newValue = { ...value, startDate };
    
    // If same day not allowed and dates are equal, clear end date
    if (!allowSameDay && startDate === value.endDate) {
      newValue.endDate = '';
    }
    
    // If end date is before start date, clear it
    if (value.endDate && startDate > value.endDate) {
      newValue.endDate = '';
    }
    
    onChange?.(newValue);
  };

  const handleEndDateChange = (endDate: string) => {
    onChange?.({ ...value, endDate });
  };

  return (
    <div className={`space-y-3 ${className || ''}`} role="group" aria-labelledby={label ? `${groupId}-label` : undefined}>
      {label && (
        <Label id={`${groupId}-label`}>
          {label}
          {required && <span className="text-destructive ml-1" aria-label="required">*</span>}
        </Label>
      )}
      
      <div className="grid grid-cols-2 gap-4">
        {/* Start Date */}
        <div className="space-y-2">
          <Label htmlFor={startId} className="text-xs text-muted-foreground">Start Date</Label>
          <div className="relative">
            <Input
              id={startId}
              type="date"
              value={value.startDate}
              onChange={(e) => handleStartDateChange(e.target.value)}
              disabled={disabled}
              required={required}
              min={min}
              max={value.endDate || max}
              aria-describedby={helpTextId}
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
          </div>
        </div>

        {/* End Date */}
        <div className="space-y-2">
          <Label htmlFor={endId} className="text-xs text-muted-foreground">End Date</Label>
          <div className="relative">
            <Input
              id={endId}
              type="date"
              value={value.endDate}
              onChange={(e) => handleEndDateChange(e.target.value)}
              disabled={disabled}
              required={required}
              min={allowSameDay ? value.startDate : value.startDate ? new Date(new Date(value.startDate).getTime() + 86400000).toISOString().split('T')[0] : min}
              max={max}
              aria-describedby={helpTextId}
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
          </div>
        </div>
      </div>

      {helpText && (
        <p id={helpTextId} className="text-xs text-muted-foreground" role="note">
          {helpText}
        </p>
      )}
      
      {!allowSameDay && (
        <p className="text-xs text-muted-foreground italic" role="note">
          Start and end dates must be different
        </p>
      )}
    </div>
  );
}
