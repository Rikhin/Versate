"use client"

import { SignIn } from "@clerk/nextjs"
import { Trophy } from "lucide-react"

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Trophy className="h-8 w-8 text-slate-600" />
            <span className="text-2xl font-bold text-slate-800">ColabBoard</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome back</h1>
          <p className="text-slate-600">Sign in to your ColabBoard account</p>
        </div>
        <div className="flex justify-center">
          <SignIn
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "shadow-lg border-0",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
              },
            }}
            redirectUrl="/dashboard"
            signUpUrl="/sign-up"
          />
        </div>
      </div>
    </div>
  )
}
