"use client"

import React, { useState, useEffect } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "~/convex/_generated/api"
import { RichTextEditor } from "./RichTextEditor"
import { Button } from "@/components/shadcn/button"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { 
    User, 
    Save, 
    RotateCcw, 
    CheckCircle2, 
    Sparkles, 
    Eye,
    StickyNote
} from "lucide-react"
import { cn } from "@/lib/utils"

export function AboutPageEditor() {
    const content = useQuery(api.myFunctions.getSiteContent, { key: "about_me" })
    const updateContent = useMutation(api.myFunctions.updateSiteContent)
    
    const [editorContent, setEditorContent] = useState("")
    const [isSaving, setIsSaving] = useState(false)
    const [showPreview, setShowPreview] = useState(false)

    useEffect(() => {
        if (content) {
            setEditorContent(content.content)
        }
    }, [content])

    const hasChanges = content ? editorContent !== content.content : editorContent !== ""

    const handleSave = async () => {
        setIsSaving(true)
        try {
            await updateContent({ key: "about_me", content: editorContent })
            toast.success("About page content saved")
        } catch (err) {
            toast.error("Failed to save content")
        } finally {
            setIsSaving(false)
        }
    }

    const handleReset = () => {
        if (content) {
            setEditorContent(content.content)
        } else {
            setEditorContent("")
        }
        toast.info("Changes discarded")
    }

    if (content === undefined) {
        return (
            <div className="flex items-center justify-center p-20">
                <div className="w-8 h-8 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border pb-10">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-teal-500/10 rounded-2xl border border-teal-500/20">
                            <User className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                        </div>
                        <h2 className="text-3xl font-black text-foreground italic uppercase tracking-tight">About Me Content</h2>
                    </div>
                    <p className="text-muted-foreground font-medium tracking-wide max-w-2xl text-sm italic">
                        Use the rich text editor below to craft your story. This content will be displayed on the public "About" section of your portfolio.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={() => setShowPreview(!showPreview)}
                        className={cn(
                            "rounded-2xl border-border bg-background transition-all font-black text-[10px] uppercase tracking-widest h-12 px-6",
                            showPreview && "bg-zinc-100 dark:bg-zinc-900 border-teal-500/50"
                        )}
                    >
                        <Eye className={cn("w-4 h-4 mr-2", showPreview ? "text-teal-500" : "text-muted-foreground")} /> 
                        {showPreview ? "Back to Editor" : "Preview"}
                    </Button>
                    <Button 
                        variant="outline" 
                        onClick={handleReset}
                        disabled={!hasChanges || isSaving}
                        className="rounded-2xl border-border bg-background hover:bg-muted font-black text-[10px] uppercase tracking-widest h-12 px-6 disabled:opacity-0"
                    >
                        <RotateCcw className="w-4 h-4 mr-2 text-rose-500" /> Discard
                    </Button>
                    <Button 
                        onClick={handleSave}
                        disabled={isSaving || !hasChanges}
                        className={cn(
                            "rounded-2xl font-black text-[10px] uppercase tracking-widest h-12 px-8 shadow-xl transition-all duration-300",
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
                        {isSaving ? "Saving..." : hasChanges ? "Save Content" : "Saved"}
                    </Button>
                </div>
            </div>

            <main className="grid grid-cols-1 gap-10">
                <AnimatePresence mode="wait">
                    {showPreview ? (
                        <motion.div
                            key="preview"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="bg-card border border-border rounded-[2rem] p-8 md:p-12 shadow-inner min-h-[500px]"
                        >
                            <div className="max-w-4xl mx-auto prose prose-teal dark:prose-invert" 
                                dangerouslySetInnerHTML={{ __html: editorContent || "<p className='text-muted-foreground italic text-center py-20 uppercase tracking-[0.2em] font-black'>No content to display yet...</p>" }} 
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="editor"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="relative group"
                        >
                            <div className="absolute -top-3 left-8 px-4 bg-background border border-border rounded-full z-20 text-[10px] font-black uppercase tracking-widest text-zinc-500 transition-all group-focus-within:text-teal-500 group-focus-within:border-teal-500">
                                Rich Text Environment
                            </div>
                            <RichTextEditor 
                                content={editorContent} 
                                onChange={setEditorContent} 
                                placeholder="Write your professional bio, experience, and what makes you unique..."
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Formatting Help */}
            {!showPreview && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { icon: Sparkles, title: "Rich Formats", desc: "Support for headings, bold, lists and blockquotes." },
                        { icon: StickyNote, title: "Auto-Save Prefs", desc: "Changes persist locally while you edit." },
                        { icon: User, title: "Personal Brand", desc: "Craft your story for potential clients." },
                        { icon: CheckCircle2, title: "Live Preview", desc: "Instantly see how your text looks." },
                    ].map((tip, i) => (
                        <div key={i} className="bg-card border border-border rounded-3xl p-5 flex items-start gap-4 shadow-sm group hover:border-teal-500/30 transition-colors">
                            <div className="p-2 bg-muted rounded-xl group-hover:bg-teal-500/10 transition-colors">
                                <tip.icon className="w-4 h-4 text-muted-foreground group-hover:text-teal-500" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-[10px] font-black uppercase tracking-widest">{tip.title}</h4>
                                <p className="text-[11px] text-muted-foreground font-medium leading-tight">{tip.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
