"use client";
import { useEffect, useRef, useState, createContext, useContext } from "react";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";

// Context for modal state
const OnboardingModalContext = createContext<{ showModal: boolean } | undefined>(undefined);

export function useOnboardingModal() {
  const ctx = useContext(OnboardingModalContext);
  if (!ctx) throw new Error("useOnboardingModal must be used within OnboardingScrollEnforcer");
  return ctx;
}

export default function OnboardingScrollEnforcer({ children }: { children?: React.ReactNode }) {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [showModal, setShowModal] = useState(false);
  const [profileChecked, setProfileChecked] = useState(false);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const hasPrompted = useRef(false);
  const hasNavigated = useRef(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;
    if (pathname !== "/") return;
    setProfileChecked(false);
    setHasProfile(null);
    let detach = () => {};

    const checkProfileAndAttach = async () => {
      try {
        const res = await fetch(`/api/profiles/${user.id}`);
        if (res.status === 404) {
          setHasProfile(false);
          // No profile, attach scroll listener
          const handleScroll = () => {
            if (hasPrompted.current) return;
            hasPrompted.current = true;
            setShowModal(true);
          };
          window.addEventListener("scroll", handleScroll, { once: true });
          detach = () => window.removeEventListener("scroll", handleScroll);
        } else {
          setHasProfile(true);
        }
      } catch {
        setHasProfile(true); // fail safe: assume has profile
      } finally {
        setProfileChecked(true);
      }
    };

    checkProfileAndAttach();

    return () => {
      detach();
    };
  }, [user, isSignedIn, isLoaded, router, pathname]);

  const handleGoToOnboarding = () => {
    if (hasNavigated.current) return;
    hasNavigated.current = true;
    try {
      router.replace("/onboarding?required=1");
    } catch {
      // fail silently
    }
  };

  // Hide modal on sign out
  const handleSignOut = () => {
    setShowModal(false);
  };

  // Loading state: don't show modal or allow scroll enforcement until profile check is done
  // For signed out users or when not on landing page, showModal should be false
  const contextValue = { 
    showModal: isSignedIn && pathname === "/" ? (!!showModal && !hasProfile) : false 
  };

  return (
    <OnboardingModalContext.Provider value={contextValue}>
      {children}
      {/* Only show modal if: on landing, signed in, loaded, profile checked, no profile, and modal triggered */}
      {profileChecked && !hasProfile && showModal && pathname === "/" && (
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
              padding: "2rem 1.5rem",
              maxWidth: 500,
              minWidth: 340,
              textAlign: "center",
              fontFamily: "inherit",
              color: "#334155",
              fontSize: "1.08rem",
              letterSpacing: "0.01em",
              lineHeight: 1.7,
            }}
          >
            <div style={{ fontWeight: 700, fontSize: "1.2rem", marginBottom: "0.5rem", color: "#2563eb" }}>
              Welcome!
            </div>
            <div style={{ marginBottom: "1.2rem" }}>
              To help you get started, please complete the onboarding questionnaire.<br />
              <span style={{ color: "#64748b", fontSize: "0.98rem", display: "block", marginTop: "0.7rem" }}>
                This helps us match you with the best teams and opportunities.
              </span>
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={handleGoToOnboarding}
                style={{
                  background: "#6366f1",
                  color: "white",
                  border: "none",
                  borderRadius: "0.75rem",
                  padding: "0.55rem 1.5rem",
                  fontSize: "1rem",
                  fontWeight: 600,
                  boxShadow: "0 2px 8px rgba(99,102,241,0.08)",
                }}
              >
                Go to Onboarding
              </button>
              <SignOutButton redirectUrl="/">
                <button
                  onClick={handleSignOut}
                  style={{
                    background: "#f3f4f6",
                    color: "#334155",
                    border: "1px solid #cbd5e1",
                    borderRadius: "0.75rem",
                    padding: "0.55rem 1.5rem",
                    fontSize: "1rem",
                    fontWeight: 600,
                    boxShadow: "0 2px 8px rgba(99,102,241,0.04)",
                  }}
                >
                  Sign Out
                </button>
              </SignOutButton>
            </div>
          </div>
        </div>
      )}
    </OnboardingModalContext.Provider>
  );
} 