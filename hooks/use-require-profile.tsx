"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import useSWR from 'swr';
import fetcher from '../lib/fetcher';

export function useRequireProfile() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const userId = user?.id;

  const { data: profile, error } = useSWR(`/api/profiles/${userId}`, fetcher);

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      router.replace("/sign-in");
      return;
    }
    
    if (profile) {
      setLoading(false);
    } else if (error) {
      router.replace("/onboarding?required=1");
    }
  }, [user, isLoaded, router, profile, error]);

  return { loading, profile };
} 