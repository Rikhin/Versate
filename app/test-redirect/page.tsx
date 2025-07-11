"use client";
export const dynamic = "force-dynamic";
export const runtime = "edge";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function TestRedirectPage() {
  const { user, isLoaded } = useUser();
  const [redirectStatus, setRedirectStatus] = useState("Checking...");

  useEffect(() => {
    if (isLoaded) {
      if (user) {
        setRedirectStatus(`User logged in: ${user.id}`);
        // Test the redirect logic
        setTimeout(() => {
          window.location.href = "/onboarding";
        }, 2000);
      } else {
        setRedirectStatus("No user logged in");
      }
    }
  }, [user, isLoaded]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Redirect Test</h1>
        <p className="mb-4">Status: {redirectStatus}</p>
        {user && (
          <div className="space-y-2">
            <p><strong>User ID:</strong> {user.id}</p>
            <p><strong>Email:</strong> {user.emailAddresses[0]?.emailAddress}</p>
            <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
          </div>
        )}
        <p className="mt-4 text-sm text-gray-600">
          This page will redirect to /onboarding in 2 seconds if user is logged in.
        </p>
      </div>
    </div>
  );
} 