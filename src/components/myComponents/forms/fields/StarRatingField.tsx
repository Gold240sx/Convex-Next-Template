import React from 'react';
import { Star } from 'lucide-react';
import { Label } from '@/components/shadcn/label';
import { cn } from '@/lib/utils';

export interface StarRatingFieldProps {
  label?: string;
  helpText?: string;
  value?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
  maxStars?: number;
  className?: string;
  id?: string;
}

export function StarRatingField({
  label,
  helpText,
  value = 0,
  onChange,
  disabled = false,
  maxStars = 5,
  className,
  id,
}: StarRatingFieldProps) {
  const [hoverValue, setHoverValue] = React.useState(0);
  const groupId = id || `star-rating-${React.useId()}`;
  const helpTextId = helpText ? `${groupId}-help` : undefined;

  return (
    <div className={`space-y-2 ${className || ''}`} role="none">
      {label && (
        <Label id={`${groupId}-label`}>
          {label}
        </Label>
      )}
      <div 
        className="flex items-center gap-1"
        role="radiogroup"
        aria-labelledby={label ? `${groupId}-label` : undefined}
        aria-describedby={helpTextId}
      >
        {Array.from({ length: maxStars }, (_, i) => i + 1).map((star) => (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} star${star === 1 ? '' : 's'}`}
            onClick={() => !disabled && onChange?.(star)}
            onMouseEnter={() => !disabled && setHoverValue(star)}
            onMouseLeave={() => !disabled && setHoverValue(0)}
            disabled={disabled}
            className={cn(
              "transition-all duration-200 hover:scale-110",
              disabled && "cursor-not-allowed opacity-50"
            )}
          >
            <Star
              className={cn(
                "w-6 h-6 transition-colors",
                star <= (hoverValue || value)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300 dark:text-gray-600"
              )}
              aria-hidden="true"
            />
          </button>
        ))}
        {value > 0 && (
          <span className="ml-2 text-sm font-medium text-muted-foreground" aria-live="polite">
            <span className="sr-only">Selection: </span>
            {value} / {maxStars}
          </span>
        )}
      </div>
      {helpText && (
        <p id={helpTextId} className="text-xs text-muted-foreground" role="note">
          {helpText}
        </p>
      )}
    </div>
  );
}
