"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Trophy } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-6">
          <Trophy className="h-8 w-8 text-slate-600" />
          <span className="text-2xl font-bold text-slate-800">brately</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Something went wrong!</h2>
        <p className="text-slate-600 mb-6">We encountered an error while loading the page.</p>
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  )
}
