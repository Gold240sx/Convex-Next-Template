
import React, { useState } from "react"
import { 
    Trash2, 
    Folder, 
    Columns, 
    GitMerge, 
    FileText, 
    Code2, 
    Info, 
    Image as ImageIcon,
    FileUp,
    Star,
    Calendar as CalendarIcon
} from "lucide-react"
import { Button } from "@/components/shadcn/button"
import { Input } from "@/components/shadcn/input"
import { Label } from "@/components/shadcn/label"
import { Textarea } from "@/components/shadcn/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/shadcn/select"
import { Switch } from "@/components/shadcn/switch"
import { Slider } from "@/components/shadcn/slider"
import { RadioGroup, RadioGroupItem } from "@/components/shadcn/radio-group"
import { Checkbox } from "@/components/shadcn/checkbox"
import { cn } from "@/lib/utils"
// Local imports
import { getIconForType } from "./constants"
import { StepperPreview } from "./StepperPreview"
import { useFormBuilderContext } from "./FormBuilderContext"
import { FormField } from "./form-builder-utils"

export const FieldRenderer = ({ 
    fields, 
    allFields,
    onUpdate, 
    onRemove, 
    onDrop, 
    onDragStart,
    selectedFieldId,
    onSelectField,
    isRoot = false 
}: { 
    fields: FormField[],
    allFields: FormField[], 
    onUpdate: (id: string, updates: Partial<FormField>) => void, 
    onRemove: (id: string) => void, 
    onDrop: (e: React.DragEvent, targetId?: string, position?: 'before' | 'after' | 'inside') => void,
    onDragStart: (e: React.DragEvent, id: string, type: 'field' | 'new') => void,
    selectedFieldId: string | null,
    onSelectField: (id: string | null) => void,
    isRoot?: boolean
}) => {
    const { openRTFEditor } = useFormBuilderContext();
    const [dragState, setDragState] = useState<{ id: string, position: 'top' | 'bottom' | 'inside' } | null>(null);

    const handleDragOver = (e: React.DragEvent, targetId: string, isContainer: boolean = false) => {
        e.preventDefault();
        e.stopPropagation();

        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const midY = rect.top + rect.height / 2;
        
        let position: 'top' | 'bottom' | 'inside' = 'bottom';

        if (isContainer) {
            // For containers, check if we are hovering specifically over the header/logic part or deeply inside
            // Simplified: If just hovering the block container, prefer adding to bottom or inside logic
             position = 'inside';
        } else {
             if (e.clientY < midY) {
                position = 'top';
            } else {
                position = 'bottom';
            }
        }
        
        setDragState({ id: targetId, position });
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };
    
    // Clear state on root drop/leave
    const handleRootDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        // If not hovering any child, we are just in root
        if(e.target === e.currentTarget) {
             setDragState(null);
        }
    }

    const handleDropInternal = (e: React.DragEvent, targetId?: string) => {
        e.preventDefault();
        e.stopPropagation();
        
        let position: 'before' | 'after' | 'inside' | undefined = undefined;
        if (dragState && dragState.id === targetId) {
            if (dragState.position === 'top') position = 'before';
            else if (dragState.position === 'bottom') position = 'after';
            else position = 'inside';
        } else {
             // Fallback if dropped on container without specific state
             if(targetId) position = 'inside'; 
        }

        onDrop(e, targetId, position);
        setDragState(null);
    };

    if (!fields || fields.length === 0) {
        if (isRoot) {
            return (
                <div 
                    className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50 min-h-[200px]"
                    onDragOver={handleRootDragOver}
                    onDrop={(e) => handleDropInternal(e)}
                >
                    <div className="p-4 rounded-full bg-muted mb-4">
                        {/* Note: GripVertical isn't imported, usage was only here. Using specialized icon or generic. */}
                        <div className="border-2 border-dashed border-current p-2 rounded">
                             <PlusIcon className="w-8 h-8" />
                        </div>
                    </div>
                    <p className="max-w-xs text-center">Drag and drop fields from the right sidebar to start building your form.</p>
                </div>
            );
        }
        return <div className="p-4 text-xs text-muted-foreground italic text-center border border-dashed rounded-lg bg-muted/20 min-h-[60px]"
                 onDragOver={(e) => handleDragOver(e, "container-empty", true)}
                 />;
    }

    return (
        <div 
            className={cn("space-y-4 min-h-[50px] relative px-2", !isRoot && "p-2")}
            onDragOver={isRoot ? handleRootDragOver : undefined}
            onDrop={(e) => isRoot && e.target === e.currentTarget ? handleDropInternal(e) : undefined} 
        >
            {fields.map((field: FormField) => (
                <div 
                    key={field.id} 
                    draggable
                    onDragStart={(e) => onDragStart(e, field.id, 'field')}
                    onDragOver={(e) => handleDragOver(e, field.id, field.type === 'condition_block')}
                    onDrop={(e) => handleDropInternal(e, field.id)}
                    onClick={(e) => {
                         e.stopPropagation();
                         onSelectField(field.id);
                    }}
                    className={cn(
                        "group relative flex flex-col min-h-[120px] h-fit w-full rounded-2xl ring-1 ring-inset px-4 py-4 transition-all hover:cursor-pointer mb-1",
                        // Default Style
                         "bg-gray-900/80 ring-border text-gray-100",
                         // Selected Style
                         selectedFieldId === field.id && "ring-2 ring-primary ring-offset-2 bg-gray-900 shadow-xl",
                         // Dragging Over Style
                         dragState && dragState.id === field.id && dragState.position === 'inside' && "ring-2 ring-primary ring-offset-2"
                    )}
                >
                    {/* Drag Indicators */}
                    {dragState && dragState.id === field.id && dragState.position === 'top' && (
                        <div className="absolute -top-3 left-0 right-0 h-2 bg-blue-500/40 rounded-full pointer-events-none z-50" />
                    )}
                    {dragState && dragState.id === field.id && dragState.position === 'bottom' && (
                        <div className="absolute -bottom-3 left-0 right-0 h-2 bg-blue-500/40 rounded-full pointer-events-none z-50" />
                    )}

                    {/* Overlay for not-selected items (Click to Modify) */}
                    {selectedFieldId !== field.id && (
                        <div className="absolute inset-0 bg-background/10 hover:bg-background/20 opacity-0 group-hover:opacity-100 transition-all z-10 flex items-center justify-center pointer-events-none">
                             <div className="bg-primary text-primary-foreground px-3 py-1 text-xs rounded-full shadow-sm animate-in fade-in zoom-in duration-200">
                                 Click to modify or Drag to move
                             </div>
                        </div>
                    )}
                    
                    {/* Delete Button - Only visible on hover or selection */}
                    <div className={cn(
                        "absolute top-0 right-0 h-full transition-opacity z-20 pointer-events-none",
                         selectedFieldId === field.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    )}>
                        <Button 
                            className="h-full rounded-l-none rounded-r-md border-l border-input bg-destructive hover:bg-destructive/90 text-destructive-foreground pointer-events-auto"
                            variant="destructive"
                            onClick={(e) => { e.stopPropagation(); onRemove(field.id); }}
                        >
                            <Trash2 className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Input Group Layout */}
                    {field.type === 'input_group' ? (
                        <div className="space-y-4 border rounded-lg p-4 bg-muted/5 relative">
                            {/* Group Header */}
                            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border/50">
                                 <span className="p-1 rounded bg-indigo-500/10 text-indigo-600">
                                    <Folder className="w-4 h-4" />
                                </span>
                                <span className="font-bold text-sm uppercase tracking-wide text-muted-foreground">
                                    {field.label || "Input Group"}
                                </span>
                                {field.stepTitle && (
                                     <span className="ml-auto text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground border">
                                        Step: {field.stepTitle}
                                     </span>
                                )}
                            </div>

                            {/* Recursive Children Render */}
                            <div 
                                className="pl-4 min-h-[60px]"
                                onDragOver={(e) => handleDragOver(e, field.id, true)}
                                onDrop={(e) => handleDropInternal(e, field.id)}
                            >
                                <FieldRenderer 
                                    fields={field.children || []} 
                                    allFields={allFields}
                                    onUpdate={onUpdate} 
                                    onRemove={onRemove} 
                                    onDrop={onDrop} 
                                    onDragStart={onDragStart}
                                    selectedFieldId={selectedFieldId}
                                    onSelectField={onSelectField}
                                    isRoot={false}
                                />
                            </div>
                        </div>
                    ) : field.type === 'flex_row' ? (
                        <div className="space-y-4 border rounded-lg p-4 bg-gradient-to-r from-purple-500/5 to-pink-500/5 relative">
                            {/* Flex Row Header */}
                            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border/50">
                                 <span className="p-1 rounded bg-purple-500/10 text-purple-600">
                                    <Columns className="w-4 h-4" />
                                </span>
                                <span className="font-bold text-sm uppercase tracking-wide text-muted-foreground">
                                    {field.label || "Flex Row"}
                                </span>
                                <span className="ml-auto text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground border">
                                    {field.flexConfig?.justify || 'start'} / {field.flexConfig?.align || 'center'}
                                </span>
                            </div>

                            {/* Horizontal Children Render (Building mode: Vertical/Grid for easier access) */}
                            <div 
                                className={`flex flex-col gap-4 min-h-[80px] border-2 border-dashed border-purple-500/20 rounded-lg p-2`}
                                onDragOver={(e) => handleDragOver(e, field.id, true)}
                                onDrop={(e) => handleDropInternal(e, field.id)}
                            >
                                {field.children && field.children.length > 0 ? (
                                    field.children.map((child: any) => (
                                        <div key={child.id} className="flex-shrink-0">
                                            <FieldRenderer 
                                                fields={[child]} 
                                                allFields={allFields}
                                                onUpdate={onUpdate} 
                                                onRemove={onRemove} 
                                                onDrop={onDrop} 
                                                onDragStart={onDragStart}
                                                selectedFieldId={selectedFieldId}
                                                onSelectField={onSelectField}
                                                isRoot={false}
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex-1 flex items-center justify-center text-muted-foreground text-xs italic">
                                        Drop elements here to arrange horizontally
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : field.type === 'condition_block' ? (
                        <div className="space-y-4 border-l-4 border-l-teal-500 pl-4 py-2">
                             <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border/50">
                                <span className="p-1 rounded bg-teal-500/10 text-teal-600">
                                    <GitMerge className="w-4 h-4" />
                                </span>
                                <span className="font-bold text-sm uppercase tracking-wide text-muted-foreground">Condition Block</span>
                            </div>

                            <div className="text-xs text-muted-foreground italic mb-2">
                                Define condition rules in the properties panel.
                            </div>

                            {/* Recursive Children Render */}
                            <div 
                                className="pl-4 border-l-2 border-dashed border-border min-h-[60px]"
                                onDragOver={(e) => handleDragOver(e, field.id, true)}
                                onDrop={(e) => handleDropInternal(e, field.id)}
                            >
                                <FieldRenderer 
                                    fields={field.children || []} 
                                    allFields={allFields}
                                    onUpdate={onUpdate} 
                                    onRemove={onRemove} 
                                    onDrop={onDrop} 
                                    onDragStart={onDragStart}
                                    selectedFieldId={selectedFieldId}
                                    onSelectField={onSelectField}
                                    isRoot={false}
                                />
                            </div>
                        </div>
                    ) : (
                        // Standard Field Layout
                        <div className="space-y-4 w-full pointer-events-none">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="p-1.5 rounded bg-teal-500/10 text-teal-600 shrink-0">
                                    {getIconForType(field.type)}
                                </span>
                                
                                {field.type === 'separator' ? (
                                    <span className="font-bold text-sm text-muted-foreground grow">Horizontal Separator</span>
                                ) : (
                                    <span className={cn(
                                        "font-bold grow",
                                        field.type === 'title' && "text-2xl",
                                        field.type === 'subtitle' && "text-xl text-muted-foreground",
                                        !['title', 'subtitle'].includes(field.type) && "text-lg"
                                    )}>
                                        {field.label || "Untitled Field"}
                                        {field.required && <span className="text-destructive ml-1">*</span>}
                                    </span>
                                )}
                                
                                {field.helpText && (
                                     <Info className="w-4 h-4 text-muted-foreground ml-2" />
                                )}
                            </div>

                            {/* Address Preview - USA Format */}
                            {field.type === 'address' && (
                                <div className="grid grid-cols-2 gap-3 opacity-60 select-none">
                                    <div className="col-span-2 space-y-1">
                                        <Label className="text-xs">Address Line 1</Label>
                                        <Input disabled placeholder="123 Main St" className="bg-muted/50" />
                                    </div>
                                    <div className="col-span-2 space-y-1">
                                         <Label className="text-xs">Address Line 2</Label>
                                         <Input disabled placeholder="Apt 4B" className="bg-muted/50" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs">City</Label>
                                        <Input disabled placeholder="New York" className="bg-muted/50" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs">State</Label>
                                        <Select disabled>
                                            <SelectTrigger className="bg-muted/50">
                                                <SelectValue placeholder="NY" />
                                            </SelectTrigger>
                                        </Select>
                                    </div>
                                    <div className="col-span-2 space-y-1">
                                        <Label className="text-xs">Zip Code</Label>
                                        <Input disabled placeholder="10001" className="bg-muted/50" />
                                    </div>
                                </div>
                            )}

                             {/* Stepper Preview */}
                             {field.type === 'stepper' && (
                                <div className="select-none">
                                    <StepperPreview />
                                </div>
                            )}

                            {/* Separator Preview */}
                            {field.type === 'separator' && (
                                <div className="py-2">
                                     <hr className="border-t border-border" />
                                </div>
                            )}

                            {/* Slider Preview */}
                            {field.type === 'slider' && (
                                <div className="space-y-2 select-none">
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>
                                            {field.sliderConfig?.unit === 'currency' && '$'}
                                            {field.sliderConfig?.min ?? 0}
                                            {field.sliderConfig?.unit === 'percent' && '%'}
                                        </span>
                                        <span>
                                            {field.sliderConfig?.unit === 'currency' && '$'}
                                            {field.sliderConfig?.max ?? 100}
                                            {field.sliderConfig?.unit === 'percent' && '%'}
                                        </span>
                                    </div>
                                    <Slider 
                                        disabled
                                        defaultValue={[(field.sliderConfig?.min ?? 0) + ((field.sliderConfig?.max ?? 100) - (field.sliderConfig?.min ?? 0)) / 2]}
                                        min={field.sliderConfig?.min ?? 0}
                                        max={field.sliderConfig?.max ?? 100}
                                        step={field.sliderConfig?.step ?? 1}
                                        className="py-4"
                                    />
                                </div>
                            )}

                            {/* Image Preview */}
                            {field.type === 'image' && (
                                <div className="space-y-2">
                                    {field.imageConfig?.src ? (
                                        <div className="relative border border-border rounded-lg overflow-hidden bg-muted/20 text-center">
                                            <img 
                                                src={field.imageConfig.src} 
                                                alt={field.imageConfig.alt || "Preview"}
                                                style={{
                                                    width: field.imageConfig.width ? `${field.imageConfig.width}px` : 'auto',
                                                    height: field.imageConfig.height ? `${field.imageConfig.height}px` : 'auto',
                                                    maxWidth: '100%',
                                                    display: 'inline-block'
                                                }}
                                                className="object-contain max-h-[300px]"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center h-32 border-2 border-dashed border-border rounded-lg bg-muted/10">
                                            <div className="text-center text-muted-foreground">
                                                <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                                <p className="text-xs">
                                                    {field.imageConfig?.allowUpload ? "Preview Image (Upload Enabled)" : "No image URL set"}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* File Upload Preview */}
                            {field.type === 'file_upload' && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-center h-24 border-2 border-dashed border-border rounded-lg bg-muted/10 cursor-not-allowed opacity-60">
                                        <div className="text-center text-muted-foreground">
                                            <FileUp className="w-6 h-6 mx-auto mb-1" />
                                            <p className="text-xs">Click to upload</p>
                                            <p className="text-[10px] mt-1">
                                                Max {field.fileConfig?.maxFiles ?? 1} file(s) • {!field.fileConfig?.maxSize ? "N/A" : `${field.fileConfig.maxSize} MB limit`}
                                            </p>
                                        </div>
                                    </div>
                                    {field.fileConfig?.allowedTypes && field.fileConfig.allowedTypes.length > 0 && (
                                        <p className="text-[10px] text-muted-foreground">
                                            Allowed: {field.fileConfig.allowedTypes.map((t: string) => t.split('/')[0]).filter((v: string, i: number, a: string[]) => a.indexOf(v) === i).join(', ')}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Star Rating Preview */}
                            {field.type === 'star_rating' && (
                                <div className="flex items-center gap-1 select-none">
                                    {Array.from({ length: field.starRatingConfig?.maxStars || 5 }).map((_, i) => (
                                        <Star 
                                            key={i}
                                            className={`w-6 h-6 ${i < 3 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Happiness Rating Preview */}
                            {field.type === 'happiness_rating' && (
                                <div className="flex items-center gap-2 select-none">
                                    {['😞', '😕', '😐', '🙂', '😄'].map((emoji, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            disabled
                                            className={`text-3xl transition-all hover:scale-110 ${i === 2 ? 'opacity-100 scale-110' : 'opacity-40'}`}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Date Range Preview */}
                            {field.type === 'date_range' && (
                                <div className="grid grid-cols-2 gap-2 select-none">
                                    <div className="space-y-1">
                                        <Label className="text-xs">Start Date</Label>
                                        <Input disabled placeholder="MM/DD/YYYY" className="bg-muted/50" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs">End Date</Label>
                                        <Input disabled placeholder="MM/DD/YYYY" className="bg-muted/50" />
                                    </div>
                                </div>
                            )}

                            {/* Phone Preview */}
                            {field.type === 'phone' && (
                                <div className="flex gap-2">
                                    {field.phoneConfig?.showFlags && (
                                        <div className="flex items-center justify-center w-12 border bg-muted/10 rounded border-dashed text-xl grayscale opacity-50 select-none">
                                            🇺🇸
                                        </div>
                                    )}
                                    <Input 
                                        disabled 
                                        placeholder={field.placeholder || (field.phoneConfig?.international ? "+1 (555) 000-0000" : "(555) 000-0000")} 
                                        className="bg-muted/10 border-dashed" 
                                    />
                                </div>
                            )}

                            {/* Standard Types Body */}
                            {/* Radio Group Preview */}
                            {field.type === 'radio' && (
                                <RadioGroup disabled className="space-y-2">
                                    {(field.options && field.options.length > 0 ? field.options : ["Option 1", "Option 2"]).map((opt: string, i: number) => (
                                        <div key={i} className="flex items-center space-x-2">
                                            <RadioGroupItem value={opt} id={`${field.id}-${i}`} />
                                            <Label htmlFor={`${field.id}-${i}`}>{opt}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            )}

                            {/* Checkbox Group Preview */}
                            {field.type === 'checkbox' && (
                                <div className="space-y-2">
                                    {(field.options && field.options.length > 0 ? field.options : ["Option 1", "Option 2"]).map((opt: string, i: number) => (
                                        <div key={i} className="flex items-center space-x-2">
                                            <Checkbox id={`${field.id}-${i}`} disabled />
                                            <Label htmlFor={`${field.id}-${i}`}>{opt}</Label>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Select Preview */}
                            {field.type === 'select' && (
                                <div className="space-y-2">
                                    <Select disabled>
                                        <SelectTrigger className="bg-muted/10 border-dashed">
                                            <SelectValue placeholder="Select an option" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {(field.options && field.options.length > 0 ? field.options : ["Option 1", "Option 2"]).map((opt: string, i: number) => (
                                                <SelectItem key={i} value={opt}>{opt}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {(field.options || []).map((opt: string, i: number) => (
                                            <span key={i} className="px-1.5 py-0.5 bg-muted/30 rounded-[4px] text-[10px] text-muted-foreground border border-border/50">{opt}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Boolean / Toggle Preview */}
                            {field.type === 'boolean' && (
                                <div className="flex items-center space-x-2">
                                    <Switch disabled />
                                    <Label className="font-normal text-muted-foreground">
                                        {field.placeholder || "Yes / No"}
                                    </Label>
                                </div>
                            )}

                            {/* Date Preview */}
                            {field.type === 'date' && (
                                <div className="relative">
                                     <Input disabled placeholder="Select date..." className="pl-9 bg-muted/10 border-dashed" />
                                     <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                </div>
                            )}

                            {/* Textarea Preview */}
                            {field.type === 'textarea' && (
                                <div className="space-y-1">
                                    <Textarea 
                                        disabled 
                                        placeholder={field.placeholder || "Type your answer..."} 
                                        className={cn("bg-muted/10 border-dashed resize-none", field.textareaConfig?.resizable && "resize-y")}
                                        rows={field.textareaConfig?.rows || 4}
                                    />
                                </div>
                            )}

                             {/* Placeholder Preview (if applicable) - Fallback for Text, Number, Email, Phone */}
                             { !['title', 'subtitle', 'separator', 'address', 'stepper', 'richtext', 'color_picker', 'date', 'textarea', 'boolean', 'radio', 'checkbox', 'select', 'phone', 'file_upload', 'image', 'star_rating', 'happiness_rating', 'slider', 'date_range', 'input_group', 'flex_row', 'condition_block'].includes(field.type) && (
                                <div className="space-y-1">
                                    <Input disabled placeholder={field.placeholder || "Answer..."} className="bg-muted/10 border-dashed" />
                                    {field.regexPattern && (
                                        <div className="flex items-center gap-2 text-xs font-mono bg-muted/20 p-2 rounded">
                                            <Code2 className="w-3 h-3 text-muted-foreground" />
                                            <span className="text-muted-foreground">Pattern: {field.regexPattern}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Color Picker Preview */}
                            {field.type === 'color_picker' && (
                                <div className="space-y-4">
                                    <div className="flex flex-wrap gap-3">
                                        {field.options?.map((color: string, i: number) => (
                                            <div 
                                                key={i} 
                                                className="w-10 h-10 rounded-full border-2 border-border shadow-sm transition-transform hover:scale-110 cursor-alias"
                                                style={{ backgroundColor: color }}
                                                title={color}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-[10px] text-muted-foreground italic uppercase font-bold tracking-widest">
                                        Color Selection Grid
                                    </p>
                                </div>
                            )}

                            {/* Rich Text Preview */}
                            {field.type === 'richtext' && (
                                <div className="space-y-2">
                                    <div className="p-4 border border-dashed border-border rounded-lg bg-muted/5 min-h-[100px] relative overflow-hidden">
                                        <div className="absolute top-2 right-2 flex items-center gap-1.5 text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded border border-border italic">
                                            <FileText className="w-3 h-3" />
                                            Rich Text Editor
                                        </div>
                                        {field.content ? (
                                            <div 
                                                className="prose prose-sm dark:prose-invert max-w-none opacity-60 text-xs line-clamp-4"
                                                dangerouslySetInnerHTML={{ __html: field.content }}
                                            />
                                        ) : (
                                            <div className="space-y-2 opacity-30 select-none">
                                                <p className="text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                                                <p className="text-sm">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                                            </div>
                                        )}
                                    </div>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="w-full text-xs h-8 border-dashed bg-muted/10 hover:bg-muted/30"
                                        onClick={() => openRTFEditor(field.id, field.content)}
                                    >
                                        Edit Rich Content
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

function PlusIcon(props: React.ComponentProps<'svg'>) {
    return (
        <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        >
        <path d="M5 12h14" />
        <path d="M12 5v14" />
        </svg>
    )
}
