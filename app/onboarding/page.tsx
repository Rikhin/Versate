import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { OnboardingForm } from "@/components/onboarding/onboarding-form"
import OnboardingToastClient from "@/components/onboarding/OnboardingToastClient"
import React from "react"

export default async function OnboardingPage() {
  let userId: string | null = null
  let profile: any = null
  let error: string | null = null
  
  try {
    const authResult = await auth()
    userId = authResult.userId
  if (!userId) {
    redirect("/sign-in")
  }
  // Check if user already has a profile
  const supabase = createServerClient()
    const { data, error: supabaseError } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", userId)
    .single()
    if (!supabaseError && data) {
    redirect("/dashboard")
  }
    if (supabaseError && supabaseError.code !== "PGRST116") { // PGRST116 = No rows found
      error = supabaseError.message
    }
  } catch (e: any) {
    error = e?.message || "Unknown error occurred. Please try again later."
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-zinc-900 dark:to-zinc-950">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-red-200">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
          <p className="text-gray-700 mb-4">{error}</p>
          <a href="/" className="text-blue-600 hover:underline">Go back to Home</a>
        </div>
      </div>
    )
  }

  // If we get here, user is signed in and has no profile
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-zinc-900 dark:to-zinc-950 flex items-center justify-center">
      <OnboardingForm />
      <OnboardingToastClient />
    </div>
  )
}
