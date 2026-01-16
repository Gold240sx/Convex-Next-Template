
import React from 'react';
import { Minus, Plus } from 'lucide-react';

export const StepperPreview = () => (
    <div className="flex items-center justify-between bg-background border border-input rounded-full px-4 py-2 w-[160px] shadow-sm">
         <button className="text-muted-foreground hover:text-primary transition-colors">
            <Minus className="w-5 h-5" />
        </button>
        <span className="text-xl font-bold text-primary">0</span>
        <button className="text-muted-foreground hover:text-primary transition-colors">
             <Plus className="w-5 h-5" />
        </button>
    </div>
);
