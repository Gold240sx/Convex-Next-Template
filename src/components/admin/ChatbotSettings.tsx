"use client"

import React, { useState, useEffect } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "~/convex/_generated/api"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { 
    Bot, 
    Save, 
    RotateCcw, 
    Sparkles, 
    Settings2, 
    Database, 
    Cpu,
    Thermometer,
    CheckCircle2
} from "lucide-react"
import { Button } from "@/components/shadcn/button"
import { Textarea } from "@/components/shadcn/textarea"
import { Input } from "@/components/shadcn/input"
import { cn } from "@/lib/utils"

const DEFAULT_SYSTEM_PROMPT = `You are a helpful assistant for Michael Martell's website. 
Use the following website information to answer user questions. 

If you cannot find the answer in the provided info, be honest and say you don't have that specific information.
Always be polite, professional, and concise.`

const DEFAULT_KNOWLEDGE_BASE = `
<url>
<loc>https://michaelmartell.com/</loc>
<desc>Michael Martell - Full Stack Developer & AI Engineer Portfolio 2026.</desc>
</url>
<url>
<loc>https://davidsGarage.pro/</loc>
<desc>The premier garage repair and installation servicer in the Twin Cities!</desc>
</url>
<url>
<loc>https://davidsgarage.pro/services.html</loc>
<desc>An overview about our services</desc>
</url>
`

