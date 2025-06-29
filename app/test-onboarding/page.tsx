import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@/lib/supabase/server";

export default async function TestOnboardingPage() {
  const { userId } = await auth();
  
  let profileInfo = "No profile found";
  let errorInfo = "No error";

  if (userId) {
    try {
      const supabase = createServerClient();
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (profile) {
        profileInfo = `Profile found: ${profile.first_name} ${profile.last_name}`;
      } else if (error) {
        errorInfo = `Error: ${error.message}`;
      }
    } catch (err) {
      errorInfo = `Exception: ${err}`;
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Onboarding Debug Info</h1>
      <div className="space-y-4">
        <div>
          <strong>User ID:</strong> {userId || "Not signed in"}
        </div>
        <div>
          <strong>Profile:</strong> {profileInfo}
        </div>
        <div>
          <strong>Error:</strong> {errorInfo}
        </div>
        <div>
          <strong>Environment:</strong> {process.env.NODE_ENV}
        </div>
        <div>
          <strong>Supabase URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Not set"}
        </div>
        <div>
          <strong>Supabase Key:</strong> {process.env.SUPABASE_SERVICE_ROLE_KEY ? "Set" : "Not set"}
        </div>
      </div>
      
      <div className="mt-8 space-y-2">
        <a href="/onboarding" className="block text-blue-600 hover:underline">
          Go to Onboarding
        </a>
        <a href="/dashboard" className="block text-blue-600 hover:underline">
          Go to Dashboard
        </a>
        <a href="/" className="block text-blue-600 hover:underline">
          Go to Home
        </a>
      </div>
    </div>
  );
} 