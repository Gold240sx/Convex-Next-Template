"use client"

import React, { useState, useRef, useEffect, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { useQuery, useMutation, useAction } from "convex/react"
import { api } from "~/convex/_generated/api"
import { batch } from '@tanstack/pacer'
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
    XCircle,
    Folder,
    Settings,
    Save,
    Cloud,
    Loader2,
    CloudUpload,
    Image as ImageIcon,
    FileUp,
    SlidersHorizontal,
    Columns,
    Star,
    Smile,
    CalendarRange,
    FileText,
    Palette
} from "lucide-react"
import { inputTypes } from "@/components/admin/forms/builder/constants"
import { PropertiesPanel } from "@/components/admin/forms/builder/PropertiesPanel"
import { FieldRenderer } from "@/components/admin/forms/builder/FieldRenderer"
import { updateFieldInTree, removeFieldFromTree, insertFieldInTree, FormField } from "@/components/admin/forms/builder/form-builder-utils"
import { FormBuilderContext } from "@/components/admin/forms/builder/FormBuilderContext"
import { RichTextEditor } from "@/components/admin/RichTextEditor"
import { useNativeAddressToStripeConvert, useNativeAddressToGoogleConvert } from "@/hooks/useAddressConverters"
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
import { Calendar as CalendarIcon } from "lucide-react" 
// Note: We need to rename the Lucide icon import if we import Shadcn Calendar, 
// but for now I'll just use a visual mockup or simple input [type=date] if simpler, 
// or import Shadcn Calendar as DatePicker component if available.
// Let's assume we don't have full Shadcn Calendar setup in this file yet.
// I will use a simple visual representation for now or import input type="date".
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








