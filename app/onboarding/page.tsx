import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { OnboardingForm } from "@/components/onboarding/onboarding-form"
import OnboardingToastClient from "@/components/onboarding/OnboardingToastClient"

export default async function OnboardingPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  // Check if user already has a profile
  const supabase = createServerClient()
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", userId)
    .single()

  if (!error && profile) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-zinc-900 dark:to-zinc-950 flex items-center justify-center">
      <OnboardingForm />
      <OnboardingToastClient />
    </div>
  )
}
