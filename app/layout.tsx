import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider"
import { BackgroundDesign } from "@/components/ui/background-design"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ColabBoard - Competition Team Formation Platform",
  description: "Find teammates for academic competitions and collaborative projects",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <SmoothScrollProvider>
            <BackgroundDesign />
            {children}
          </SmoothScrollProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
