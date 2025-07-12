"use client";

export const dynamic = "force-dynamic";

import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fff7f0]">
      <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" afterSignUpUrl="/onboarding" />
    </div>
  );
} 