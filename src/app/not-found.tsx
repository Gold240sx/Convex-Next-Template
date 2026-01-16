"use client"

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Compass, ArrowLeft, Home, Sparkles } from "lucide-react"
import { Button } from "@/components/shadcn/button"

export default function RootNotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-background relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-500/5 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: "2s" }} />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="max-w-2xl w-full"
            >
                <div className="space-y-12">
                    <div className="flex justify-center">
                        <motion.div 
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                            className="p-8 bg-card border border-border rounded-full shadow-2xl relative"
                        >
                            <Compass className="w-24 h-24 text-teal-500" />
                            <Sparkles className="absolute top-0 right-0 w-8 h-8 text-teal-400 animate-bounce" />
                        </motion.div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h1 className="text-[12rem] font-black leading-none tracking-tighter text-foreground/5 italic">404</h1>
                            <div className="relative -mt-24">
                                <h2 className="text-4xl md:text-5xl font-black text-foreground uppercase tracking-tight italic">Lost in Space</h2>
                                <p className="mt-4 text-muted-foreground text-lg font-medium max-w-md mx-auto">
                                    The page you're searching for has vanished into the digital void.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
                        <Button
                            asChild
                            variant="default"
                            className="rounded-full bg-teal-600 hover:bg-teal-500 text-white font-black text-xs uppercase tracking-[0.2em] h-16 px-10 shadow-xl shadow-teal-600/30 group"
                        >
                            <Link href="/">
                                <Home className="w-5 h-5 mr-3 group-hover:-translate-y-1 transition-transform" /> 
                                Return Home
                            </Link>
                        </Button>
                        <Button
                            onClick={() => window.history.back()}
                            variant="ghost"
                            className="rounded-full hover:bg-muted text-foreground font-black text-xs uppercase tracking-[0.2em] h-16 px-10"
                        >
                            <ArrowLeft className="w-5 h-5 mr-3" /> Go Back
                        </Button>
                    </div>
                </div>
            </motion.div>
            
            {/* Footer decoration */}
            <div className="absolute bottom-10 left-0 w-full text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/30">
                Michael Martell &bull; Engineering Portfolio &bull; 2026
            </div>
        </div>
    )
}