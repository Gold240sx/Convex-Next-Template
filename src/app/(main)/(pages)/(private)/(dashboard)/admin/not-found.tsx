"use client"

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ShieldAlert, ArrowLeft, LayoutDashboard, Lock } from "lucide-react"
import { Button } from "@/components/shadcn/button"

export default function AdminNotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative"
            >
                {/* Security themed glow */}
                <div className="absolute -inset-10 bg-rose-500/5 blur-3xl rounded-full" />
                
                <div className="relative space-y-10">
                    <div className="flex justify-center">
                        <div className="relative">
                            <div className="p-6 bg-rose-500/10 rounded-3xl border border-rose-500/20">
                                <ShieldAlert className="w-20 h-20 text-rose-600 dark:text-rose-400" />
                            </div>
                            <div className="absolute -top-3 -right-3 p-2 bg-background border-2 border-border rounded-full shadow-lg h-10 w-10 flex items-center justify-center">
                                <Lock className="w-5 h-5 text-zinc-500" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-[0.2em]">
                            Admin Protected Area
                        </div>
                        <h1 className="text-7xl font-black text-foreground italic uppercase tracking-tighter">404 Error</h1>
                        <h2 className="text-xl font-bold uppercase tracking-[0.15em] text-muted-foreground">Resource Not Found</h2>
                        <p className="text-muted-foreground max-w-lg mx-auto font-medium leading-relaxed italic">
                            The administrative endpoint you are trying to reach does not exist or requires higher clearance.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Button
                            asChild
                            variant="default"
                            className="rounded-2xl bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 text-white font-black text-[10px] uppercase tracking-widest h-14 px-8 shadow-2xl"
                        >
                            <Link href="/admin" className="flex items-center gap-2">
                                <LayoutDashboard className="w-4 h-4" /> Admin Home
                            </Link>
                        </Button>
                        <Button
                            onClick={() => window.history.back()}
                            variant="outline"
                            className="rounded-2xl border-border bg-background hover:bg-muted font-black text-[10px] uppercase tracking-widest h-14 px-8"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" /> Previous Page
                        </Button>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