export function ChatbotSettings() {
    const settings = useQuery(api.myFunctions.getChatbotSettings)
    const updateSettings = useMutation(api.myFunctions.updateChatbotSettings)
    
    const [formData, setFormData] = useState({
        systemPrompt: "",
        knowledgeBase: "",
        model: "gpt-4o-mini",
        temperature: 0.7
    })

    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        if (settings) {
            setFormData({
                systemPrompt: settings.systemPrompt,
                knowledgeBase: settings.knowledgeBase,
                model: settings.model,
                temperature: settings.temperature
            })
        } else if (settings === null) {
            // Initial defaults if nothing in DB
            setFormData({
                systemPrompt: DEFAULT_SYSTEM_PROMPT,
                knowledgeBase: DEFAULT_KNOWLEDGE_BASE,
                model: "gpt-4o-mini",
                temperature: 0.7
            })
        }
    }, [settings])

    const hasChanges = settings ? (
        formData.systemPrompt !== settings.systemPrompt ||
        formData.knowledgeBase !== settings.knowledgeBase ||
        formData.model !== settings.model ||
        formData.temperature !== settings.temperature
    ) : (
        formData.systemPrompt !== DEFAULT_SYSTEM_PROMPT ||
        formData.knowledgeBase !== DEFAULT_KNOWLEDGE_BASE ||
        formData.model !== "gpt-4o-mini" ||
        formData.temperature !== 0.7
    )

    const handleSave = async (e?: React.FormEvent) => {
        e?.preventDefault()
        setIsSaving(true)
        try {
            await updateSettings(formData)
            toast.success("Settings saved to database")
        } catch (err) {
            toast.error("Failed to update chatbot settings")
        } finally {
            setIsSaving(false)
        }
    }

    const resetToDefaults = () => {
        setFormData({
            systemPrompt: DEFAULT_SYSTEM_PROMPT,
            knowledgeBase: DEFAULT_KNOWLEDGE_BASE,
            model: "gpt-4o-mini",
            temperature: 0.7
        })
        toast.info("Form reset to hardcoded defaults (Click Save to persist)")
    }

    if (settings === undefined) {
        return (
            <div className="w-full h-64 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-2xl relative">
                {/* Header Decoration */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 via-sky-500 to-indigo-500" />
                
                <div className="p-8 md:p-10 space-y-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-teal-500/10 rounded-2xl border border-teal-500/20">
                                    <Bot className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                                </div>
                                <h2 className="text-3xl font-black text-foreground italic uppercase tracking-tight">AI Configuration</h2>
                                {!settings && (
                                    <span className="px-3 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">
                                        Not Peristed Yet
                                    </span>
                                )}
                                {settings && (
                                    <span className="px-3 py-1 bg-teal-500/10 border border-teal-500/20 text-teal-500 rounded-full text-[10px] font-black uppercase tracking-widest">
                                        Active in Database
                                    </span>
                                )}
                            </div>
                            <p className="text-muted-foreground font-medium pl-1">
                                Fine-tune your chatbot's personality, knowledge, and AI model parameters.
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <Button 
                                variant="outline" 
                                onClick={resetToDefaults}
                                className="rounded-2xl border-border bg-background hover:bg-muted font-black text-[10px] uppercase tracking-widest h-12 px-6"
                            >
                                <RotateCcw className="w-4 h-4 mr-2 text-rose-500" /> Reset
                            </Button>
                            <Button 
                                onClick={() => handleSave()}
                                disabled={isSaving || !hasChanges}
                                className={cn(
                                    "rounded-2xl font-black text-[10px] uppercase tracking-widest h-12 px-6 shadow-xl transition-all duration-300",
                                    hasChanges 
                                        ? "bg-teal-600 hover:bg-teal-500 text-white shadow-teal-600/20" 
                                        : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-none pointer-events-none"
                                )}
                            >
                                {isSaving ? (
                                    <RotateCcw className="w-4 h-4 mr-2 animate-spin" />
                                ) : hasChanges ? (
                                    <Save className="w-4 h-4 mr-2" />
                                ) : (
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                )}
                                {isSaving ? "Saving..." : hasChanges ? "Save Changes" : "Saved"}
                            </Button>
                        </div>
                    </div>

                    <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* Left Column: Instructions */}
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                                    <Sparkles className="w-3.5 h-3.5" /> System Instructions
                                </label>
                                <Textarea 
                                    value={formData.systemPrompt}
                                    onChange={(e) => setFormData({...formData, systemPrompt: e.target.value})}
                                    placeholder="Enter how the AI should behave..."
                                    className="min-h-[200px] rounded-2xl bg-muted/50 border-border focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium text-sm leading-relaxed"
                                />
                                <p className="text-[10px] text-muted-foreground font-bold italic uppercase tracking-wider">
                                    This defines the chatbot's role, tone, and overall constraints.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                                        <Cpu className="w-3.5 h-3.5" /> Model
                                    </label>
                                    <select 
                                        value={formData.model}
                                        onChange={(e) => setFormData({...formData, model: e.target.value})}
                                        className="w-full h-14 rounded-2xl bg-muted/50 border border-border px-4 font-black text-xs uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="gpt-4o-mini">GPT-4o Mini (Fast)</option>
                                        <option value="gpt-4o">GPT-4o (Smart)</option>
                                        <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                                    </select>
                                </div>
                                
                                <div className="space-y-4">
                                    <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                                        <Thermometer className="w-3.5 h-3.5" /> Temperature
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <Input 
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            max="2"
                                            value={formData.temperature}
                                            onChange={(e) => setFormData({...formData, temperature: parseFloat(e.target.value)})}
                                            className="h-14 rounded-2xl bg-muted/50 border-border font-black text-sm text-center"
                                        />
                                        <div className="hidden md:block w-full bg-muted/30 h-1.5 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-teal-500 transition-all duration-500"
                                                style={{ width: `${(formData.temperature / 2) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Knowledge Base */}
                        <div className="space-y-4">
                            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                                <Database className="w-3.5 h-3.5" /> Website Knowledge Base
                            </label>
                            <Textarea 
                                value={formData.knowledgeBase}
                                onChange={(e) => setFormData({...formData, knowledgeBase: e.target.value})}
                                placeholder="Paste website content, URLs, and descriptions in XML or Markdown format..."
                                className="min-h-[432px] rounded-2xl bg-muted/50 border-border focus:ring-teal-500/20 focus:border-teal-500 transition-all font-mono text-[11px] leading-relaxed"
                            />
                            <div className="flex items-center justify-between">
                                <p className="text-[10px] text-muted-foreground font-bold italic uppercase tracking-wider">
                                    The AI uses this data as its primary source of truth.
                                </p>
                                <span className="text-[10px] font-black text-teal-600 dark:text-teal-400 uppercase tracking-tighter">
                                    {formData.knowledgeBase.length} Characters
                                </span>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Quick Tips / Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { icon: Settings2, title: "Context Aware", desc: "AI remembers recent conversation turns." },
                    { icon: Sparkles, title: "Premium Models", desc: "Using OpenAI's latest flagship models." },
                    { icon: Database, title: "Stored in DB", desc: "Settings persist across all sessions." },
                ].map((item, i) => (
                    <div key={i} className="bg-card border border-border rounded-3xl p-6 flex items-start gap-4 shadow-sm">
                        <div className="p-2 bg-muted rounded-xl">
                            <item.icon className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-[10px] font-black uppercase tracking-widest">{item.title}</h4>
                            <p className="text-xs text-muted-foreground font-medium">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    )
}
