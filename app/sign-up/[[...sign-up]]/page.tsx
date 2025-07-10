"use client";

export const dynamic = "force-dynamic";

import { SignUp } from "@clerk/nextjs"
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();

  useEffect(() => {
    // Listen for successful sign-up and redirect to onboarding
    const handleSignUpSuccess = () => {
      router.push("/onboarding");
    };

    // Add event listener for sign-up success
    window.addEventListener("clerk:sign-up:success", handleSignUpSuccess);

    return () => {
      window.removeEventListener("clerk:sign-up:success", handleSignUpSuccess);
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-md">
        <SignUp 
          afterSignUpUrl="/onboarding"
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-lg border-0",
            }
          }}
        />
      </div>
    </div>
  )
} 