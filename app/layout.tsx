import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { Header } from "@/components/ui/header"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"
import OnboardingScrollEnforcer from "@/components/onboarding/OnboardingScrollEnforcer"

const inter = Inter({ subsets: ["latin"] })

const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export const metadata: Metadata = {
  title: "Versate - Competition Team Formation Platform",
  description: "Find teammates for academic competitions and collaborative projects",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} bg-helix-dark-blue`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
          <OnboardingScrollEnforcer>
            <Header />
            <main className="relative z-10 min-h-screen">{children}</main>
            <Toaster />
            <Analytics />
          </OnboardingScrollEnforcer>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
