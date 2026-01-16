"use client"

import React, { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "~/convex/_generated/api"
import { Mail, Clock, MessageSquare, ChevronRight, Archive, Inbox, RotateCcw } from "lucide-react"
import Link from "next/link"
import { Doc, Id } from "~/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

import { useSearch } from "@/context/SearchContext"

export default function UserMessagesPage() {
    const [view, setView] = useState<"active" | "archived">("active")
    const { query: searchQuery } = useSearch()

    const activeMessages = useQuery(api.myFunctions.getAllContactMessages)
    const archivedMessages = useQuery(api.myFunctions.getArchivedContactMessages)
    const archiveMessage = useMutation(api.myFunctions.archiveContactMessage)
    const unarchiveMessage = useMutation(api.myFunctions.unarchiveContactMessage)

    const messages = (view === "active" ? activeMessages : archivedMessages) as Doc<"contactMessages">[] | undefined

    if (messages === undefined) {
        return (
            <div className="flex flex-col h-[60vh] items-center justify-center p-8 space-y-4">
                <div className="w-12 h-12 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin" />
                <div className="text-muted-foreground font-medium animate-pulse">Syncing inbox...</div>
            </div>
        )
    }

    const filteredMessages = messages.filter((m) => {
        if (!searchQuery) return true
        const q = searchQuery.toLowerCase()
        return (
            m.name.toLowerCase().includes(q) ||
            m.email.toLowerCase().includes(q) ||
            m.message.toLowerCase().includes(q) ||
            (m.subject?.toLowerCase() || "").includes(q)
        )
    })

    const handleArchive = async (id: Id<"contactMessages">) => {
        try {
            await archiveMessage({ id })
            toast.success("Message moved to archive")
        } catch (err) {
            toast.error("Failed to archive message")
        }
    }

    const handleUnarchive = async (id: Id<"contactMessages">) => {
        try {
            await unarchiveMessage({ id })
            toast.success("Message restored to inbox")
        } catch (err) {
            toast.error("Failed to restore message")
        }
    }

    return (
        <div className="max-w-7xl mx-auto space-y-10 p-6 md:p-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border pb-10">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-teal-500/10 rounded-lg">
                            <MessageSquare className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                        </div>
                        <h1 className="text-4xl font-black text-foreground tracking-tight italic uppercase">
                            {view === "active" ? "User Inbox" : "Archived Inquiries"}
                        </h1>
                    </div>
                    <p className="text-muted-foreground font-medium tracking-wide">
                        {view === "active" 
                            ? "Manage active conversations and support inquiries from your chatbot."
                            : "Vew and manage previously archived user communications."}
                    </p>
                </div>

                <div className="flex items-center gap-3 bg-card border border-border p-1.5 rounded-2xl shadow-sm">
                    <button 
                        onClick={() => setView("active")}
                        className={cn(
                            "px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2",
                            view === "active" ? "bg-teal-600 text-white shadow-lg" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Inbox className="w-3.5 h-3.5" /> Active
                    </button>
                    <button 
                        onClick={() => setView("archived")}
                        className={cn(
                            "px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2",
                            view === "archived" ? "bg-teal-600 text-white shadow-lg" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Archive className="w-3.5 h-3.5" /> Archived
                    </button>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-muted/50 border-b border-border">
                                <th className="px-6 py-5 text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] w-[40px]">Status</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em]">Contact</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em]">Reason</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em]">Message Summary</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em]">Received</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredMessages.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-20 text-center text-muted-foreground font-medium uppercase text-xs tracking-[0.2em]">
                                        {searchQuery ? "No matching messages found" : `No ${view} messages found`}
                                    </td>
                                </tr>
                            ) : (
                                filteredMessages.map((m) => (
                                    <tr 
                                        key={m._id} 
                                        className={cn(
                                            "group hover:bg-muted/30 transition-all duration-300",
                                            !m.readAt && view === "active" && "bg-teal-500/[0.03]"
                                        )}
                                    >
                                        <td className="px-6 py-6 align-middle">
                                            {!m.readAt ? (
                                                <div className="w-2.5 h-2.5 bg-teal-500 rounded-full shadow-[0_0_8px_rgba(20,184,166,0.5)]" />
                                            ) : (
                                                <div className="w-2 h-2 bg-zinc-300 dark:bg-zinc-700 rounded-full" />
                                            )}
                                        </td>
                                        <td className="px-6 py-6 align-middle">
                                            <div className="space-y-1">
                                                <div className="text-foreground font-bold group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors uppercase text-sm tracking-tight">{m.name}</div>
                                                <div className="text-muted-foreground text-xs flex items-center gap-1.5 font-medium">
                                                    <Mail className="w-3 h-3 text-teal-600/50 dark:text-teal-400/50" />
                                                    {m.email}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 align-middle">
                                            <span className={cn(
                                                "text-[9px] font-black px-2.5 py-1 rounded-lg border uppercase tracking-widest",
                                                m.contactReason === "support" 
                                                    ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20" 
                                                    : "bg-muted text-muted-foreground border-border"
                                            )}>
                                                {m.contactReason || "general"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6 align-middle">
                                            <p className="text-foreground/70 text-sm line-clamp-1 max-w-[300px] font-medium leading-relaxed">
                                                {m.message}
                                            </p>
                                        </td>
                                        <td className="px-6 py-6 align-middle">
                                            <div className="flex items-center gap-2 text-muted-foreground text-sm font-bold tracking-tighter">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span>{new Date(m.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 align-middle text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {view === "active" ? (
                                                    <button 
                                                        onClick={() => handleArchive(m._id)}
                                                        className="p-2 text-muted-foreground hover:text-rose-500 transition-colors"
                                                        title="Archive"
                                                    >
                                                        <Archive className="w-4 h-4" />
                                                    </button>
                                                ) : (
                                                    <button 
                                                        onClick={() => handleUnarchive(m._id)}
                                                        className="p-2 text-muted-foreground hover:text-teal-500 transition-colors"
                                                        title="Unarchive"
                                                    >
                                                        <RotateCcw className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <Link 
                                                    href={`/admin/user-messages/${m._id}`}
                                                    className="inline-flex items-center gap-2 text-xs font-black text-foreground hover:text-teal-600 dark:hover:text-teal-400 bg-background hover:bg-teal-500/10 border border-border hover:border-teal-500/40 px-4 py-2 rounded-xl transition-all shadow-sm uppercase tracking-widest"
                                                >
                                                    View <ChevronRight className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
