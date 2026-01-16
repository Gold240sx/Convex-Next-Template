"use client"

import posthog from "posthog-js"
import { PostHogProvider } from "posthog-js/react"
import { ReactNode } from "react"
import { ThemeProvider } from "./theme-provider"
import { env } from "@/env"
import { NavigationProvider } from "@/hooks/useNavigation"
import { ConvexReactClient } from 'convex/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { useAuth } from '@clerk/nextjs'

if (typeof window !== "undefined") {
	posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
		api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
		capture_pageview: false,
	})
}

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error('Missing NEXT_PUBLIC_CONVEX_URL in your .env file')
}

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL)


import { SearchProvider } from "@/context/SearchContext"

export function Providers({ children }: { children: ReactNode }) {



	return (
		<ConvexProviderWithClerk client={convex} useAuth={useAuth}>
		<ThemeProvider
			attribute="class"
			defaultTheme="system"
			enableSystem
			disableTransitionOnChange>
			<NavigationProvider>
				<SearchProvider>
					<PostHogProvider client={posthog}>
						{children}
					</PostHogProvider>
				</SearchProvider>
			</NavigationProvider>
		</ThemeProvider>
		</ConvexProviderWithClerk>
	)
}
