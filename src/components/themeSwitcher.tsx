"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Palette } from "lucide-react"
import { themes, Theme } from "@/styles/themes"
import { useTheme } from "@/hooks/useTheme"
import { Button } from "./shadcn/button"

export function ThemeSwitcher() {
	const { theme, setTheme } = useTheme()
	const [isOpen, setIsOpen] = React.useState(false)
	const containerRef = React.useRef<HTMLDivElement>(null)

	// Close the theme switcher when clicking outside
	React.useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				isOpen &&
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				setIsOpen(false)
			}
		}

		document.addEventListener("mousedown", handleClickOutside)
		return () => {
			document.removeEventListener("mousedown", handleClickOutside)
		}
	}, [isOpen])

	// Prevent theme change from triggering multiple re-renders
	const handleThemeChange = React.useCallback(
		(newTheme: Theme) => {
			setTheme(newTheme)
			setIsOpen(false)
		},
		[setTheme]
	)

	return (
		<div className="z-50 relative" ref={containerRef}>
			<Button
				variant="ghost"
				size="icon"
				onClick={() => setIsOpen((prev) => !prev)}
				aria-label="Toggle theme selector"
				className="transition-colors duration-200">
				<Palette className="h-6 w-6" />
			</Button>
			<AnimatePresence mode="wait">
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, y: -10, scale: 0.95 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: -10, scale: 0.95 }}
						transition={{
							duration: 0.15,
							ease: "easeOut",
						}}
						style={{
							background: theme.colors.secondary,
						}}
						className="absolute right-0 mt-2 p-3 bg-background border border-border rounded-xl shadow-lg">
						<div className="grid grid-cols-6 gap-3 w-[320px]">
							{themes.map((t: Theme) => (
								<ThemeOption
									key={t.id}
									theme={t}
									isSelected={theme.id === t.id}
									onClick={() => handleThemeChange(t)}
								/>
							))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}

interface ThemeOptionProps {
	theme: Theme
	isSelected: boolean
	onClick: () => void
}

function ThemeOption({ theme, isSelected, onClick }: ThemeOptionProps) {
	// Use memo to prevent unnecessary re-renders
	return React.useMemo(
		() => (
			<motion.button
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
				onClick={onClick}
				className="relative w-9 h-9 rounded-full overflow-hidden shadow-md shadow-black/30"
				style={{
					background: theme.colors.accent,
				}}
				aria-label={`Select ${theme.name} theme`}>
				{isSelected && (
					<motion.div
						layoutId="selectedRing"
						className="absolute inset-0 border-3 border-primary rounded-full"
						initial={false}
						transition={{
							type: "spring",
							stiffness: 400,
							damping: 30,
							duration: 0.1,
						}}
					/>
				)}
			</motion.button>
		),
		[theme, isSelected, onClick]
	)
}
