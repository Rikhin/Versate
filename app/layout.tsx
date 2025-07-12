import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import ClientLayout from "@/components/ClientLayout";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Versate',
  description: 'Competition Team Formation Platform',
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
          <ClientLayout>
            {children}
          </ClientLayout>
        </body>
      </html>
    </ClerkProvider>
  )
}
