"use client"

import React from "react"
import { useQuery } from "convex/react"
import { api } from "~/convex/_generated/api"
import { 
    Bell, 
    MessageSquare, 
    User, 
    Clock, 
    ChevronRight, 
    ExternalLink,
    AlertCircle,
    CheckCircle2
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function NotificationsPage() {
    const messages = useQuery(api.myFunctions.getAllContactMessages)

    if (messages === undefined) {
        return (
            <div className="flex flex-col h-[60vh] items-center justify-center p-8 space-y-4">
                <div className="w-12 h-12 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin" />
                <div className="text-muted-foreground font-medium animate-pulse">Loading notifications...</div>
            </div>
        )
    }

    const unreadMessages = messages.filter(m => !m.readAt)

    return (
        <div className="max-w-6xl mx-auto space-y-10 p-6 md:p-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border pb-10">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-teal-500/10 rounded-lg">
                            <Bell className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                        </div>
                        <h1 className="text-4xl font-black text-foreground tracking-tight italic uppercase">Notifications</h1>
                    </div>
                    <p className="text-muted-foreground font-medium tracking-wide">Stay updated on all activity across your platform.</p>
                </div>
                {unreadMessages.length > 0 && (
                    <div className="px-5 py-2.5 bg-teal-500/10 border border-teal-500/20 rounded-2xl flex items-center gap-3 shadow-sm">
                        <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(20,184,166,0.6)]" />
                        <span className="text-sm font-black text-teal-600 dark:text-teal-400 tracking-widest uppercase">
                            {unreadMessages.length} NEW ALERTS
                        </span>
                    </div>
                )}
            </div>

            <div className="space-y-6">
                {unreadMessages.length === 0 ? (
                    <div className="text-center py-32 bg-card border border-border rounded-3xl shadow-sm">
                        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2 italic uppercase">All Caught Up!</h3>
                        <p className="text-muted-foreground max-w-xs mx-auto">No new notifications at the moment.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {unreadMessages.map((message) => (
                            <Link 
                                key={message._id}
                                href={`/admin/user-messages/${message._id}`}
                                className="group relative bg-card border border-border hover:border-teal-500/40 transition-all duration-300 rounded-2xl overflow-hidden flex flex-col md:flex-row items-start md:items-center p-6 gap-6 shadow-sm hover:shadow-md"
                            >
                                <div className="w-14 h-14 shrink-0 bg-teal-500/10 rounded-2xl flex items-center justify-center border border-teal-500/20 group-hover:bg-teal-500/20 transition-colors">
                                    <MessageSquare className="w-7 h-7 text-teal-600 dark:text-teal-400" />
                                </div>
                                
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-lg font-bold text-foreground uppercase italic tracking-tight group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                                            New Chatbot Message
                                        </h3>
                                        <span className="px-2 py-0.5 bg-muted border border-border rounded-md text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                                            ACTION REQUIRED
                                        </span>
                                    </div>
                                    <p className="text-muted-foreground text-sm line-clamp-1">
                                        <span className="font-bold text-foreground/80">{message.name}</span> reached out about <span className="italic">"{message.message}"</span>
                                    </p>
                                    <div className="flex items-center gap-4 text-[11px] font-bold text-muted-foreground/60 uppercase tracking-wider pt-1">
                                        <div className="flex items-center gap-1.5">
                                            <User className="w-3 h-3" />
                                            {message.email}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-3 h-3" />
                                            {new Date(message.createdAt).toLocaleString()}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 self-end md:self-center">
                                    <span className="text-xs font-black text-teal-600 dark:text-teal-400 uppercase tracking-widest group-hover:mr-2 transition-all">VIEW INQUIRY</span>
                                    <ChevronRight className="w-5 h-5 text-zinc-300 dark:text-zinc-700 group-hover:text-teal-500 transition-colors" />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Read Notifications Section (Optional/Future) */}
            {messages.filter(m => m.readAt).length > 0 && (
                <div className="space-y-6 pt-10">
                    <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-muted-foreground" />
                        <h2 className="text-sm font-black text-muted-foreground uppercase tracking-[0.2em] italic">Recent History</h2>
                    </div>
                    <div className="grid gap-4 opacity-60 hover:opacity-100 transition-opacity">
                        {messages.filter(m => m.readAt).slice(0, 5).map((message) => (
                             <Link 
                                key={message._id}
                                href={`/admin/user-messages/${message._id}`}
                                className="group bg-card border border-border hover:border-zinc-400/40 transition-all rounded-xl flex items-center p-4 gap-4 shadow-sm"
                            >
                                <div className="w-10 h-10 shrink-0 bg-muted rounded-xl flex items-center justify-center border border-border">
                                    <MessageSquare className="w-5 h-5 text-muted-foreground" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-foreground">Message from {message.name}</h4>
                                    <p className="text-xs text-muted-foreground italic">Read on {new Date(message.readAt!).toLocaleDateString()}</p>
                                </div>
                                <ExternalLink className="w-4 h-4 text-zinc-300" />
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
