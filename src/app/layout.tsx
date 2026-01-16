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
import { cn } from "@/lib/utils";
import { Roboto, Roboto_Slab } from "next/font/google";
import { Pacifico } from "next/font/google";


const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-roboto",
});

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-slab",
});

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pacifico",
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
      <body className={cn("min-h-screen overflow-x-hidden h-fit antialiased relative bg-gray-100 dark:bg-gray-900",
                    roboto.variable,
                    robotoSlab.variable,
                    pacifico.variable,
                    isUnderDevelopment && "min-h-screen"
                  )} suppressHydrationWarning>        
              <ClerkProvider>
                <TopLoader />
                <Providers>
                  {children}
                </Providers>
              </ClerkProvider>
              <BreakpointOverlay />
				      <Toaster />
            </body>
          </html>
  );
}
