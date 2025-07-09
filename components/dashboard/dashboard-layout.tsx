import { ReactNode } from "react"
import { Sidebar } from "@/components/ui/sidebar"
import { UserNav } from "@/components/dashboard/user-nav"

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-helix-dark">
      <div className="flex h-full">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <header className="sticky top-0 z-10 border-b bg-white/80 dark:bg-helix-dark/80 backdrop-blur-sm">
            <div className="flex h-16 items-center justify-between px-6">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
              <div className="flex items-center space-x-4">
                <UserNav />
              </div>
            </div>
          </header>
          <main className="p-6">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
