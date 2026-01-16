import React from 'react';
import { Smile, Meh, Frown } from 'lucide-react';
import { Label } from '@/components/shadcn/label';
import { cn } from '@/lib/utils';

export type HappinessLevel = 'happy' | 'neutral' | 'sad' | null;

export interface HappinessRatingFieldProps {
  label?: string;
  helpText?: string;
  value?: HappinessLevel;
  onChange?: (value: HappinessLevel) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export function HappinessRatingField({
  label,
  helpText,
  value = null,
  onChange,
  disabled = false,
  className,
  id,
}: HappinessRatingFieldProps) {
  const groupId = id || `happiness-rating-${React.useId()}`;
  const helpTextId = helpText ? `${groupId}-help` : undefined;
  const options: { value: HappinessLevel; icon: typeof Smile; color: string; label: string }[] = [
    { value: 'sad', icon: Frown, color: 'text-red-500', label: 'Unhappy' },
    { value: 'neutral', icon: Meh, color: 'text-yellow-500', label: 'Neutral' },
    { value: 'happy', icon: Smile, color: 'text-green-500', label: 'Happy' },
  ];

  return (
    <div className={`space-y-3 ${className || ''}`} role="none">
      {label && <Label id={`${groupId}-label`}>{label}</Label>}
      <div 
        className="flex items-center justify-center gap-4"
        role="radiogroup"
        aria-labelledby={label ? `${groupId}-label` : undefined}
        aria-describedby={helpTextId}
      >
        {options.map((option) => {
          const Icon = option.icon;
          const isSelected = value === option.value;
          
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={option.label}
              onClick={() => !disabled && onChange?.(option.value)}
              disabled={disabled}
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200",
                isSelected
                  ? "border-current bg-muted scale-110"
                  : "border-transparent hover:border-muted hover:bg-muted/50 hover:scale-105",
                disabled && "cursor-not-allowed opacity-50",
                option.color
              )}
              title={option.label}
            >
              <Icon className="w-10 h-10" aria-hidden="true" />
              <span className="text-xs font-medium">{option.label}</span>
            </button>
          );
        })}
      </div>
      {helpText && (
        <p id={helpTextId} className="text-xs text-muted-foreground text-center" role="note">{helpText}</p>
      )}
    </div>
  );
}
