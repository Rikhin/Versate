import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { OnboardingForm } from "@/components/onboarding/onboarding-form"

export default async function OnboardingPage() {
  const { userId } = await auth()
  
  console.log("Onboarding page - userId:", userId)
  
  if (!userId) {
    console.log("No userId, redirecting to sign-in")
    redirect("/sign-in")
  }

  // Check if user already has a profile
  const supabase = createServerClient()
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", userId)
    .single()

  console.log("Profile check - profile:", profile, "error:", error)

  // If profile exists, redirect to dashboard
  if (!error && profile) {
    console.log("Profile exists, redirecting to dashboard")
    redirect("/dashboard")
  }

  console.log("No profile found, showing onboarding form")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-zinc-900 dark:to-zinc-950 flex items-center justify-center">
      <OnboardingForm />
    </div>
  )
}
