"use client"

import React, { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useQuery, useMutation, useAction } from "convex/react"
import { api } from "~/convex/_generated/api"
import { 
    ArrowLeft, 
    Plus, 
    GripVertical, 
    Type, 
    Hash, 
    AtSign, 
    AlignLeft, 
    List,
    Phone,
    Code2,
    ToggleLeft,
    Info,
    GitMerge,
    Calendar,
    CircleDot,
    CheckSquare,
    MapPin,
    Heading,
    Minus,
    MessageSquare,
    ChevronsUpDown,
    X,
    Trash2,
    Check,
    XCircle
} from "lucide-react"
import { useNativeAddressToStripeConvert, useNativeAddressToGoogleConvert } from "@/hooks/useAddressConverters"
import { Button } from "@/components/shadcn/button"
import { Input } from "@/components/shadcn/input"
import { Label } from "@/components/shadcn/label"
import { Textarea } from "@/components/shadcn/textarea"
import { Switch } from "@/components/shadcn/switch"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/shadcn/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/shadcn/dialog"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/shadcn/popover"
import { Separator } from "@/components/shadcn/separator"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

// Helper to recursively update fields
const updateFieldInTree = (fields: any[], fieldId: string, updates: any): any[] => {
    return fields.map(field => {
        if (field.id === fieldId) {
            return { ...field, ...updates };
        }
        if (field.children) {
            return { ...field, children: updateFieldInTree(field.children, fieldId, updates) };
        }
        return field;
    });
};

// Helper to recursively remove fields
const removeFieldFromTree = (fields: any[], fieldId: string): any[] => {
    return fields.filter(field => field.id !== fieldId).map(field => {
        if (field.children) {
            return { ...field, children: removeFieldFromTree(field.children, fieldId) };
        }
        return field;
    });
};

// Helper to recursively insert field at specific index or target
const insertFieldInTree = (fields: any[], newField: any, targetId?: string, position?: 'before' | 'after' | 'inside'): any[] => {
    // If no target, and no position, just push to end (handled by caller if root)
    if (!targetId) return [...fields, newField];

    // Check if target is in this list
    const targetIndex = fields.findIndex(f => f.id === targetId);
    if (targetIndex !== -1) {
        if (position === 'inside') {
            const field = fields[targetIndex];
            return [
                ...fields.slice(0, targetIndex),
                { ...field, children: [...(field.children || []), newField] },
                ...fields.slice(targetIndex + 1)
            ];
        } else if (position === 'before') {
            return [
                ...fields.slice(0, targetIndex),
                newField,
                ...fields.slice(targetIndex)
            ];
        } else { // after
            return [
                ...fields.slice(0, targetIndex + 1),
                newField,
                ...fields.slice(targetIndex + 1)
            ];
        }
    }

    // Otherwise recurse
    return fields.map(field => {
        if (field.children) {
            return {
                ...field,
                children: insertFieldInTree(field.children, newField, targetId, position)
            };
        }
        return field;
    });
};

const TestEnvVarButton = ({ envName }: { envName: string }) => {
    const checkEnv = useAction(api.myFunctions.checkEnvVar);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleTest = async () => {
        setStatus('loading');
        try {
            const exists = await checkEnv({ envVarName: envName });
            if (exists) {
                setStatus('success');
            } else {
                setStatus('error');
            }
        } catch (e) {
            console.error(e);
            setStatus('error');
        }
    };

    return (
        <div className="flex items-center gap-2">
            <Button 
                variant="outline" 
                size="sm" 
                onClick={handleTest}
                disabled={status === 'loading'}
                className="h-7 text-xs"
            >
                {status === 'loading' ? 'Testing...' : 'Test API Key'}
            </Button>
            
            {status === 'success' && (
                <div className="flex items-center gap-1 text-green-600 text-xs font-medium animate-in fade-in">
                    <Check className="w-3 h-3" />
                    <span>Verified</span>
                </div>
            )}
            
            {status === 'error' && (
                <div className="flex items-center gap-1 text-destructive text-xs font-medium animate-in fade-in">
                    <XCircle className="w-3 h-3" />
                    <span>Not Found</span>
                </div>
            )}
            {status === 'error' && <span className="text-[10px] text-muted-foreground ml-1">(You may need to restart app after adding var)</span>}
        </div>
    );
};

