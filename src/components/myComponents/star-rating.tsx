"use client";

import { Star } from "lucide-react";

// COME BACK TO THIS

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
}

export function StarRating({ value, onChange, readOnly }: StarRatingProps) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="focus:outline-none">
          {readOnly ? (
            <Star
              className={`h-6 w-6 ${
                i < value ? "fill-yellow-400 text-yellow-400" : "text-zinc-300"
              }`}
            />
          ) : (
            <button
              type="button"
              onClick={() => onChange?.(i + 1)}
              className="focus:outline-none"
            >
              <Star
                className={`h-6 w-6 ${
                  i < value
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-zinc-300"
                }`}
              />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
