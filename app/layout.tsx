import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"
import OnboardingScrollEnforcer from "@/components/onboarding/OnboardingScrollEnforcer"
import ClientLayout from "@/components/ClientLayout";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Versate - Competition Team Formation Platform",
  description: "Find teammates for academic competitions and collaborative projects",
  generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
        <OnboardingScrollEnforcer>
          <ClientLayout>
            <main className="relative z-10 min-h-screen bg-transparent">{children}</main>
            <Toaster />
            <Analytics />
          </ClientLayout>
        </OnboardingScrollEnforcer>
        </ThemeProvider>
      </body>
    </html>
  )
}
