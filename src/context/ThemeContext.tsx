"use client"

import {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from "react"
import { Theme, themes } from "@/styles/themes"

export interface ThemeContextType {
	theme: Theme
	setTheme: (theme: Theme) => void
	cycleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
	undefined
)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setTheme] = useState<Theme>(themes[0])

	useEffect(() => {
		const storedThemeId = localStorage.getItem("themeId")
		const storedTheme =
			themes.find((t) => t.id === storedThemeId) || themes[0]
		setTheme(storedTheme)
	}, [])

	useEffect(() => {
		localStorage.setItem("themeId", theme.id)
		Object.entries(theme.colors).forEach(([key, value]) => {
			document.documentElement.style.setProperty(`--color-${key}`, value)
		})
		document.documentElement.style.setProperty(
			"--background",
			theme.background
		)
		document.documentElement.classList.remove(...themes.map((t) => t.id))
		document.documentElement.classList.add(theme.id)
	}, [theme])

	const cycleTheme = () => {
		const currentIndex = themes.findIndex((t) => t.id === theme.id)
		const nextIndex = (currentIndex + 1) % themes.length
		setTheme(themes[nextIndex])
	}

	return (
		<ThemeContext.Provider value={{ theme, setTheme, cycleTheme }}>
			{children}
		</ThemeContext.Provider>
	)
}
