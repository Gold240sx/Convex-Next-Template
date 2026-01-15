import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { Providers } from "@/providers/providers";
import APP_CONFIG  from "@/app-config";
import FuzzyOverlay from "@/components/hover.dev/fuzzyOverlay";
import { TopLoader } from "next-top-loader";
import { BreakpointOverlay } from "@/components/myComponents/breakpoint-overlay";
import { Toaster } from "@/components/shadcn/toaster";
import { ClerkProvider } from '@clerk/nextjs'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Convex Portfolio 2026",
  description: "Michael Martell Portfolio",
  icons: {
    icon: "/convex.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isUnderDevelopment } = APP_CONFIG

  return (
          <html lang="en" suppressHydrationWarning>
            <body className="min-h-screen bg-black overflow-hidden h-fit w-screen bg-background antialiased relative">        
              
              <ClerkProvider>
              <Providers>
                <TopLoader />
               	{isUnderDevelopment ? (
                  <div className="overflow-x-hidden min-h-screen w-full">
                    <FuzzyOverlay />
                      {children}
                  </div>
                ):(
                <>
                  {/* {children} */}
                  </>
                )}
              </Providers>
              </ClerkProvider>
              <BreakpointOverlay />
				      <Toaster />
            </body>
          </html>
  );
}
