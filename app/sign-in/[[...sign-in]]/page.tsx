export const dynamic = "force-dynamic";

import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fff7f0]">
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
    </div>
  );
} 