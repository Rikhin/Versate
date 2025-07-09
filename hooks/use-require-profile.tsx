"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from 'swr';
import fetcher from '@/lib/fetcher';
import { Profile } from '@/types/profile';

export function useRequireProfile() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const userId = user?.id;

  const { data: profile, error: swrError, isValidating } = useSWR<Profile>(
    userId ? `/api/profiles/${userId}` : null, 
    fetcher,
    {
      revalidateOnFocus: false,
      onError: (err) => {
        console.error('Profile fetch error:', err);
        setError(err);
      },
      onSuccess: () => {
        setError(null);
      }
    }
  );

  useEffect(() => {
    if (!isLoaded) return;
    
    // If no user is signed in, redirect to sign-in
    if (!user) {
      router.replace("/sign-in");
      return;
    }

    // If we have a profile, we're done loading
    if (profile) {
      setLoading(false);
      return;
    }

    // If there's an error (including 404), redirect to onboarding
    if (swrError || (profile === null && !isValidating)) {
      const redirectUrl = searchParams.get('redirect') || '/dashboard';
      router.replace(`/onboarding?required=1&redirect=${encodeURIComponent(redirectUrl)}`);
      return;
    }

    // Update loading state based on SWR's validation state
    setLoading(isValidating);
  }, [user, isLoaded, router, profile, swrError, isValidating, searchParams]);

  return { 
    loading, 
    profile: profile || null, 
    error: error || swrError 
  };
}