// Properties Panel Component
const PropertiesPanel = ({ 
    field, 
    allFields,
    onUpdate,
    onClose 
}: { 
    field: any, 
    allFields: any[],
    onUpdate: (id: string, updates: any) => void,
    onClose: () => void
}) => {
    if (!field) return null;

    return (
        <div className="flex flex-col h-full bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/20">
                <div>
                     <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Edit Properties</p>
                     <p className="text-xs text-muted-foreground">{field.type} Field</p>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                    <X className="w-4 h-4" />
                </Button>
            </div>
            
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
                 {/* Common Properties */}
                 <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Label</Label>
                        <Input 
                            value={field.label} 
                            onChange={(e) => onUpdate(field.id, { label: e.target.value })}
                            placeholder="Field Label"
                        />
                    </div>

                    {!['title', 'subtitle', 'separator'].includes(field.type) && (
                        <div className="space-y-2">
                             <Label>Helper Text</Label>
                             <Textarea 
                                value={field.helpText || ""} 
                                onChange={(e) => onUpdate(field.id, { helpText: e.target.value })}
                                placeholder="Instructions for the user..."
                                className="h-20 resize-none"
                            />
                        </div>
                    )}
                    
                    {!['title', 'subtitle', 'separator', 'address', 'stepper'].includes(field.type) && (
                         <div className="space-y-2">
                            <Label>Placeholder</Label>
                            <Input 
                                value={field.placeholder || ""} 
                                onChange={(e) => onUpdate(field.id, { placeholder: e.target.value })}
                                placeholder="Placeholder text..."
                            />
                        </div>
                    )}

                    {!['title', 'subtitle', 'separator'].includes(field.type) && (
                         <div className="flex items-center justify-between border p-3 rounded-lg bg-muted/10">
                            <Label>Required</Label>
                            <Switch 
                                checked={field.required} 
                                onCheckedChange={(c) => onUpdate(field.id, { required: c })}
                            />
                        </div>
                    )}
                 </div>

                 <Separator />

                 {/* Type Specific Loading */}
                 {['select', 'radio', 'checkbox'].includes(field.type) && (
                     <div className="space-y-2">
                        <Label>Options (comma separated)</Label>
                        <Textarea 
                            value={field.options?.join(', ')} 
                            onChange={(e) => onUpdate(field.id, { options: e.target.value.split(', ') })}
                            placeholder="Option 1, Option 2, Option 3"
                        />
                    </div>
                )}

                {field.type === 'regex' && (
                    <div className="space-y-2">
                        <Label>Regex Pattern</Label>
                        <Input 
                            value={field.regexPattern} 
                            onChange={(e) => onUpdate(field.id, { regexPattern: e.target.value })}
                            className="font-mono text-sm"
                        />
                    </div>
                )}

                {['number', 'stepper'].includes(field.type) && (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Min Value</Label>
                            <Input 
                                type="number"
                                value={field.validation?.min ?? ""} 
                                onChange={(e) => onUpdate(field.id, { validation: { ...field.validation, min: e.target.value ? Number(e.target.value) : undefined } })}
                                placeholder="0"
                            />
                        </div>
                        <div className="space-y-2">
                             <Label>Max Value</Label>
                            <Input 
                                type="number"
                                value={field.validation?.max ?? ""} 
                                onChange={(e) => onUpdate(field.id, { validation: { ...field.validation, max: e.target.value ? Number(e.target.value) : undefined } })}
                                placeholder="100"
                            />
                        </div>
                    </div>
                )}

                {/* Address Configuration */}
                {field.type === 'address' && (
                    <div className="space-y-4 border p-4 rounded-lg bg-muted/10">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base">Google AutoComplete</Label>
                                <p className="text-xs text-muted-foreground">Enable Google Places Address Autocomplete</p>
                            </div>
                            <Switch 
                                checked={field.addressConfig?.autoComplete || false} 
                                onCheckedChange={(c) => onUpdate(field.id, { addressConfig: { ...field.addressConfig, autoComplete: c } })}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base">Address Verification</Label>
                                <p className="text-xs text-muted-foreground">Verify address exists on blur.</p>
                            </div>
                            <Switch 
                                checked={field.addressConfig?.verifyAddress || false} 
                                onCheckedChange={(c) => onUpdate(field.id, { addressConfig: { ...field.addressConfig, verifyAddress: c } })}
                            />
                        </div>

                        {field.addressConfig?.autoComplete && (
                            <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                                <div className="text-xs text-blue-500 bg-blue-500/10 p-2 rounded border border-blue-500/20">
                                    <p className="font-semibold mb-1">Setup Required:</p>
                                    <ul className="list-disc pl-3 space-y-1">
                                        <li>You must have a valid Google Maps Places API Key.</li>
                                        <li>Add the key to your project environment variables (Convex Dashboard).</li>
                                    </ul>
                                </div>
                                
                                <div className="space-y-2">
                                    <Label>API Key Env Variable Name</Label>
                                    <div className="flex gap-2">
                                        <Input 
                                            value={field.addressConfig?.apiKeyEnvName || "GOOGLE_PLACES_API_KEY"} 
                                            onChange={(e) => onUpdate(field.id, { addressConfig: { ...field.addressConfig, apiKeyEnvName: e.target.value } })}
                                            placeholder="GOOGLE_PLACES_API_KEY"
                                            className="font-mono text-xs"
                                        />
                                    </div>
                                    <p className="text-[10px] text-muted-foreground">The name of the variable in your Convex Dashboard, NOT the key itself.</p>
                                </div>

                                <TestEnvVarButton 
                                    envName={field.addressConfig?.apiKeyEnvName || "GOOGLE_PLACES_API_KEY"} 
                                />
                            </div>
                        )}

                        <Separator className="my-2" />
                        
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Output Schema Format</Label>
                                <Select 
                                    value={field.addressConfig?.outputFormat || "default"} 
                                    onValueChange={(val) => onUpdate(field.id, { addressConfig: { ...field.addressConfig, outputFormat: val } })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Format" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="default">Default (Simple)</SelectItem>
                                        <SelectItem value="google">Google Compatible (String)</SelectItem>
                                        <SelectItem value="stripe">Stripe (Compliance)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                             {/* Output Preview */}
                             <div className="rounded-lg bg-zinc-950 p-3 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-mono text-muted-foreground uppercase">Data Preview / Mock</span>
                                    <span className="text-[10px] text-emerald-500 font-mono">
                                        {field.addressConfig?.outputFormat === 'stripe' && 'Stripe Object'}
                                        {field.addressConfig?.outputFormat === 'google' && 'Google Format String'}
                                        {(!field.addressConfig?.outputFormat || field.addressConfig?.outputFormat === 'default') && 'Native Object'}
                                    </span>
                                </div>
                                <pre className="text-[10px] font-mono text-zinc-300 overflow-x-auto p-1">
{(() => {
    const mockAddress = {
        address_ln1: "123 Main St",
        address_ln2: "Apt 4B",
        city: "San Francisco",
        state: "CA",
        zip: "94105",
        country: "US"
    };

    if (field.addressConfig?.outputFormat === 'stripe') {
        return JSON.stringify(useNativeAddressToStripeConvert(mockAddress), null, 2);
    }
    if (field.addressConfig?.outputFormat === 'google') {
        // useNativeAddressToGoogleConvert returns a string, good for simple storage or geocoding
        return `"${useNativeAddressToGoogleConvert(mockAddress)}"`;
    }
    // Default
    return JSON.stringify(mockAddress, null, 2);
})()}
                                </pre>
                            </div>
                        </div>
                    </div>
                )}

                {field.type === 'condition_block' && (
                    <div className="space-y-4">
                        <Label className="uppercase text-xs font-bold text-muted-foreground">Condition Rules</Label>
                         <div className="space-y-2">
                             <Label>IF Field</Label>
                             <Select 
                                value={field.conditionRule?.fieldId || ""} 
                                onValueChange={(val) => onUpdate(field.id, { conditionRule: { ...field.conditionRule, fieldId: val } })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Field" />
                                </SelectTrigger>
                                <SelectContent>
                                    {allFields
                                        .filter(f => f.id !== field.id && f.type !== 'condition_block')
                                        .map(f => (
                                            <SelectItem key={f.id} value={f.id}>{f.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                             <div className="space-y-2">
                                <Label>Operator</Label>
                                <Select 
                                    value={field.conditionRule?.operator || "eq"} 
                                    onValueChange={(val) => onUpdate(field.id, { conditionRule: { ...field.conditionRule, operator: val } })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Operator" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="eq">Equals</SelectItem>
                                        <SelectItem value="neq">Not Equals</SelectItem>
                                        <SelectItem value="contains">Contains</SelectItem>
                                        <SelectItem value="gt">Greater Than</SelectItem>
                                        <SelectItem value="lt">Less Than</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                             <div className="space-y-2">
                                <Label>Value</Label>
                                <Input 
                                    placeholder="Value..." 
                                    value={field.conditionRule?.value || ""}
                                    onChange={(e) => onUpdate(field.id, { conditionRule: { ...field.conditionRule, value: e.target.value } })}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Stepper Component for Preview
const StepperPreview = () => (
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

// Recursive Field Renderer Component
const FieldRenderer = ({ 
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
    fields: any[],
    allFields: any[], 
    onUpdate: (id: string, updates: any) => void, 
    onRemove: (id: string) => void, 
    onDrop: (e: React.DragEvent, targetId?: string, position?: 'before' | 'after' | 'inside') => void,
    onDragStart: (e: React.DragEvent, id: string, type: 'field' | 'new') => void,
    selectedFieldId: string | null,
    onSelectField: (id: string | null) => void,
    isRoot?: boolean
}) => {
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
                        <GripVertical className="w-8 h-8" />
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
            {fields.map((field: any) => (
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
                        "group relative flex flex-col min-h-[120px] h-fit w-full rounded-md ring-1 ring-inset px-4 py-4 transition-all hover:cursor-pointer mb-1",
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

                    {/* Condition Block Layout */}
                    {field.type === 'condition_block' ? (
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
                                        <Input disabled placeholder="NY" className="bg-muted/50" />
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

                            {/* Standard Types Body */}
                            {['select', 'radio', 'checkbox'].includes(field.type) && (
                                <div className="space-y-2">
                                    <div className="flex flex-wrap gap-2">
                                        {field.options?.map((opt: string, i: number) => (
                                            <span key={i} className="px-2 py-1 bg-muted/30 rounded text-xs border border-border">{opt}</span>
                                        )) || <span className="text-xs text-muted-foreground italic">No options defined</span>}
                                    </div>
                                </div>
                            )}

                            {field.type === 'regex' && (
                                <div className="flex items-center gap-2 text-xs font-mono bg-muted/20 p-2 rounded">
                                    <Code2 className="w-3 h-3 text-muted-foreground" />
                                    <span>{field.regexPattern || "No pattern defined"}</span>
                                </div>
                            )}
                            
                            {/* Placeholder Preview (if applicable) */}
                             { !['title', 'subtitle', 'separator', 'address', 'stepper'].includes(field.type) && (
                                <div className="pt-1">
                                    <Input disabled placeholder={field.placeholder || "Answer..."} className="bg-muted/10 border-dashed" />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

// Icon helper needs to be outside or available
const getIconForType = (type: string) => {
    switch (type) {
        case "text": return <Type className="w-4 h-4" />
        case "email": return <AtSign className="w-4 h-4" />
        case "textarea": return <AlignLeft className="w-4 h-4" />
        case "number": return <Hash className="w-4 h-4" />
        case "select": return <List className="w-4 h-4" />
        case "phone": return <Phone className="w-4 h-4" />
        case "regex": return <Code2 className="w-4 h-4" />
        case "boolean": return <ToggleLeft className="w-4 h-4" />
        case "date": return <Calendar className="w-4 h-4" />
        case "radio": return <CircleDot className="w-4 h-4" />
        case "checkbox": return <CheckSquare className="w-4 h-4" />
        case "condition_block": return <GitMerge className="w-4 h-4" />
        case "separator": return <Minus className="w-4 h-4" />
        case "title": return <Heading className="w-4 h-4" />
        case "subtitle": return <MessageSquare className="w-4 h-4" />
        case "address": return <MapPin className="w-4 h-4" />
        case "stepper": return <ChevronsUpDown className="w-4 h-4" />
        default: return <Type className="w-4 h-4" />
    }
}

export default function FormBuilderPage() {
    const params = useParams()
    const router = useRouter()
    const formId = params.formId as any
    
    const form = useQuery(api.myFunctions.getCustomFormById, { id: formId })
    const updateForm = useMutation(api.myFunctions.updateCustomForm)

    const [draggedType, setDraggedType] = useState<string | null>(null)
    const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null)

    if (!form) {
        return (
             <div className="flex flex-col h-[60vh] items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin" />
            </div>
        )
    }

    const handleDragStart = (e: React.DragEvent, id: string, type: 'field' | 'new') => {
        if (type === 'new') {
             e.dataTransfer.setData("type", id); // id is the input type string here
             e.dataTransfer.setData("dragMode", "new");
             setDraggedType(id);
        } else {
             e.dataTransfer.setData("fieldId", id);
             e.dataTransfer.setData("dragMode", "move");
             setDraggedType('existing-field');
        }
    }

    const handleDrop = async (e: React.DragEvent, targetId?: string, position?: 'before' | 'after' | 'inside') => {
        e.preventDefault();
        e.stopPropagation();
        
        const dragMode = e.dataTransfer.getData("dragMode");
        console.log("DROP:", { dragMode, targetId, position });

        let updatedFields = [...(form.fields || [])];

        if (dragMode === 'move') {
            const fieldId = e.dataTransfer.getData("fieldId");
            console.log("Move Field:", fieldId);
            if (!fieldId) return;
            if (fieldId === targetId) return; // Dropped on self

            // 1. Find and Remove the field from its old location
            const fieldToMove = allFlatFields.find(f => f.id === fieldId);
            if (!fieldToMove) {
                console.error("Field not found:", fieldId);
                return;
            }

             updatedFields = removeFieldFromTree(updatedFields, fieldId);

             // 2. Insert at new location
             updatedFields = insertFieldInTree(updatedFields, fieldToMove, targetId, position);

        } else {
             // NEW FIELD
            const type = e.dataTransfer.getData("type");
            setDraggedType(null);
            if (!type) return;

            // ... (rest of new field logic)

            let defaultOptions: string[] | undefined = undefined;
            if (['select', 'radio', 'checkbox'].includes(type)) {
                defaultOptions = ["Option 1", "Option 2", "Option 3"];
            }

            const newField = {
                id: Math.random().toString(36).substr(2, 9),
                label: type === 'condition_block' ? 'Condition Logic' : 
                       type === 'separator' ? 'Horizontal Rule' :
                       type === 'title' ? 'Form Title' :
                       type === 'subtitle' ? 'Subtitle' :
                       type === 'address' ? 'Address' :
                       type === 'stepper' ? 'Quantity' :
                       `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
                type: type,
                required: false,
                placeholder: "",
                options: defaultOptions,
                regexPattern: type === 'regex' ? "^[a-zA-Z0-9]+$" : undefined,
                helpText: "",
                conditionRule: type === 'condition_block' ? { fieldId: "", operator: "eq", value: "" } : undefined,
                children: type === 'condition_block' ? [] : undefined 
            };

            updatedFields = insertFieldInTree(updatedFields, newField, targetId, position);
        }

        try {
            await updateForm({
                id: form._id,
                fields: updatedFields
            })
            if (dragMode === 'new') toast.success("Field added")
        } catch (error) {
            toast.error("Failed to update form")
        }
    }

    const handleRemoveField = async (fieldId: string) => {
        const updatedFields = removeFieldFromTree(form.fields || [], fieldId);
        try {
            await updateForm({
                id: form._id,
                fields: updatedFields
            })
            toast.success("Field removed")
        } catch (error) {
            toast.error("Failed to remove field")
        }
    }

    const handleUpdateField = async (fieldId: string, updates: any) => {
        const updatedFields = updateFieldInTree(form.fields || [], fieldId, updates);
        try {
            await updateForm({
                id: form._id,
                fields: updatedFields
            })
        } catch (error) {
            toast.error("Failed to update field")
        }
    }

    const inputTypes = [
        { type: "text", label: "Short Text", icon: Type },
        { type: "email", label: "Email", icon: AtSign },
        { type: "phone", label: "Phone Number", icon: Phone },
        { type: "textarea", label: "Long Text", icon: AlignLeft },
        { type: "number", label: "Number", icon: Hash },
        { type: "select", label: "Dropdown", icon: List },
        { type: "radio", label: "Radio Group", icon: CircleDot },
        { type: "checkbox", label: "Checkbox Group", icon: CheckSquare },
        { type: "date", label: "Date Picker", icon: Calendar },
        { type: "boolean", label: "Yes/No Toggle", icon: ToggleLeft },
        { type: "regex", label: "Custom Regex", icon: Code2 },
        { type: "condition_block", label: "Condition Block", icon: GitMerge },
        { type: "address", label: "Address Group", icon: MapPin },
        { type: "title", label: "Form Title", icon: Heading },
        { type: "subtitle", label: "Subtitle", icon: MessageSquare },
        { type: "separator", label: "Horizontal Rule", icon: Minus },
        { type: "stepper", label: "Stepper", icon: ChevronsUpDown },
    ]

    // Flatten all fields for the Condition logic dropdown (so you can target any field on the form)
    // Actually we probably want a flat list of all "data" fields (not blocks)
    const getAllFieldsFlat = (nodes: any[]): any[] => {
        let flat: any[] = [];
        nodes.forEach(node => {
            flat.push(node);
            if (node.children) {
                flat = [...flat, ...getAllFieldsFlat(node.children)];
            }
        });
        return flat;
    };

    const allFlatFields = form.fields ? getAllFieldsFlat(form.fields) : [];

    return (
        <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-6 h-[calc(100vh-80px)]">
             <div className="flex items-center gap-4 border-b border-border pb-6 shrink-0">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-3xl font-black uppercase italic tracking-tighter text-foreground">{form.name}</h1>
                    <p className="text-muted-foreground">{form.description}</p>
                </div>
            </div>

            <div className="flex w-full h-full gap-8 pb-20">
                {/* Visual Canvas - Paper Style - With QR Background */}
                <div 
                    className="flex-1 bg-accent/20 border border-border/50 rounded-xl p-4 overflow-y-auto bg-[url(/QR-bg.svg)] dark:bg-[url(/QR-bg-dark.svg)]"
                    onClick={() => {
                        setSelectedFieldId(null);
                    }}
                >
                    <div className="max-w-[920px] mx-auto bg-background h-full min-h-[600px] rounded-xl shadow-xl shadow-black/5 border border-border/50 flex flex-col items-center justify-start py-10 px-6 space-y-4 relative" onClick={(e) => e.stopPropagation()}>
                        {draggedType && (
                            <div className="absolute inset-0 bg-primary/5 border-primary/20 border-2 border-dashed rounded-xl z-20 flex items-center justify-center pointer-events-none animate-pulse">
                                <span className="text-primary font-bold bg-background/90 px-6 py-3 rounded-full shadow-sm backdrop-blur-sm border border-primary/20">
                                    Drop Element Here
                                </span>
                            </div>
                        )}

                        <div className="w-full">
                            <FieldRenderer 
                                fields={form.fields || []} 
                                allFields={allFlatFields}
                                onUpdate={handleUpdateField}
                                onRemove={handleRemoveField}
                                onDrop={handleDrop}
                                onDragStart={handleDragStart}
                                selectedFieldId={selectedFieldId}
                                onSelectField={setSelectedFieldId}
                                isRoot={true}
                            />
                        </div>
                    </div>
                </div>

                {/* Sidebar - Draggable Fields or Properties */}
                <div className="w-[350px] shrink-0 sticky top-8 h-[calc(100vh-100px)]">
                    {selectedFieldId && allFlatFields.find(f => f.id === selectedFieldId) ? (
                         <PropertiesPanel 
                            field={allFlatFields.find(f => f.id === selectedFieldId)} 
                            allFields={allFlatFields}
                            onUpdate={handleUpdateField}
                            onClose={() => setSelectedFieldId(null)}
                         />
                    ) : (
                        <div className="bg-card border border-border rounded-xl p-6 shadow-sm h-full overflow-y-auto">
                            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4">Input Elements</h3>
                            <Separator className="my-4" />
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 place-items-center">
                                {inputTypes.map((item) => (
                                    <div 
                                        key={item.type}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, item.type, 'new')}
                                        className="flex flex-col items-center justify-center gap-2 w-full aspect-square bg-background border border-border rounded-lg cursor-grab active:cursor-grabbing hover:border-primary hover:text-primary hover:shadow-md transition-all group"
                                    >
                                        <item.icon className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                                        <p className="text-sm font-medium text-muted-foreground group-hover:text-primary text-center transition-colors">
                                            {item.label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
