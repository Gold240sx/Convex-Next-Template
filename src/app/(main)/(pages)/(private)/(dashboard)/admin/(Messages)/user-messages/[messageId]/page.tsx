"use client"

import React, { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "~/convex/_generated/api"
import { Id } from "~/convex/_generated/dataModel"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/shadcn/button"
import { 
    Archive, 
    Mail, 
    Clock, 
    ArrowLeft, 
    RotateCcw, 
    CheckCircle2, 
    User, 
    Calendar as CalendarIcon,
    MessageSquare,
    Trash2,
    Reply,
    Copy,
    Check,
    Plus,
    Inbox,
    Bell
} from "lucide-react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/shadcn/card"
import { Badge } from "@/components/shadcn/badge"
import { Separator } from "@/components/shadcn/separator"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

// Dialog imports
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/shadcn/dialog"
import { Label } from "@/components/shadcn/label"
import { Input } from "@/components/shadcn/input"
import { Textarea } from "@/components/shadcn/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select"
import { Calendar } from "@/components/shadcn/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shadcn/popover"

export default function MessageDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const messageId = params.messageId as Id<"contactMessages">
    
    // Retrieve message data
    const message = useQuery(api.myFunctions.getContactMessageById, { id: messageId })
    
    // Mutations
    const archiveMessage = useMutation(api.myFunctions.archiveContactMessage)
    const unarchiveMessage = useMutation(api.myFunctions.unarchiveContactMessage)
    const markAsRead = useMutation(api.myFunctions.markContactMessageAsRead)
    const markAsUnread = useMutation(api.myFunctions.markContactMessageAsUnread)
    const createTask = useMutation(api.myFunctions.createTaskFromMessage)

    const [copied, setCopied] = React.useState(false)
    const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)
    const [taskTitle, setTaskTitle] = useState("")
    const [taskDescription, setTaskDescription] = useState("")
    const [taskPriority, setTaskPriority] = useState<"low" | "medium" | "high">("medium")
    const [dueDate, setDueDate] = useState<Date | undefined>(undefined)
    const [reminder, setReminder] = useState<Date | undefined>(undefined)

    // Handlers
    const handleArchive = async () => {
        try {
            await archiveMessage({ id: messageId })
            toast.success("Message archived")
            router.push("/admin/user-messages")
        } catch (err) {
            toast.error("Failed to archive message")
        }
    }

    const handleUnarchive = async () => {
        try {
            await unarchiveMessage({ id: messageId })
            toast.success("Message restored into inbox")
        } catch (err) {
            toast.error("Failed to restore message")
        }
    }

    const toggleReadStatus = async () => {
        try {
            if (message?.readAt) {
                await markAsUnread({ id: messageId })
                toast.success("Marked as unread")
            } else {
                await markAsRead({ id: messageId })
                toast.success("Has been marked as read")
            }
        } catch (err) {
            toast.error("Failed to update status")
        }
    }

    const copyToClipboard = async () => {
        if (message?.email) {
            await navigator.clipboard.writeText(message.email)
            setCopied(true)
            toast.success("Email copied to clipboard")
            setTimeout(() => setCopied(false), 2000)
        }
    }

    const handleCreateTask = async () => {
        try {
            await createTask({
                messageId,
                title: taskTitle || `Task from ${message?.name}`,
                description: taskDescription || message?.message || "No description",
                priority: taskPriority,
                dueDate: dueDate ? dueDate.getTime() : undefined,
                reminder: reminder ? reminder.getTime() : undefined,
            })
            toast.success("Task created from message")
            setIsTaskDialogOpen(false)
        } catch (error) {
            toast.error("Failed to create task")
        }
    }

    // Effect to pre-fill task info when dialog opens
    React.useEffect(() => {
        if (isTaskDialogOpen && message) {
            setTaskTitle(`Resolve inquiry from ${message.name}`)
            setTaskDescription(message.message)
            setDueDate(undefined)
            setReminder(undefined)
        }
    }, [isTaskDialogOpen, message])


    // Loading State
    if (message === undefined) {
        return (
            <div className="flex flex-col h-[60vh] items-center justify-center p-8 space-y-4">
                <div className="w-16 h-16 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin shadow-[0_0_20px_rgba(20,184,166,0.3)]" />
                <div className="text-muted-foreground font-black uppercase tracking-widest text-xs animate-pulse">Loading Details...</div>
            </div>
        )
    }

    // Not Found State
    if (message === null) {
        return (
            <div className="flex flex-col h-[60vh] items-center justify-center p-8 space-y-6 text-center">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
                    <MessageSquare className="w-10 h-10 text-muted-foreground" />
                </div>
                <div>
                    <h3 className="text-2xl font-black text-foreground uppercase italic tracking-tight mb-2">Message Not Found</h3>
                    <p className="text-muted-foreground">This message may have been deleted or does not exist.</p>
                </div>
                <Button onClick={() => router.push("/admin/user-messages")} variant="outline">
                    Return to Inbox
                </Button>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 p-6 md:p-10 pb-20">
            {/* Top Navigation Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => router.back()}
                    className="w-fit pl-0 hover:bg-transparent text-muted-foreground hover:text-teal-500 transition-colors uppercase text-xs font-black tracking-widest group"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> 
                    Back to Inbox
                </Button>
            </div>

            {/* Main Action Banner */}
            <div className="bg-card border border-border rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
                <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                         {/* Location Badge (Inbox/Archived) */}
                         <div className={cn(
                            "flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                            message.archivedAt 
                                ? "bg-orange-500/10 text-orange-600 border-orange-500/20" 
                                : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                         )}>
                            {message.archivedAt ? <Archive className="w-3 h-3" /> : <Inbox className="w-3 h-3" />}
                            {message.archivedAt ? "Archived" : "Inbox"}
                         </div>

                         {/* Category Badge */}
                         <span className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                            message.contactReason === "support" 
                                ? "bg-rose-500/10 text-rose-600 border-rose-500/20" 
                                : "bg-teal-500/10 text-teal-600 border-teal-500/20"
                        )}>
                            {message.contactReason || "General Inquiry"}
                        </span>

                        {/* Read Date Badge */}
                        {message.readAt && (
                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border bg-muted/50 border-border text-muted-foreground">
                                <CheckCircle2 className="w-3 h-3" />
                                Read: {new Date(message.readAt).toLocaleDateString()}
                            </div>
                        )}
                    </div>

                    <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight italic uppercase leading-none">
                        {message.subject || "No Subject Provided"}
                    </h1>
                </div>

                <div className="flex items-center gap-2">
                     <Button
                        variant="outline"
                        onClick={toggleReadStatus}
                        className={cn(
                            "h-10 px-4 rounded-xl gap-2 border-2 transition-all uppercase text-[10px] font-black tracking-widest",
                            message.readAt 
                                ? "bg-background border-border hover:bg-muted text-muted-foreground" 
                                : "bg-teal-500 text-white border-transparent hover:bg-teal-600 shadow-md shadow-teal-500/20"
                        )}
                    >
                        {message.readAt ? (
                            <>
                                <div className="w-2 h-2 rounded-full bg-zinc-300" />
                                Mark Unread
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="w-4 h-4" />
                                Mark as Read
                            </>
                        )}
                    </Button>
                    
                    {message.archivedAt ? (
                        <Button 
                            variant="outline" 
                            onClick={handleUnarchive}
                            className="h-10 px-4 rounded-xl gap-2 border-2 border-border hover:border-teal-500 hover:text-teal-600 bg-background uppercase text-[10px] font-black tracking-widest"
                        >
                            <RotateCcw className="w-4 h-4" /> Restore
                        </Button>
                    ) : (
                        <Button 
                            variant="outline" 
                            onClick={handleArchive}
                            className="h-10 px-4 rounded-xl gap-2 border-2 border-border hover:border-rose-500 hover:text-rose-600 bg-background uppercase text-[10px] font-black tracking-widest"
                        >
                            <Archive className="w-4 h-4" /> Archive
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Message Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
                        <div className="h-2 w-full bg-gradient-to-r from-teal-500 via-emerald-400 to-teal-500" />
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4" /> Message Body
                                </h3>
                                <div className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                                    <Clock className="w-3.5 h-3.5" />
                                    {new Date(message.createdAt).toLocaleString(undefined, {
                                        dateStyle: 'long',
                                        timeStyle: 'short'
                                    })}
                                </div>
                            </div>
                            
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                <p className="text-base md:text-lg leading-relaxed font-medium text-foreground/90 whitespace-pre-wrap">
                                    {message.message}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Chat Context (If Available) */}
                    {message.conversation && (
                        <div className="bg-muted/30 border border-border rounded-3xl p-6 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="h-px bg-border flex-1" />
                                <span className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                    <MessageSquare className="w-3 h-3" />
                                    Prior Conversation
                                </span>
                                <div className="h-px bg-border flex-1" />
                            </div>

                            <div className="space-y-4">
                                {message.conversation.messages.map((msg, i) => {
                                    const isAssistant = msg.role === "assistant";
                                    return (
                                        <div 
                                            key={i} 
                                            className={cn(
                                                "flex w-full",
                                                isAssistant ? "justify-end" : "justify-start"
                                            )}
                                        >
                                            <div className={cn(
                                                "max-w-[85%] rounded-2xl px-5 py-4 text-sm font-medium leading-relaxed shadow-sm",
                                                isAssistant 
                                                    ? "bg-teal-500 text-white rounded-br-none" 
                                                    : "bg-background border border-border text-foreground rounded-bl-none"
                                            )}>
                                                <div className="text-[9px] font-black uppercase tracking-wider mb-1 opacity-70">
                                                    {msg.role}
                                                </div>
                                                {msg.content}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar Column */}
                <div className="space-y-6">
                    {/* Add to Tasks Button Box */}
                    <div className="bg-card border border-border rounded-3xl p-4 shadow-sm">
                        <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="w-full h-12 rounded-xl gap-2 uppercase text-xs font-black tracking-widest bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20">
                                    <Plus className="w-4 h-4" /> Create Task
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                                <DialogHeader>
                                    <DialogTitle>Create Task from Message</DialogTitle>
                                    <DialogDescription>
                                        Turn this user inquiry into an actionable task.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="title">Task Title</Label>
                                        <Input
                                            id="title"
                                            value={taskTitle}
                                            onChange={(e) => setTaskTitle(e.target.value)}
                                        />
                                    </div>
                                    
                                     <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label>Due Date</Label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "justify-start text-left font-normal",
                                                            !dueDate && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={dueDate}
                                                        onSelect={setDueDate}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>

                                        <div className="grid gap-2">
                                            <Label>Reminder</Label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "justify-start text-left font-normal",
                                                            !reminder && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <Bell className="mr-2 h-4 w-4" />
                                                        {reminder ? format(reminder, "PPP") : <span>Set reminder</span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={reminder}
                                                        onSelect={setReminder}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="priority">Priority</Label>
                                        <Select 
                                            value={taskPriority} 
                                            onValueChange={(val: any) => setTaskPriority(val)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="low">Low</SelectItem>
                                                <SelectItem value="medium">Medium</SelectItem>
                                                <SelectItem value="high">High</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="desc">Description</Label>
                                        <Textarea
                                            id="desc"
                                            value={taskDescription}
                                            onChange={(e) => setTaskDescription(e.target.value)}
                                            rows={5}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleCreateTask}>Create Task</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Sender Details Box */}
                    <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 pb-2 border-b border-border/50">
                            <User className="w-4 h-4 text-teal-500" />
                            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Sender Details</h3>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Full Name</label>
                                <div className="p-3 bg-muted/30 rounded-xl border border-border/50 font-bold text-sm flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-600 flex items-center justify-center text-[10px] font-black">
                                        {message.name.charAt(0).toUpperCase()}
                                    </div>
                                    {message.name}
                                </div>
                            </div>
                            
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Email Address</label>
                                <div className="p-3 bg-muted/30 rounded-xl border border-border/50 font-bold text-sm flex items-center justify-between gap-2 group">
                                    <div className="truncate text-sm">{message.email}</div>
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 text-muted-foreground hover:text-teal-500"
                                            onClick={copyToClipboard}
                                            title="Copy Email"
                                        >
                                            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                        </Button>
                                        <a 
                                            href={`mailto:${message.email}`}
                                            className="h-6 w-6 flex items-center justify-center text-muted-foreground hover:text-teal-500 rounded-md hover:bg-teal-500/10 transition-colors"
                                            title="Reply via Email"
                                        >
                                            <Reply className="w-3 h-3" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Metadata Box */}
                    <div className="bg-muted/30 border border-border rounded-3xl p-6 shadow-sm space-y-6">
                         <div className="flex items-center gap-3 pb-2 border-b border-border/50">
                            <CheckCircle2 className="w-4 h-4 text-teal-500" />
                            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Verification</h3>
                        </div>
                        
                        <div className="grid gap-3">
                            <div className="flex items-center justify-between text-sm p-3 bg-background/50 rounded-xl border border-border/50">
                                <span className="text-muted-foreground font-medium text-xs uppercase tracking-wide">Data Consent</span>
                                <Badge variant="outline" className="bg-teal-500/10 text-teal-600 border-teal-500/20 uppercase text-[10px] font-black tracking-wider">
                                    Verified
                                </Badge>
                            </div>
                             <div className="flex items-center justify-between text-sm p-3 bg-background/50 rounded-xl border border-border/50">
                                <span className="text-muted-foreground font-medium text-xs uppercase tracking-wide">Source</span>
                                <Badge variant="outline" className="bg-muted text-foreground border-border uppercase text-[10px] font-black tracking-wider">
                                    Web Form
                                </Badge>
                            </div>
                        </div>
                    </div>
                    
                    <Button 
                        variant="destructive" 
                        className="w-full h-12 rounded-2xl gap-2 uppercase text-xs font-black tracking-widest shadow-lg shadow-rose-500/20 opacity-80 hover:opacity-100 transition-all"
                        onClick={() => toast.error("Delete functionality not implemented yet")}
                    >
                        <Trash2 className="w-4 h-4" /> Delete Message
                    </Button>
                </div>
            </div>
        </div>
    )
}
