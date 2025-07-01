"use client";
import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function OnboardingScrollEnforcer() {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const hasPrompted = useRef(false);
  const hasNavigated = useRef(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    let detach = () => {};

    const checkProfileAndAttach = async () => {
      try {
        const res = await fetch(`/api/profiles/${user.id}`);
        if (res.status === 404) {
          // No profile, attach scroll listener
          const handleScroll = () => {
            if (hasPrompted.current) return;
            hasPrompted.current = true;
            setShowModal(true);
          };
          window.addEventListener("scroll", handleScroll, { once: true });
          detach = () => window.removeEventListener("scroll", handleScroll);
        }
      } catch (err) {
        // If fetch fails, do nothing (fail silently)
      }
    };

    checkProfileAndAttach();

    return () => {
      detach();
    };
  }, [user, isSignedIn, isLoaded, router]);

  const handleGoToOnboarding = () => {
    if (hasNavigated.current) return;
    hasNavigated.current = true;
    try {
      router.replace("/onboarding?required=1");
    } catch (e) {
      // fail silently
    }
  };

  if (!showModal) return null;

  return (
    <div
      style={{
        position: "fixed",
        zIndex: 10000,
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(30, 41, 59, 0.25)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "opacity 0.5s",
        opacity: showModal ? 1 : 0,
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "1.5rem",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          padding: "2.5rem 2rem",
          maxWidth: 400,
          textAlign: "center",
          fontFamily: "inherit",
          color: "#334155",
          fontSize: "1.15rem",
          letterSpacing: "0.01em",
          lineHeight: 1.7,
        }}
      >
        <div style={{ fontWeight: 700, fontSize: "1.3rem", marginBottom: "0.5rem", color: "#2563eb" }}>
          Welcome!
        </div>
        <div style={{ marginBottom: "1.5rem" }}>
          To help you get started, please complete the onboarding questionnaire.<br />
          <span style={{ color: "#64748b", fontSize: "1rem", display: "block", marginTop: "0.7rem" }}>
            This helps us match you with the best teams and opportunities.
          </span>
        </div>
        <button
          onClick={handleGoToOnboarding}
          style={{
            background: "#6366f1",
            color: "white",
            border: "none",
            borderRadius: "0.75rem",
            padding: "0.75rem 2.5rem",
            fontSize: "1.1rem",
            fontWeight: 600,
            boxShadow: "0 2px 8px rgba(99,102,241,0.08)",
            cursor: "pointer",
            transition: "background 0.2s, box-shadow 0.2s",
            marginTop: "0.5rem",
            letterSpacing: "0.01em",
          }}
        >
          Go to Questionnaire
        </button>
      </div>
    </div>
  );
} 