
"use client"

import React, { useState } from "react"
import { useAction, useMutation } from "convex/react"
import { api } from "~/convex/_generated/api"
import { 
    Check, 
    XCircle, 
    X, 
    Minus, 
    Plus, 
    FileText,
    Loader2 
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
import { Separator } from "@/components/shadcn/separator"
import { useNativeAddressToStripeConvert as convertToStripe, useNativeAddressToGoogleConvert as convertToGoogle } from "@/hooks/useAddressConverters"
import { useFormBuilderContext } from "./FormBuilderContext"
import { FormField } from "./form-builder-utils"
import { Checkbox } from "@/components/shadcn/checkbox"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/shadcn/accordion"

const fileTypes: Record<string, { label: string, mime: string }[]> = {
    'Images': [
        { label: 'JPG', mime: 'image/jpeg' },
        { label: 'PNG', mime: 'image/png' },
        { label: 'GIF', mime: 'image/gif' },
        { label: 'WEBP', mime: 'image/webp' },
        { label: 'SVG', mime: 'image/svg+xml' }
    ],
    'Documents': [
        { label: 'PDF', mime: 'application/pdf' },
        { label: 'DOC', mime: 'application/msword' },
        { label: 'DOCX', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
        { label: 'XLS', mime: 'application/vnd.ms-excel' },
        { label: 'XLSX', mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
        { label: 'PPT', mime: 'application/vnd.ms-powerpoint' },
        { label: 'PPTX', mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' },
        { label: 'TEXT', mime: 'text/plain' },
        { label: 'CSV', mime: 'text/csv' },
        { label: 'PAGES', mime: 'application/vnd.apple.pages' },
        { label: 'NUMBERS', mime: 'application/vnd.apple.numbers' },
        { label: 'KEYNOTE', mime: 'application/vnd.apple.keynote' }
    ],
    'Videos': [
        { label: 'MP4', mime: 'video/mp4' },
        { label: 'WEBM', mime: 'video/webm' },
        { label: 'MOV', mime: 'video/quicktime' }
    ],
    'Audio': [
        { label: 'MP3', mime: 'audio/mpeg' },
        { label: 'WAV', mime: 'audio/wav' },
        { label: 'OGG', mime: 'audio/ogg' }
    ],
    'Archives': [
        { label: 'ZIP', mime: 'application/zip' },
        { label: 'RAR', mime: 'application/x-rar-compressed' },
        { label: 'TAR', mime: 'application/x-tar' },
        { label: 'GZ', mime: 'application/gzip' },
        { label: '7Z', mime: 'application/x-7z-compressed' }
    ],
    'Code': [
        { label: 'JS', mime: 'application/javascript' },
        { label: 'TS', mime: 'application/typescript' },
        { label: 'PY', mime: 'text/x-python' },
        { label: 'HTML', mime: 'text/html' },
        { label: 'CSS', mime: 'text/css' },
        { label: 'JSON', mime: 'application/json' },
        { label: 'XML', mime: 'application/xml' },
        { label: 'SQL', mime: 'application/sql' },
        { label: 'RF', mime: 'application/x-robot-framework' } // Assuming .rf implies Robot Framework or similar text format
    ]
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

export const PropertiesPanel = ({ 
    field, 
    allFields,
    onUpdate,
    onClose,
    settings 
}: { 
    field: FormField, 
    allFields: FormField[],
    onUpdate: (id: string, updates: Partial<FormField>) => void,
    onClose: () => void,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    settings?: any // Pass form settings
}) => {
    const { openRTFEditor } = useFormBuilderContext();
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
                    
                    {!['title', 'subtitle', 'separator', 'address', 'stepper', 'slider', 'star_rating', 'file_upload', 'image', 'checkbox', 'radio', 'date_range'].includes(field.type) && (
                         <div className="space-y-2">
                            <Label>Placeholder</Label>
                            <Input 
                                value={field.placeholder || ""} 
                                onChange={(e) => onUpdate(field.id, { placeholder: e.target.value })}
                                placeholder="Placeholder text..."
                            />
                        </div>
                    )}

                    {field.type === 'email' && (
                        <div className="flex items-center justify-between border p-3 rounded-lg bg-muted/10">
                            <div className="space-y-0.5">
                                <Label>Business Emails Only</Label>
                                <p className="text-xs text-muted-foreground">Reject standard providers (gmail, yahoo, etc)</p>
                            </div>
                            <Switch 
                                checked={field.emailConfig?.businessOnly ?? false} 
                                onCheckedChange={(c) => onUpdate(field.id, { emailConfig: { ...field.emailConfig, businessOnly: c } })}
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

                    {field.type === 'richtext' && (
                        <div className="space-y-4">
                            <Label>Content Editor</Label>
                            <Button 
                                className="w-full justify-start gap-2 h-10 border-dashed" 
                                variant="outline"
                                onClick={() => {
                                    openRTFEditor(field.id, field.content);
                                }}
                            >
                                <FileText className="w-4 h-4 text-teal-500" />
                                <span>Open Rich Text Editor</span>
                            </Button>
                            <p className="text-[10px] text-muted-foreground italic">
                                Rich text content is edited in a specialized fullscreen-capable modal.
                            </p>
                        </div>
                    )}
                 </div>

                 <Separator />

                 {/* Type Specific Loading */}
                {/* Dynamic Options Builder */}
                {['select', 'radio', 'checkbox', 'color_picker'].includes(field.type) && (
                    <div className="space-y-3">
                        <Label>
                            {field.type === 'color_picker' 
                                ? 'Color Palette (Hex Codes)' 
                                : 'Options List'}
                        </Label>
                        
                        {/* Color Picker: Keep simple comma separated for now, or build cooler UI later */}
                        {field.type === 'color_picker' ? (
                             <Textarea 
                                value={field.options?.join(', ')} 
                                onChange={(e) => onUpdate(field.id, { options: e.target.value.split(', ').map((s: string) => s.trim()) })}
                                placeholder="#ef4444, #3b82f6..."
                                className="font-mono text-xs"
                            />
                        ) : (
                            <div className="space-y-2">
                                {(field.options || []).map((opt: string, idx: number) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <Input 
                                            value={opt} 
                                            onChange={(e) => {
                                                const newOpts = [...(field.options || [])];
                                                newOpts[idx] = e.target.value;
                                                onUpdate(field.id, { options: newOpts });
                                            }}
                                            placeholder={`Option ${idx + 1}`}
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-9 w-9 text-rose-500 hover:bg-rose-500/10 hover:text-rose-600"
                                            onClick={() => {
                                                const newOpts = (field.options || []).filter((_: string, i: number) => i !== idx);
                                                onUpdate(field.id, { options: newOpts });
                                            }}
                                        >
                                            <Minus className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full border-dashed"
                                    onClick={() => {
                                        const newOpts = [...(field.options || []), `Option ${(field.options?.length || 0) + 1}`];
                                        onUpdate(field.id, { options: newOpts });
                                    }}
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Option
                                </Button>
                            </div>
                        )}
                        {field.type === 'color_picker' && (
                            <p className="text-[10px] text-muted-foreground italic">
                                Enter hex codes like #FFFFFF or CSS color names.
                            </p>
                        )}
                    </div>
                )}

                {/* Regex Pattern for Text/Number Fields */}
                {['text', 'number'].includes(field.type) && (
                    <div className="space-y-2">
                        <Label>Regex Pattern (Optional)</Label>
                        <Input 
                            value={field.regexPattern || ""} 
                            onChange={(e) => onUpdate(field.id, { regexPattern: e.target.value })}
                            placeholder="e.g. ^[a-zA-Z0-9]+$"
                            className="font-mono text-sm"
                        />
                        <p className="text-xs text-muted-foreground">
                            Custom validation pattern for this field
                        </p>
                    </div>
                )}

                {/* Phone Format Configuration */}
                {field.type === 'phone' && (
                    <div className="space-y-4">
                        <Label className="uppercase text-xs font-bold text-muted-foreground">Phone Settings</Label>
                        <div className="space-y-2">
                            <Label>Format</Label>
                            <Select 
                                value={field.phoneConfig?.format || "pretty"} 
                                onValueChange={(val) => onUpdate(field.id, { phoneConfig: { ...field.phoneConfig, format: val } })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Format" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pretty">Pretty - (555) 555-5555</SelectItem>
                                    <SelectItem value="standard">Standard - 555-555-5555</SelectItem>
                                    <SelectItem value="basic">Basic - 5555555555</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center justify-between border p-3 rounded-lg bg-muted/10">
                            <div className="space-y-0.5">
                                <Label>International</Label>
                                <p className="text-xs text-muted-foreground">Allow international phone numbers</p>
                            </div>
                            <Switch 
                                checked={field.phoneConfig?.international ?? false} 
                                onCheckedChange={(c) => onUpdate(field.id, { phoneConfig: { ...field.phoneConfig, international: c } })}
                            />
                        </div>
                        <div className="flex items-center justify-between border p-3 rounded-lg bg-muted/10">
                            <div className="space-y-0.5">
                                <Label>Show Country Flags</Label>
                                <p className="text-xs text-muted-foreground">Display flag selector for countries</p>
                            </div>
                            <Switch 
                                checked={field.phoneConfig?.showFlags ?? false} 
                                onCheckedChange={(c) => onUpdate(field.id, { phoneConfig: { ...field.phoneConfig, showFlags: c } })}
                            />
                        </div>
                    </div>
                )}

                {/* Textarea Configuration */}
                {field.type === 'textarea' && (
                    <div className="space-y-4">
                        <Label className="uppercase text-xs font-bold text-muted-foreground">Long Text Settings</Label>
                        <div className="space-y-2">
                            <Label>Number of Rows</Label>
                            <div className="flex items-center gap-4">
                                <Input 
                                    type="number"
                                    value={field.textareaConfig?.rows ?? 4}
                                    onChange={(e) => onUpdate(field.id, { textareaConfig: { ...field.textareaConfig, rows: Number(e.target.value) } })}
                                    min="2"
                                    max="20"
                                    className="w-20"
                                />
                                <Slider 
                                    min={2} 
                                    max={20} 
                                    step={1} 
                                    value={[field.textareaConfig?.rows ?? 4]} 
                                    onValueChange={(vals) => onUpdate(field.id, { textareaConfig: { ...field.textareaConfig, rows: vals[0] } })}
                                    className="flex-1"
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-between border p-3 rounded-lg bg-muted/10">
                            <div className="space-y-0.5">
                                <Label>Vertically Resizable</Label>
                                <p className="text-xs text-muted-foreground">Allow users to resize height</p>
                            </div>
                            <Switch 
                                checked={field.textareaConfig?.resizable ?? true} 
                                onCheckedChange={(c) => onUpdate(field.id, { textareaConfig: { ...field.textareaConfig, resizable: c } })}
                            />
                        </div>
                    </div>
                )}

                {/* Date Range Configuration */}
                {field.type === 'date_range' && (
                    <div className="space-y-2">
                        <Label className="uppercase text-xs font-bold text-muted-foreground">Date Range Settings</Label>
                        <div className="flex items-center justify-between border p-3 rounded-lg bg-muted/10">
                            <Label>Allow Same Day</Label>
                            <Switch 
                                checked={field.dateRangeConfig?.allowSameDay ?? true} 
                                onCheckedChange={(c) => onUpdate(field.id, { dateRangeConfig: { ...field.dateRangeConfig, allowSameDay: c } })}
                            />
                        </div>
                    </div>
                )}

                {/* Number/Stepper Min/Max */}
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
                                disabled={!field.addressConfig?.autoComplete}
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
        return JSON.stringify(convertToStripe(mockAddress), null, 2);
    }
    if (field.addressConfig?.outputFormat === 'google') {
        // convertToGoogle returns a string, good for simple storage or geocoding
        return `"${convertToGoogle(mockAddress)}"`;
    }
    // Default
    return JSON.stringify(mockAddress, null, 2);
})()}
                                </pre>
                            </div>
                        </div>
                    </div>
                )}

                {/* Condition Block Layout */}
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
                                        <SelectItem value="is_empty">Is Empty / Null</SelectItem>
                                        <SelectItem value="is_not_empty">Is Not Empty</SelectItem>
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
                
                {/* Slider Configuration */}
                {field.type === 'slider' && (
                    <div className="space-y-4">
                        <Label className="uppercase text-xs font-bold text-muted-foreground">Slider Settings</Label>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="space-y-2">
                                <Label>Min</Label>
                                <Input 
                                    type="number"
                                    value={field.sliderConfig?.min ?? 0}
                                    onChange={(e) => onUpdate(field.id, { sliderConfig: { ...field.sliderConfig, min: Number(e.target.value) } })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Max</Label>
                                <Input 
                                    type="number"
                                    value={field.sliderConfig?.max ?? 100}
                                    onChange={(e) => onUpdate(field.id, { sliderConfig: { ...field.sliderConfig, max: Number(e.target.value) } })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Step</Label>
                                <Input 
                                    type="number"
                                    value={field.sliderConfig?.step ?? 1}
                                    onChange={(e) => onUpdate(field.id, { sliderConfig: { ...field.sliderConfig, step: Number(e.target.value) } })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Unit Display</Label>
                            <Select 
                                value={field.sliderConfig?.unit || "number"} 
                                onValueChange={(val) => onUpdate(field.id, { sliderConfig: { ...field.sliderConfig, unit: val } })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Format" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="number">Number</SelectItem>
                                    <SelectItem value="percent">Percentage (%)</SelectItem>
                                    <SelectItem value="currency">Currency ($)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                )}

                {/* Image Configuration */}
                {field.type === 'image' && (
                    <div className="space-y-4">
                        <Label className="uppercase text-xs font-bold text-muted-foreground">Image Settings</Label>
                        <div className="space-y-2">
                            <Label>Image URL</Label>
                            <Input 
                                value={field.imageConfig?.src || ""}
                                onChange={(e) => onUpdate(field.id, { imageConfig: { ...field.imageConfig, src: e.target.value } })}
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Alt Text</Label>
                            <Input 
                                value={field.imageConfig?.alt || ""}
                                onChange={(e) => onUpdate(field.id, { imageConfig: { ...field.imageConfig, alt: e.target.value } })}
                                placeholder="Image description"
                            />
                        </div>
                        <div className="flex items-center justify-between border p-3 rounded-lg bg-muted/10">
                            <div className="space-y-0.5">
                                <Label>Allow Uploads</Label>
                                <p className="text-xs text-muted-foreground">If false, only URL input is allowed</p>
                            </div>
                            <Switch 
                                checked={field.imageConfig?.allowUpload ?? true} 
                                onCheckedChange={(c) => onUpdate(field.id, { imageConfig: { ...field.imageConfig, allowUpload: c } })}
                            />
                        </div>

                        {/* Image Upload for Builder (Static Asset) */}
                        <div className="space-y-2">
                            <Label>Upload Image (Static Asset)</Label>
                            <ImageUploadButton 
                                onUploadComplete={(url) => {
                                    onUpdate(field.id, { 
                                        imageConfig: { 
                                            ...field.imageConfig, 
                                            src: url 
                                        } 
                                    });
                                }} 
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                             <div className="space-y-2">
                                <Label>Max File Size (MB)</Label>
                                <Input 
                                    type="number"
                                    value={field.imageConfig?.maxSize ?? 5}
                                    onChange={(e) => onUpdate(field.id, { imageConfig: { ...field.imageConfig, maxSize: Number(e.target.value) } })}
                                    placeholder="5"
                                />
                            </div>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-2">
                                <Label>Width (px)</Label>
                                <Input 
                                    type="number"
                                    value={field.imageConfig?.width ?? ""}
                                    onChange={(e) => onUpdate(field.id, { imageConfig: { ...field.imageConfig, width: e.target.value ? Number(e.target.value) : undefined } })}
                                    placeholder="Auto"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Height (px)</Label>
                                <Input 
                                    type="number"
                                    value={field.imageConfig?.height ?? ""}
                                    onChange={(e) => onUpdate(field.id, { imageConfig: { ...field.imageConfig, height: e.target.value ? Number(e.target.value) : undefined } })}
                                    placeholder="Auto"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* File Upload Configuration */}
                {field.type === 'file_upload' && (
                    <div className="space-y-4">
                        <Label className="uppercase text-xs font-bold text-muted-foreground">File Upload Settings</Label>
                        <div className="space-y-2">
                            <Label>Max Files</Label>
                            <Input 
                                type="number"
                                value={field.fileConfig?.maxFiles ?? 1}
                                onChange={(e) => onUpdate(field.id, { fileConfig: { ...field.fileConfig, maxFiles: Number(e.target.value) } })}
                                min="1"
                            />
                        </div>
                        <div className="space-y-4 pt-2">
                             <div className="flex items-center justify-between">
                                <Label>Max File Size (MB)</Label>
                                <span className="text-xs text-muted-foreground font-mono">
                                    {!field.fileConfig?.maxSize ? "N/A" : `${field.fileConfig.maxSize} MB`}
                                </span>
                             </div>
                             <Slider 
                                defaultValue={[field.fileConfig?.maxSize ?? 0]}
                                max={50}
                                min={0}
                                step={1}
                                onValueChange={(vals) => onUpdate(field.id, { fileConfig: { ...field.fileConfig, maxSize: vals[0] === 0 ? undefined : vals[0] } })}
                             />
                        </div>
                        <div className="space-y-2">
                            <Label>Allowed File Types</Label>
                            <p className="text-[10px] text-muted-foreground mb-2">Select allowed file categories or specific extensions.</p>
                            <div className="space-y-2">
                                <div className="grid grid-cols-2 gap-2">
                                    <Accordion type="multiple" className="w-full col-span-2">
                                        {Object.entries(fileTypes).map(([category, types]) => {
                                            const currentAllowed = field.fileConfig?.allowedTypes || [];
                                            const categoryMimes = types.map(t => t.mime);
                                            const selectedCount = types.filter(t => currentAllowed.includes(t.mime)).length;
                                            const isAllSelected = selectedCount === types.length && types.length > 0;
                                            const isIndeterminate = selectedCount > 0 && !isAllSelected;
                                            
                                            // Don't show anything if a user clears all types manually using select all, 
                                            // just keep it consistent.
                                            
                                            return (
                                                <AccordionItem value={category} key={category} className="border rounded-md px-3 mb-2">
                                                    <div className="flex items-center py-4">
                                                        <Checkbox
                                                            id={`file-${category}`}
                                                            className="mr-2"
                                                            checked={isAllSelected ? true : (isIndeterminate ? "indeterminate" : false)}
                                                            onCheckedChange={(checked) => {
                                                                let newAllowed = [...currentAllowed];
                                                                if (checked === true) {
                                                                    // Add all missing
                                                                    const toAdd = categoryMimes.filter(m => !newAllowed.includes(m));
                                                                    newAllowed = [...newAllowed, ...toAdd];
                                                                } else {
                                                                    // Remove all present
                                                                    newAllowed = newAllowed.filter(m => !categoryMimes.includes(m));
                                                                }
                                                                onUpdate(field.id, { fileConfig: { ...field.fileConfig, allowedTypes: newAllowed } });
                                                            }}
                                                        />
                                                        <AccordionTrigger className="flex-1 py-0 hover:no-underline font-bold text-sm">
                                                            {category}
                                                            <span className="ml-2 text-[10px] text-muted-foreground font-normal">
                                                                ({selectedCount}/{types.length})
                                                            </span>
                                                        </AccordionTrigger>
                                                    </div>
                                                    <AccordionContent>
                                                        <div className="grid grid-cols-3 gap-2 pl-6 pb-2">
                                                             {types.map((type) => (
                                                                <div key={type.mime} className="flex items-center space-x-1.5">
                                                                    <Checkbox 
                                                                        id={`type-${type.mime}`}
                                                                        className="w-3.5 h-3.5"
                                                                        checked={currentAllowed.includes(type.mime)}
                                                                        onCheckedChange={(checked) => {
                                                                             let newAllowed = [...currentAllowed];
                                                                             if (checked) {
                                                                                 newAllowed.push(type.mime);
                                                                             } else {
                                                                                 newAllowed = newAllowed.filter(m => m !== type.mime);
                                                                             }
                                                                             onUpdate(field.id, { fileConfig: { ...field.fileConfig, allowedTypes: newAllowed } });
                                                                        }}
                                                                    />
                                                                    <Label htmlFor={`type-${type.mime}`} className="text-[10px] font-normal cursor-pointer text-muted-foreground">{type.label}</Label>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            );
                                        })}
                                    </Accordion>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Flex Row Configuration */}
                {field.type === 'flex_row' && (
                    <div className="space-y-4">
                        <Label className="uppercase text-xs font-bold text-muted-foreground">Flex Row Settings</Label>
                        <div className="space-y-2">
                            <Label>Justify Content</Label>
                            <Select 
                                value={field.flexConfig?.justify || "start"} 
                                onValueChange={(val) => onUpdate(field.id, { flexConfig: { ...field.flexConfig, justify: val } })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Justify" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="start">Start</SelectItem>
                                    <SelectItem value="center">Center</SelectItem>
                                    <SelectItem value="end">End</SelectItem>
                                    <SelectItem value="between">Space Between</SelectItem>
                                    <SelectItem value="around">Space Around</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Align Items</Label>
                            <Select 
                                value={field.flexConfig?.align || "center"} 
                                onValueChange={(val) => onUpdate(field.id, { flexConfig: { ...field.flexConfig, align: val } })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Align" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="start">Start</SelectItem>
                                    <SelectItem value="center">Center</SelectItem>
                                    <SelectItem value="end">End</SelectItem>
                                    <SelectItem value="stretch">Stretch</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Gap (px)</Label>
                            <Input 
                                type="number"
                                value={field.flexConfig?.gap ?? 16}
                                onChange={(e) => onUpdate(field.id, { flexConfig: { ...field.flexConfig, gap: Number(e.target.value) } })}
                            />
                        </div>
                    </div>
                )}
                
                {/* Star Rating Configuration */}
                {field.type === 'star_rating' && (
                    <div className="space-y-2">
                        <Label className="uppercase text-xs font-bold text-muted-foreground">Star Rating Settings</Label>
                        <div className="space-y-2">
                            <Label>Max Stars</Label>
                            <Input 
                                type="number"
                                value={field.starRatingConfig?.maxStars ?? 5}
                                onChange={(e) => onUpdate(field.id, { starRatingConfig: { ...field.starRatingConfig, maxStars: Number(e.target.value) } })}
                                min="1"
                                max="10"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Default Value (0-10)</Label>
                            <Input 
                                type="number"
                                value={field.starRatingConfig?.defaultValue ?? 0}
                                onChange={(e) => onUpdate(field.id, { starRatingConfig: { ...field.starRatingConfig, defaultValue: Number(e.target.value) } })}
                                min="0"
                                max="10"
                            />
                        </div>
                    </div>
                )}
                
                {/* Step Configuration for Consecutive Forms */}
                {(field.type === 'input_group' || field.type === 'condition_block' || (settings?.isConsecutive && !['separator', 'title', 'subtitle'].includes(field.type))) && (
                    <div className="space-y-2 pt-4 border-t border-border">
                        <Label className="flex items-center justify-between">
                            <span>Step Title</span>
                            <span className="text-[10px] text-muted-foreground font-normal bg-muted px-1.5 py-0.5 rounded">Consecutive Mode</span>
                        </Label>
                        <Input 
                            value={field.stepTitle || ""} 
                            onChange={(e) => onUpdate(field.id, { stepTitle: e.target.value })}
                            placeholder="e.g. Personal Info"
                        />
                        <p className="text-[10px] text-muted-foreground">Title shown in the multi-step indicator if this element is a step.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// Helper component for uploading images to Convex Storage
const ImageUploadButton = ({ onUploadComplete }: { onUploadComplete: (url: string) => void }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const generateUploadUrl = useMutation(api.authorized.storage.generateUploadUrl as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const saveMedia = useMutation(api.authorized.storage.saveMedia as any);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            // 1. Get upload URL
            const postUrl = await generateUploadUrl();
            
            // 2. Upload file
            const result = await fetch(postUrl, {
                method: "POST",
                headers: { "Content-Type": file.type },
                body: file,
            });
            const { storageId } = await result.json();

            // 3. Save metadata and get URL from backend
            const fileUrl = await saveMedia({
                storageId,
                name: file.name,
                type: file.type,
                size: file.size,
            });

            if (fileUrl) {
                onUploadComplete(fileUrl);
            }
            
        } catch (error) {
            console.error("Upload failed:", error);
            // toast.error("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex gap-2">
            <Input 
                ref={fileInputRef}
                type="file" 
                accept="image/*"
                className="hidden" 
                onChange={handleUpload}
            />
            <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
            >
                {uploading ? (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                    </>
                ) : (
                    <>
                        <FileText className="w-4 h-4 mr-2" />
                        Choose Image
                    </>
                )}
            </Button>
        </div>
    );
};
