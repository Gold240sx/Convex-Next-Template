"use client"

import { motion } from "framer-motion"
import { useTheme } from "@/hooks/useTheme"
import { useNavigation } from "@/hooks/useNavigation"
import { ReactNode } from "react"
import { applicationName } from "@/app-config"

interface PageContainerProps {
	children: ReactNode
	className?: string
	neumorphic?: boolean
}

export function PageContainer({
	children,
	className = "",
	neumorphic = false,
}: PageContainerProps) {
	const { theme } = useTheme()
	const { isPending } = useNavigation()

	// Determine if we're using a dark theme
	const isDark = theme.id.includes("dark")

	// Neumorphic background styles
	const neumorphicStyles = neumorphic
		? {
				background: theme.background,
				boxShadow: isDark
					? "inset 5px 5px 10px rgba(0, 0, 0, 0.2), inset -5px -5px 10px rgba(255, 255, 255, 0.05)"
					: "inset 5px 5px 10px rgba(0, 0, 0, 0.05), inset -5px -5px 10px rgba(255, 255, 255, 0.5)",
			}
		: {
				background: theme.background,
			}

	return (
		<main
			className={`min-h-screen w-full transition-colors duration-300 ${className}`}
			style={{
				...neumorphicStyles,
				opacity: isPending ? 0.7 : 1,
			}}>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className={`container mx-auto px-4 ${neumorphic ? "py-8" : ""}`}>
				{children}
			</motion.div>
		</main>
	)
}
