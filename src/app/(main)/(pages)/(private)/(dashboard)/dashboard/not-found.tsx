"use client"

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Home, ArrowLeft, Search, Bot } from "lucide-react"
import { Button } from "@/components/shadcn/button"

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative"
            >
                {/* Decorative background glow */}
                <div className="absolute -inset-10 bg-teal-500/10 blur-3xl rounded-full" />
                
                <div className="relative space-y-8">
                    <div className="flex justify-center">
                        <div className="relative">
                            <Bot className="w-24 h-24 text-teal-600 dark:text-teal-400 animate-pulse" />
                            <Search className="w-10 h-10 text-rose-500 absolute -bottom-2 -right-2 bg-background rounded-full p-2 border-2 border-border" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-8xl font-black text-foreground italic uppercase tracking-tighter">404</h1>
                        <h2 className="text-2xl font-bold uppercase tracking-[0.2em] text-muted-foreground">Page Missing</h2>
                        <p className="text-muted-foreground max-w-md mx-auto font-medium">
                            The section you're looking for within the dashboard doesn't exist or has been moved.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Button
                            asChild
                            variant="default"
                            className="rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-black text-[10px] uppercase tracking-widest h-12 px-8 shadow-xl shadow-teal-600/20"
                        >
                            <Link href="/dashboard" className="flex items-center gap-2">
                                <Home className="w-4 h-4" /> Dashboard Home
                            </Link>
                        </Button>
                        <Button
                            onClick={() => window.history.back()}
                            variant="outline"
                            className="rounded-2xl border-border bg-background hover:bg-muted font-black text-[10px] uppercase tracking-widest h-12 px-8"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
                        </Button>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
