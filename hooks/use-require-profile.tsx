"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export function useRequireProfile() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      router.replace("/sign-in");
      return;
    }
    // Fetch profile
    const checkProfile = async () => {
      const res = await fetch(`/api/profiles/${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setLoading(false);
      } else {
        router.replace("/onboarding?required=1");
      }
    };
    checkProfile();
  }, [user, isLoaded, router]);

  return { loading, profile };
} 