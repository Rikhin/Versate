"use client";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export default function OnboardingToastClient() {
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("required") === "1") {
        toast({
          title: "Complete Onboarding",
          description: "Please complete the onboarding questionnaire before accessing other features.",
        });
      }
    }
  }, [toast]);

  return null;
} 