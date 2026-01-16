"use client"

import React, { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "~/convex/_generated/api"
import { 
    Plus, 
    FileText, 
    MoreVertical, 
    Pencil, 
    Trash2, 
    CheckCircle2, 
    XCircle,
    Layout,
    Settings2
} from "lucide-react"
import { Button } from "@/components/shadcn/button"
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu"
import { Input } from "@/components/shadcn/input"
import { Label } from "@/components/shadcn/label"
import { Textarea } from "@/components/shadcn/textarea"
import { Switch } from "@/components/shadcn/switch"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

import { useRouter } from "next/navigation"

export default function FormsPage() {
    const router = useRouter()
    const forms = useQuery(api.myFunctions.getCustomForms)
    const createForm = useMutation(api.myFunctions.createCustomForm)
    const updateForm = useMutation(api.myFunctions.updateCustomForm)
    const deleteForm = useMutation(api.myFunctions.deleteCustomForm)

    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [newFormName, setNewFormName] = useState("")
    const [newFormSlug, setNewFormSlug] = useState("")
    const [newFormDesc, setNewFormDesc] = useState("")

    const handleCreate = async () => {
        try {
            await createForm({
                name: newFormName,
                slug: newFormSlug || newFormName.toLowerCase().replace(/\s+/g, '-'),
                description: newFormDesc,
                isActive: true,
                fields: [] // Start with empty fields, add builder later
            })
            toast.success("Form created successfully")
            setIsCreateOpen(false)
            setNewFormName("")
            setNewFormSlug("")
            setNewFormDesc("")
        } catch (error) {
            toast.error("Failed to create form")
        }
    }

    const handleDelete = async (id: any) => {
        try {
            await deleteForm({ id })
            toast.success("Form deleted")
        } catch (error) {
            toast.error("Failed to delete form")
        }
    }

    const handleToggleActive = async (id: any, currentStatus: boolean) => {
        try {
            await updateForm({ id, isActive: !currentStatus })
            toast.success(`Form ${currentStatus ? 'deactivated' : 'activated'}`)
        } catch (error) {
            toast.error("Failed to update status")
        }
    }

    if (!forms) {
        return (
             <div className="flex flex-col h-[60vh] items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin" />
                <div className="text-muted-foreground font-medium animate-pulse uppercase tracking-[0.2em] text-xs">Loading Forms...</div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-12">
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border pb-12">
                <div className="space-y-4">
                     <div className="flex items-center gap-3">
                        <div className="p-3 bg-teal-500/10 rounded-2xl border border-teal-500/20">
                            <Layout className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                        </div>
                        <h1 className="text-5xl font-black text-foreground tracking-tighter italic uppercase">
                            Form Builder
                        </h1>
                    </div>
                    <p className="text-muted-foreground font-medium max-w-lg leading-relaxed">
                        Create and manage dynamic forms for your chatbot. Define fields, validation, and purpose.
                    </p>
                </div>

                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl px-6 h-12 shadow-lg shadow-teal-500/20 transition-all hover:scale-105 active:scale-95">
                            <Plus className="w-5 h-5 mr-2" />
                            Create New Form
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Form</DialogTitle>
                            <DialogDescription>
                                Start by giving your form a name and purpose.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Form Name</Label>
                                <Input 
                                    placeholder="e.g. Project Inquiry" 
                                    value={newFormName}
                                    onChange={(e) => setNewFormName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Form Slug (ID)</Label>
                                <Input 
                                    placeholder="project-inquiry" 
                                    value={newFormSlug}
                                    onChange={(e) => setNewFormSlug(e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">Unique identifier for the chatbot to reference.</p>
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea 
                                    placeholder="What is this form for?" 
                                    value={newFormDesc}
                                    onChange={(e) => setNewFormDesc(e.target.value)}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleCreate} disabled={!newFormName}>Create Form</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {forms.length === 0 ? (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-border rounded-3xl bg-muted/5">
                        <FileText className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                        <h3 className="text-xl font-bold text-foreground mb-2">No Forms Created</h3>
                        <p className="text-muted-foreground max-w-sm mx-auto">
                            Get started by creating your first form template from the button above.
                        </p>
                    </div>
                ) : (
                    forms.map((form) => (
                        <div key={form._id} className="group bg-card border border-border rounded-3xl p-6 hover:shadow-xl hover:shadow-teal-500/5 hover:border-teal-500/30 transition-all duration-300 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted rounded-full">
                                            <MoreVertical className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => router.push(`/admin/forms/${form._id}`)}>
                                            <Pencil className="w-4 h-4 mr-2" />
                                            Edit Builder
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleToggleActive(form._id, form.isActive)}>
                                            {form.isActive ? <XCircle className="w-4 h-4 mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                                            {form.isActive ? "Deactivate" : "Activate"}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-rose-500 focus:text-rose-500" onClick={() => handleDelete(form._id)}>
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-lg text-foreground">{form.name}</h3>
                                        <span className={cn(
                                            "px-2 py-0.5 rounded-full text-[10px] uppercase font-black tracking-wider border",
                                            form.isActive 
                                                ? "bg-teal-500/10 text-teal-600 border-teal-500/20" 
                                                : "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
                                        )}>
                                            {form.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground font-mono bg-muted/50 inline-block px-1.5 py-0.5 rounded">
                                        {form.slug}
                                    </p>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                                    {form.description || "No description provided."}
                                </p>
                            </div>

                            <div className="mt-8 pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                                <span className="flex items-center gap-1.5">
                                    <Settings2 className="w-4 h-4" />
                                    {form.fields?.length || 0} Fields
                                </span>
                                <span>
                                    {new Date(form.updatedAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
