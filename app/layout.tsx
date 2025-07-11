import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import dynamic from "next/dynamic";
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"
import OnboardingScrollEnforcer from "@/components/onboarding/OnboardingScrollEnforcer"

const inter = Inter({ subsets: ["latin"] })

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
  const Header = dynamic(() => import("@/components/ui/header"), { ssr: false });
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
          <Header />
          <main className="relative z-10 min-h-screen bg-transparent">{children}</main>
          <Toaster />
          <Analytics />
        </OnboardingScrollEnforcer>
        </ThemeProvider>
      </body>
    </html>
  )
}
