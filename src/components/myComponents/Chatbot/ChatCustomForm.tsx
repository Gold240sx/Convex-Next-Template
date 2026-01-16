"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "~/convex/_generated/api"
import { Button } from "@/components/shadcn/button"
import { Label } from "@/components/shadcn/label"
import { Loader2, CheckCircle2, AlertCircle, ArrowLeft, Send } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

import {
    TextField,
    TextAreaField,
    NumberField,
    SelectField,
    RadioField,
    CheckboxField,
    DateField,
    StarRatingField,
    HappinessRatingField,
    SliderField
} from "../forms/fields"

interface ChatCustomFormProps {
    slug: string
    onSuccess?: () => void
    onCancel?: () => void
}

export default function ChatCustomForm({ slug, onSuccess, onCancel }: ChatCustomFormProps) {
    const form = useQuery(api.myFunctions.getCustomFormBySlug, { slug })
    const submitForm = useMutation(api.formSubmissions.create)
    
    const [formData, setFormData] = useState<Record<string, any>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isCompleted, setIsCompleted] = useState(false)

    // Initialize form data with defaults if needed
    useEffect(() => {
        if (form && form.fields) {
            const initialData: Record<string, any> = {}
            const traverse = (fields: any[]) => {
                fields.forEach(field => {
                    if (field.id && !['title', 'subtitle', 'separator', 'condition_block', 'input_group', 'flex_row'].includes(field.type)) {
                        initialData[field.id] = field.type === 'checkbox' ? [] : 
                                               field.type === 'boolean' ? false : 
                                               field.type === 'number' ? 0 : "";
                    }
                    if (field.children) traverse(field.children)
                })
            }
            traverse(form.fields)
            setFormData(initialData)
        }
    }, [form])

    const handleFieldChange = (id: string, value: any) => {
        setFormData(prev => ({ ...prev, [id]: value }))
    }

    const checkCondition = (rule: any) => {
        if (!rule || !rule.fieldId) return true;
        
        const value = formData[rule.fieldId];
        const targetValue = rule.value;

        switch (rule.operator) {
            case 'eq': return String(value) === String(targetValue);
            case 'neq': return String(value) !== String(targetValue);
            case 'contains': return String(value).includes(String(targetValue));
            case 'gt': return Number(value) > Number(targetValue);
            case 'lt': return Number(value) < Number(targetValue);
            default: return true;
        }
    }

    const renderFields = (fields: any[]) => {
        return fields.map(field => {
            // Check condition for condition blocks
            if (field.type === 'condition_block') {
                if (!checkCondition(field.conditionRule)) return null;
                return <div key={field.id} className="space-y-4 border-l-2 border-teal-500/30 pl-4 py-2 my-2 bg-teal-500/5 rounded-r-lg animate-in fade-in slide-in-from-left-2 duration-300">
                    {renderFields(field.children || [])}
                </div>;
            }

            // Layout containers
            if (field.type === 'input_group') {
                return <div key={field.id} className="space-y-4 pb-2">
                    {field.label && <h4 className="text-xs font-bold uppercase tracking-wider text-teal-500/70 mb-2">{field.label}</h4>}
                    {renderFields(field.children || [])}
                </div>;
            }

            if (field.type === 'flex_row') {
                return (
                    <div 
                        key={field.id} 
                        className="flex flex-wrap gap-4"
                        style={{
                            justifyContent: field.flexConfig?.justify || 'start',
                            alignItems: field.flexConfig?.align || 'center',
                        }}
                    >
                        {renderFields(field.children || [])}
                    </div>
                );
            }

            // Static elements
            if (field.type === 'title') return <h3 key={field.id} className="text-xl font-bold text-white mt-4">{field.label}</h3>;
            if (field.type === 'subtitle') return <p key={field.id} className="text-sm text-zinc-400 mb-2">{field.label}</p>;
            if (field.type === 'separator') return <hr key={field.id} className="border-zinc-800 my-4" />;

            // Actual form fields
            const commonProps = {
                key: field.id,
                label: field.label,
                placeholder: field.placeholder,
                required: field.required,
                helpText: field.helpText,
                disabled: isSubmitting,
                value: formData[field.id],
                onChange: (val: any) => handleFieldChange(field.id, val),
                className: "text-white"
            }

            switch (field.type) {
                case 'text':
                case 'email':
                case 'phone':
                    return <TextField {...commonProps} type={field.type} regexPattern={field.regexPattern} />;
                case 'textarea':
                    return <TextAreaField {...commonProps} rows={field.textareaConfig?.rows || 3} />;
                case 'number':
                    return <NumberField {...commonProps} min={field.validation?.min} max={field.validation?.max} />;
                case 'select':
                    return <SelectField {...commonProps} options={field.options || []} />;
                case 'radio':
                    return <RadioField {...commonProps} options={field.options || []} />;
                case 'checkbox':
                    return <CheckboxField {...commonProps} checked={formData[field.id] || false} />;
                case 'date':
                    return <DateField {...commonProps} />;
                case 'star_rating':
                    return <StarRatingField {...commonProps} maxStars={field.starRatingConfig?.maxStars} />;
                case 'happiness_rating':
                    return <HappinessRatingField {...commonProps} />;
                case 'slider':
                    return <SliderField {...commonProps} min={field.sliderConfig?.min} max={field.sliderConfig?.max} step={field.sliderConfig?.step} />;
                case 'richtext':
                    return (
                        <div key={field.id} className="space-y-2">
                            {field.label && <Label className="text-sm font-bold text-white">{field.label}</Label>}
                            <div 
                                className="prose prose-sm dark:prose-invert max-w-none text-zinc-300 bg-zinc-950/30 p-4 rounded-xl border border-zinc-800"
                                dangerouslySetInnerHTML={{ __html: field.content || "" }}
                            />
                        </div>
                    );
                case 'color_picker':
                    return (
                        <div key={field.id} className="space-y-3">
                            {field.label && <Label className="text-sm font-bold text-white">{field.label}</Label>}
                            <div className="flex flex-wrap gap-2">
                                {field.options?.map((color: string, i: number) => (
                                    <button
                                        key={i}
                                        type="button"
                                        className={cn(
                                            "w-8 h-8 rounded-full border-2 transition-all hover:scale-110",
                                            formData[field.id] === color 
                                                ? "border-white scale-110 shadow-lg shadow-white/20" 
                                                : "border-zinc-800"
                                        )}
                                        style={{ backgroundColor: color }}
                                        onClick={() => handleFieldChange(field.id, color)}
                                        title={color}
                                    />
                                ))}
                            </div>
                            {formData[field.id] && (
                                <p className="text-[10px] text-zinc-500 font-mono">
                                    Selected: {formData[field.id]}
                                </p>
                            )}
                        </div>
                    );
                default:
                    return null;
            }
        });
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form) return
        
        setIsSubmitting(true)
        try {
            // Find submitter email and name if present
            const emailFieldId = form.fields.find(f => f.type === 'email')?.id;
            const nameFieldId = form.fields.find(f => f.label.toLowerCase().includes('name'))?.id;

            await submitForm({
                formId: form._id,
                formName: form.name,
                submitterEmail: emailFieldId ? formData[emailFieldId] : undefined,
                submitterName: nameFieldId ? formData[nameFieldId] : undefined,
                data: formData
            })
            
            setIsCompleted(true)
            toast.success("Thank you! Your submission has been received.")
            if (onSuccess) onSuccess()
        } catch (error) {
            console.error("Submission error:", error)
            toast.error("Failed to submit form. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!form) {
        return (
            <div className="p-12 flex flex-col items-center justify-center space-y-3">
                <Loader2 className="w-6 h-6 text-teal-500 animate-spin" />
                <p className="text-xs text-zinc-500">Loading form...</p>
            </div>
        )
    }

    if (isCompleted) {
        return (
            <div className="p-8 text-center animate-in zoom-in duration-500">
                <div className="w-16 h-16 bg-teal-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-teal-500/20">
                    <CheckCircle2 className="w-10 h-10 text-teal-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Submission Received!</h3>
                <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                    Thanks for filling out the <strong>{form.name}</strong>. I've received your information and will review it shortly.
                </p>
                <Button 
                    variant="outline" 
                    className="border-zinc-700 hover:bg-zinc-800 text-zinc-300"
                    onClick={onCancel}
                >
                    Back to chat
                </Button>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full bg-zinc-900 border-t border-zinc-800 rounded-t-2xl animate-in slide-in-from-bottom-4 duration-500">
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/50 rounded-t-2xl">
                <div className="flex items-center gap-3">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-zinc-400 hover:text-white"
                        onClick={onCancel}
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div>
                        <h3 className="text-sm font-bold text-white">{form.name}</h3>
                        <p className="text-[10px] text-zinc-500">Directly embedded in chat</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                {form.description && (
                    <div className="bg-teal-500/5 border border-teal-500/20 rounded-xl p-3 mb-2">
                        <p className="text-xs text-zinc-300 leading-relaxed italic">{form.description}</p>
                    </div>
                )}

                <form id="chat-custom-form" onSubmit={handleSubmit} className="space-y-6 pb-4">
                    {renderFields(form.fields)}
                </form>
            </div>

            <div className="p-4 bg-zinc-950/50 border-t border-zinc-800 flex gap-3">
                <Button 
                    variant="ghost" 
                    className="flex-1 text-xs text-zinc-400 hover:text-white"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>
                <Button 
                    form="chat-custom-form"
                    type="submit" 
                    className="flex-[2] bg-teal-600 hover:bg-teal-500 text-white font-bold h-10 shadow-lg shadow-teal-500/20"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Submitting...
                        </>
                    ) : (
                        <>
                            <Send className="w-3 h-3 mr-2" />
                            Submit {form.name}
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}
