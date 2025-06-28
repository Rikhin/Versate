import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ClerkProvider } from "@clerk/nextjs"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ColabBoard - Find Your Competition Team",
  description: "Connect with students for academic competitions. Win together.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider publishableKey="pk_test_ZGVsaWNhdGUtYWxpZW4tODcuY2xlcmsuYWNjb3VudHMuZGV2JA" dynamic>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  )
}
