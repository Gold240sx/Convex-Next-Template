"use client"

import * as React from "react"
import {
	ThemeProvider as NextThemesProvider,
	type ThemeProviderProps,
} from "next-themes"
import { ThemeProvider as ThemeProviderContext } from "@/context/ThemeContext"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
	return <ThemeProviderContext>{children}</ThemeProviderContext>
}
