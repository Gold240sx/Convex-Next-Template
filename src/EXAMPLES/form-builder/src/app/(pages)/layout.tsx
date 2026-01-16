import type { Metadata } from "next"
import React, { ReactNode } from "react"
import { ClerkProvider } from "@clerk/nextjs"
import { Inter } from "next/font/google"
import "../globals.css"
import { ThemeProvider } from "@/components/providers/ThemeProviders"
import Document, { Html, Head, Main, NextScript } from "next/document"
import { Toaster } from "@/components/ui/toaster"
import {
	DesignerContext,
	DesignerContextProvider,
} from "../context/DesignerContext"
import NextTopLoader from "nextjs-toploader"

const inter = Inter({ subsets: ["latin"] })

const defaultUrl = process.env.VERCEL_URL
	? `https://${process.env.VERCEL_URL}`
	: "http://localhost:3000"

export const metadata: Metadata = {
	metadataBase: new URL(defaultUrl),
	title: "Form Maker",
	description: "Next JS + Prisma form building application",
}

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<ClerkProvider>
			<html lang="en" suppressHydrationWarning>
				<head />
				<body className="bg-background text-foreground max-w-[100vw] min-h-[100vh]">
					<NextTopLoader />
					<DesignerContextProvider>
						<ThemeProvider
							attribute="class"
							defaultTheme="system"
							enableSystem={true}
							disableTransitionOnChange={true}>
							<main className="min-h-screen flex flex-col items-center justify-center">
								{children}
							</main>
							<div id="codePortal" />
							<Toaster />
						</ThemeProvider>
					</DesignerContextProvider>
				</body>
			</html>
		</ClerkProvider>
	)
}