export default function FormBuilderPage() {
    const params = useParams()
    const router = useRouter()
    const formId = params.formId as any
    
    const form = useQuery(api.myFunctions.getCustomFormById, { id: formId })
    const updateForm = useMutation(api.myFunctions.updateCustomForm)

    // Local State & Auto-Save Batching
    const [localFields, setLocalFields] = useState<FormField[] | null>(null)
    const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved')
    const fieldsRef = useRef<FormField[]>([])

    // Sync Ref for batcher
    useEffect(() => {
        if (localFields) fieldsRef.current = localFields;
    }, [localFields]);

    // Initialize local state from DB
    useEffect(() => {
        if (form && form.fields && localFields === null) {
            setLocalFields(form.fields);
            fieldsRef.current = form.fields;
        }
    }, [form, localFields]); // Added localFields to dependency array to prevent re-initialization if localFields is set to null elsewhere

    // Batch Save Logic
    const processSave = batch(
        async (items: number[]) => {
            setSaveStatus('saving');
            try {
                await updateForm({ id: formId, fields: fieldsRef.current });
                setSaveStatus('saved');
            } catch (err) {
                console.error("Auto-save failed:", err);
                setSaveStatus('unsaved');
            }
        },
        { 
            maxSize: 3, 
            wait: 2000 
        }
    );

    const queueUpdate = (newFields: FormField[]) => {
        setLocalFields(newFields);
        setSaveStatus('unsaved');
        processSave(1);
    };

    const [draggedType, setDraggedType] = useState<string | null>(null)
    const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null)
    const [isRTFModalOpen, setIsRTFModalOpen] = useState(false)
    const [editingRTFFieldId, setEditingRTFFieldId] = useState<string | null>(null)
    const [rtfContent, setRTFContent] = useState("")

    const openRTFEditor = (fieldId: string, content: string) => {
        setEditingRTFFieldId(fieldId)
        setRTFContent(content || "")
        setIsRTFModalOpen(true)
    }

    const handleSaveRTF = () => {
        if (editingRTFFieldId) {
            handleUpdateField(editingRTFFieldId, { content: rtfContent })
        }
        setIsRTFModalOpen(false)
        setEditingRTFFieldId(null)
    }

    const handleDragStart = (e: React.DragEvent, id: string, type: 'field' | 'new') => {
        if (type === 'new') {
             e.dataTransfer.setData("type", id); // id is the input type string here
             setDraggedType('new');
        } else {
             e.dataTransfer.setData("fieldId", id);
             setDraggedType('field');
        }
    };

    if (!form || localFields === null) { // Wait for form and localFields to be initialized
        return (
             <div className="flex flex-col h-[60vh] items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin" />
            </div>
        )
    }

    // Use local fields for rendering
    const activeFields = localFields || [];

    const handleUpdateField = (id: string, updates: Partial<FormField>) => {
        if (!localFields) return;
        const newFields = updateFieldInTree(localFields, id, updates);
        queueUpdate(newFields);
    }

    const handleRemoveField = (id: string) => {
        if (!localFields) return;
        const newFields = removeFieldFromTree(localFields, id);
        // If removing selected field, deselect it
        if (selectedFieldId === id) setSelectedFieldId(null);
        queueUpdate(newFields);
    }
    
    // Manual Force Save
    const handleForceSave = async () => {
        if (!localFields) return;
        setSaveStatus('saving');
        await updateForm({ id: formId, fields: localFields });
        setSaveStatus('saved');
    }

    const handleDrop = async (e: React.DragEvent, targetId?: string, position?: 'before' | 'after' | 'inside') => {
        e.preventDefault();
        setDraggedType(null);

        const type = e.dataTransfer.getData("type");
        const draggedFieldId = e.dataTransfer.getData("fieldId");

        if (!localFields) return;

        let newFields = [...localFields];

        if (type) {
             // Adding New Field
             // ... (Logic for new field creation) ...
             const newFieldId = crypto.randomUUID();
             const newFieldLabel = inputTypes.find(t => t.type === type)?.label || "New Field";
             
             const newField: any = {
                 id: newFieldId,
                 type,
                 label: newFieldLabel,
                 required: false,
                 children: (type === 'condition_block' || type === 'input_group' || type === 'flex_row') ? [] : undefined
             };

             if (type === 'select' || type === 'radio' || type === 'checkbox') {
                 newField.options = ["Option 1", "Option 2"];
             }
             if (type === 'color_picker') {
                 newField.options = ["#ef4444", "#f97316", "#f59e0b", "#10b981", "#3b82f6", "#6366f1", "#8b5cf6", "#d946ef"];
             }
             if (type === 'richtext') {
                 newField.content = "<p>This is a new rich text field. Click 'Edit Rich Content' to modify.</p>";
             }

             if (targetId) {
                  // Insert relative to target
                  newFields = insertFieldInTree(newFields, newField, targetId, position || 'after');
             } else {
                  // Append to root
                  newFields.push(newField);
             }
             
             queueUpdate(newFields);
             // Select the new field immediately
             setSelectedFieldId(newFieldId);
        } else if (draggedFieldId) {
             // Reordering Existing Field
             if (draggedFieldId === targetId) return; // Dropped on self

             // 1. Remove from old location
             const fieldToMove = allFlatFields.find(f => f.id === draggedFieldId);
             if (!fieldToMove) return;

             // Remove first
             newFields = removeFieldFromTree(newFields, draggedFieldId);

             // 2. Insert at new location
             if (targetId) {
                  newFields = insertFieldInTree(newFields, fieldToMove, targetId, position || 'after');
             } else {
                  // Dropped on root container
                  newFields.push(fieldToMove);
             }

             queueUpdate(newFields);
        }
    };



    // Flatten all fields for the Condition logic dropdown (so you can target any field on the form)
    // Actually we probably want a flat list of all "data" fields (not blocks)
    const getAllFieldsFlat = (nodes: FormField[]): FormField[] => {
        let flat: any[] = [];
        nodes.forEach(node => {
            flat.push(node);
            if (node.children) {
                flat = [...flat, ...getAllFieldsFlat(node.children)];
            }
        });
        return flat;
    };

    const allFlatFields = localFields ? getAllFieldsFlat(localFields) : (form.fields ? getAllFieldsFlat(form.fields) : []);

    return (
        <FormBuilderContext.Provider value={{ openRTFEditor }}>
            <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-6 h-[calc(100vh-80px)]">
             <div className="flex items-center gap-4 border-b border-border pb-6 shrink-0">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-3xl font-black uppercase italic tracking-tighter text-foreground">{form.name}</h1>
                    <p className="text-muted-foreground">{form.description}</p>
                </div>

                <div className="flex items-center gap-2 ml-auto">
                    {saveStatus === 'saving' && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full animate-pulse transition-all">
                             <Loader2 className="w-3 h-3 animate-spin"/>
                             <span>Saving...</span>
                        </div>
                    )}
                    {saveStatus === 'unsaved' && (
                        <Button 
                            variant="outline" size="sm" 
                            onClick={handleForceSave}
                            className="bg-yellow-500/10 border-yellow-500/20 text-yellow-600 hover:bg-yellow-500/20 gap-2 h-8"
                        >
                            <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                            <span className="text-xs">Unsaved</span>
                            <CloudUpload className="w-3 h-3 ml-1" />
                        </Button>
                    )}
                    {saveStatus === 'saved' && (
                         <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 transition-all">
                             <Cloud className="w-3 h-3"/>
                             <span>Saved</span>
                        </div>
                    )}
                    
                    {/* Form Settings Button */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" size="default" className="gap-2">
                                <Settings className="w-5 h-5" />
                                <span>Form Settings</span>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80" align="end">
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold mb-1">Form Settings</h4>
                                    <p className="text-xs text-muted-foreground">Configure form-level options</p>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Consecutive Mode</Label>
                                        <p className="text-xs text-muted-foreground">Show one step at a time</p>
                                    </div>
                                    <Switch 
                                        checked={form.settings?.isConsecutive ?? false} 
                                        onCheckedChange={(c) => updateForm({ id: formId, settings: { ...form.settings, isConsecutive: c } })}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                                    When enabled, Groups, Condition Blocks, and lone inputs act as steps in a multi-step form.
                                </p>
                                <Separator />
                                <div className="space-y-2">
                                    <Label>Completion Email (Optional)</Label>
                                    <Select 
                                        value={form.settings?.completionEmail || "none"} 
                                        onValueChange={(val) => updateForm({ id: formId, settings: { ...form.settings, completionEmail: val === "none" ? undefined : val } })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="No email" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">No Email</SelectItem>
                                            <SelectItem value="gen-inquiry">General Inquiry Confirmation</SelectItem>
                                            <SelectItem value="chat-message">Chat Message Confirmation</SelectItem>
                                            <SelectItem value="DGP-subscriber-welcome-email">Welcome Email</SelectItem>
                                            <SelectItem value="basic-email-template">Basic Template</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-muted-foreground">
                                        Email template to send to user upon form completion
                                    </p>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Chatbot Access</Label>
                                        <p className="text-xs text-muted-foreground">Allow chatbot to recommend this form</p>
                                    </div>
                                    <Switch 
                                        checked={form.settings?.chatbotAccess ?? false} 
                                        onCheckedChange={(c) => updateForm({ id: formId, settings: { ...form.settings, chatbotAccess: c } })}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                                    When enabled, the chatbot can suggest this form to users based on their requests.
                                </p>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            <div className="flex w-full h-full gap-8 pb-20">
                {/* Visual Canvas - Paper Style - With QR Background */}
                <div 
                    className={cn(
                        "flex-1 bg-accent/20 border border-border/50 rounded-xl p-4 overflow-y-auto bg-[url(/QR-bg.svg)] dark:bg-[url(/QR-bg-dark.svg)]",
                        draggedType && "border-2 border-dashed border-primary"
                    )}
                    onClick={() => {
                        setSelectedFieldId(null);
                    }}
                >
                    <div 
                        className="max-w-[920px] mx-auto bg-background h-full min-h-[600px] rounded-xl shadow-xl shadow-black/5 border border-border/50 flex flex-col items-center justify-start py-10 px-6 space-y-4 relative" 
                        onClick={(e) => e.stopPropagation()}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDrop(e)}
                    >
                        {draggedType && (
                            <div 
                                className="absolute inset-0 bg-primary/5 border-primary/20 border-2 border-dashed rounded-xl z-20 flex items-center justify-center pointer-events-none animate-pulse"
                                style={{ pointerEvents: 'none' }}
                            >
                                <span className="text-primary font-bold bg-background/90 px-6 py-3 rounded-full shadow-sm backdrop-blur-sm border border-primary/20">
                                    Drop Element Here
                                </span>
                            </div>
                        )}

                        <div className="w-full">
                            <FieldRenderer 
                                fields={activeFields} 
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
                            field={allFlatFields.find(f => f.id === selectedFieldId)!} 
                            allFields={allFlatFields}
                            onUpdate={handleUpdateField}
                            onClose={() => setSelectedFieldId(null)}
                            settings={form.settings}
                         />
                    ) : (
                        <div className="bg-card border border-border rounded-xl p-6 shadow-sm h-full overflow-y-auto">
                            <div className="mb-4">
                                <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Input Elements</h3>
                            </div>
                            <Separator className="my-4" />
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                {inputTypes.map((item) => (
                                    <div 
                                        key={item.type}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, item.type, 'new')}
                                        className="flex flex-col items-center justify-center gap-2 w-full aspect-square bg-background border border-border rounded-xl cursor-grab active:cursor-grabbing hover:border-teal-500 hover:text-teal-500 hover:shadow-lg hover:shadow-teal-500/10 transition-all group p-2 text-center"
                                    >
                                        <div className="p-2 rounded-lg bg-muted group-hover:bg-teal-500/10 transition-colors">
                                            <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-teal-600 transition-colors" />
                                        </div>
                                        <p className="text-[10px] font-bold uppercase tracking-tight text-muted-foreground group-hover:text-teal-600 transition-colors leading-tight">
                                            {item.label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* RTF Modal Editor */}
            <Dialog open={isRTFModalOpen} onOpenChange={setIsRTFModalOpen}>
                <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0 overflow-hidden border-none bg-zinc-950 shadow-2xl rounded-3xl">
                    <DialogHeader className="p-8 border-b border-zinc-800 bg-zinc-900/50">
                        <DialogTitle className="text-3xl font-black uppercase italic tracking-tighter flex items-center gap-3">
                            <span className="p-2.5 rounded-2xl bg-teal-500/10 text-teal-500 border border-teal-500/20">
                                <FileText className="w-7 h-7" />
                            </span>
                            Edit Rich Content
                        </DialogTitle>
                        <DialogDescription className="text-zinc-400 text-sm">
                            Create beautiful, formatted content for your form. Supports headings, bold/italic, lists, links, and more.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto p-8 bg-zinc-950 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                        <RichTextEditor 
                            content={rtfContent}
                            onChange={setRTFContent}
                            placeholder="Type your content here..."
                        />
                    </div>

                    <DialogFooter className="p-8 border-t border-zinc-800 bg-zinc-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                            Live Preview Active
                        </div>
                        <div className="flex gap-3 w-full sm:w-auto">
                            <Button 
                                variant="ghost" 
                                className="flex-1 sm:flex-none text-zinc-400 hover:text-white"
                                onClick={() => setIsRTFModalOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button 
                                onClick={handleSaveRTF} 
                                className="flex-1 sm:flex-none bg-teal-600 hover:bg-teal-500 text-white font-bold px-10 shadow-lg shadow-teal-500/20 h-11"
                            >
                                Save Content
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            </div>
        </FormBuilderContext.Provider>
    )
}


