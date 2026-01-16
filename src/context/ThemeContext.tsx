"use client"

import {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
	useRef,
} from "react"
import { Theme, themes } from "@/styles/themes"
import { useTheme as useNextTheme } from "next-themes"

export interface ThemeContextType {
	theme: Theme
	setTheme: (theme: Theme) => void
	cycleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
	undefined
)

const isDarkTheme = (t: Theme) => t.id.includes("dark")
const isLightTheme = (t: Theme) => t.id.includes("light")

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const { theme: nextTheme, setTheme: setNextTheme, resolvedTheme } = useNextTheme()
	const [theme, _setTheme] = useState<Theme>(themes[0])
	const isSyncing = useRef(false)

	// Initialize theme from localStorage
	useEffect(() => {
		const storedThemeId = localStorage.getItem("themeId")
		const storedTheme =
			themes.find((t) => t.id === storedThemeId) || themes[0]
		_setTheme(storedTheme)
	}, [])

	// Synchronize when nextTheme changes (e.g. from FancyDarkModeToggle)
	useEffect(() => {
		if (isSyncing.current) return

		const mode = resolvedTheme // use resolvedTheme to handle 'system'
		if (mode === "dark" || mode === "light") {
			const currentIsDark = isDarkTheme(theme)
			const currentIsLight = isLightTheme(theme)

			// Only update if the mode doesn't match the current theme's nature
			if ((mode === "dark" && !currentIsDark) || (mode === "light" && !currentIsLight)) {
				const matchingTheme = themes.find((t) => t.id === mode)
				if (matchingTheme) {
					isSyncing.current = true
					_setTheme(matchingTheme)
					// Reset syncing flag after a short delay to allow state propagation
					setTimeout(() => { isSyncing.current = false }, 50)
				}
			}
		}
	}, [resolvedTheme, theme])

	// Apply theme colors and classes to document
	useEffect(() => {
		localStorage.setItem("themeId", theme.id)
		
		// Apply CSS variables
		Object.entries(theme.colors).forEach(([key, value]) => {
			document.documentElement.style.setProperty(`--color-${key}`, value)
		})
		document.documentElement.style.setProperty(
			"--background",
			theme.background
		)
		document.documentElement.style.setProperty(
			"--foreground",
			theme.colors.text
		)

		// Manage classes
		const themeIds = themes.map((t) => t.id)
		document.documentElement.classList.remove(...themeIds)
		document.documentElement.classList.add(theme.id)

		// Sync back to next-themes if necessary, but don't cause a loop
		if (!isSyncing.current) {
			const themeIsDark = isDarkTheme(theme)
			const themeIsLight = isLightTheme(theme)
			
			if (themeIsDark && resolvedTheme !== "dark") {
				isSyncing.current = true
				setNextTheme("dark")
				setTimeout(() => { isSyncing.current = false }, 50)
			} else if (themeIsLight && resolvedTheme !== "light") {
				isSyncing.current = true
				setNextTheme("light")
				setTimeout(() => { isSyncing.current = false }, 50)
			}
		}
	}, [theme, resolvedTheme, setNextTheme])

	const setTheme = (newTheme: Theme) => {
		_setTheme(newTheme)
	}

	const cycleTheme = () => {
		const currentIndex = themes.findIndex((t) => t.id === theme.id)
		const nextIndex = (currentIndex + 1) % themes.length
		_setTheme(themes[nextIndex])
	}

	return (
		<ThemeContext.Provider value={{ theme, setTheme, cycleTheme }}>
			{children}
		</ThemeContext.Provider>
	)
}
