"use client";
import { useRouter, usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

function RequireProfile({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  // List of routes that don't require a profile
  const skipRoutes = [
    '/onboarding',
    '/sign-in',
    '/sign-up',
    '/api',
    '/_next',
    '/public',
  ];
  const shouldSkip = skipRoutes.some((route) => pathname.startsWith(route));

  useEffect(() => {
    if (!isLoaded || shouldSkip) {
      setChecking(false);
      return;
    }
    if (!isSignedIn) {
      setChecking(false);
      return;
    }
    // Check if user has a profile
    fetch('/api/profiles/check')
      .then((res) => res.json())
      .then((data) => {
        if (!data.hasProfile) {
          router.replace('/onboarding');
        }
        setChecking(false);
      })
      .catch(() => setChecking(false));
  }, [isLoaded, isSignedIn, pathname, router, shouldSkip]);

  if (checking) return null;
  return <>{children}</>;
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return <RequireProfile>{children}</RequireProfile>;
} 