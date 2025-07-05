import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { BackgroundDesign } from "@/components/ui/background-design"
import { Header } from "@/components/ui/header"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@vercel/analytics/next"
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
      <html lang="en">
        <body className={inter.className + " bg-white text-black"}>
          <OnboardingScrollEnforcer>
            <BackgroundDesign />
            <Header />
            <main className="relative z-10 min-h-screen">{children}</main>
            <Toaster />
            <Analytics />
          </OnboardingScrollEnforcer>
        </body>
      </html>
    </ClerkProvider>
  )
}
