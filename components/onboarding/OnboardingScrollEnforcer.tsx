"use client";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function OnboardingScrollEnforcer() {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    let hasChecked = false;
    let detach = () => {};

    const checkProfileAndAttach = async () => {
      if (hasChecked) return;
      hasChecked = true;
      // Check if user has a profile
      const res = await fetch(`/api/profiles/${user.id}`);
      if (!res.ok) {
        // No profile, attach scroll listener
        const handleScroll = () => {
          router.replace("/onboarding?required=1");
        };
        window.addEventListener("scroll", handleScroll, { once: true });
        detach = () => window.removeEventListener("scroll", handleScroll);
      }
    };

    checkProfileAndAttach();

    return () => {
      detach();
    };
  }, [user, isSignedIn, isLoaded, router]);

  return null;
} 