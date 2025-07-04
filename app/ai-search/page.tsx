"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth, SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import OnboardingScrollEnforcer from "@/components/onboarding/OnboardingScrollEnforcer";
import ReactMarkdown from 'react-markdown';

const exampleQueries = [
  "Students interested in robotics in California",
  "Mentors with experience in AI",
  "Competitions for high schoolers in Texas",
  "Teammates who know React",
  "People looking for hackathons this month",
  "Founders offering open-source developer tools",
  "People currently based in Europe",
  "Researchers in quantum computing",
  "Who works at a VC firm?",
  "People working on AI lead generation"
];

const savedSearches: string[] = [
  // Add more saved searches here as needed
];

export default function AISearchPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { isSignedIn, isLoaded, user } = useUser();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Placeholder: Replace with actual plan fetch logic
  const userPlan = isSignedIn ? (user?.publicMetadata?.plan || "Free") : "Free";

  // Marquee animation for pills
  // We'll use a simple CSS animation for now
  const marqueePills = [
    "Students interested in robotics in California",
    "Mentors with experience in AI",
    "Competitions for high schoolers in Texas",
    "Teammates who know React",
    "People looking for hackathons this month",
    "Founders offering open-source developer tools",
    "Researchers in quantum computing",
    "Entrepreneurs in biotech",
    "People currently based in Europe",
    "Who works at a VC firm?",
  ];

  useEffect(() => {
    if (isLoaded && !isSignedIn) setShowAuthModal(true);
    else setShowAuthModal(false);
  }, [isSignedIn, isLoaded]);

  const handleSend = async (q?: string) => {
    // You can implement search logic here if needed
  };

  return (
    <OnboardingScrollEnforcer>
      <div className="min-h-screen flex bg-white">
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 bg-[#f3f0ff] border-r border-gray-200 flex-col justify-between py-8 px-6 min-h-screen">
          <div>
            <div className="mb-8 flex items-center gap-2">
              <span className="font-bold text-xl text-indigo-700">ColabBoard</span>
            </div>
            <nav className="space-y-2 mb-8">
              <Link href="/ai-search" className="block py-2 px-3 rounded-lg font-medium text-indigo-700 bg-indigo-100">Search</Link>
            </nav>
            {/* Saved Searches Section */}
            <div className="mb-8">
              <div className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-widest">Saved Searches</div>
              <div className="flex flex-col gap-2">
                {savedSearches.map((search, i) => (
                  <button
                    key={i}
                    className="w-full text-left py-2 px-3 rounded-lg bg-white hover:bg-indigo-50 text-sm text-gray-700 border border-indigo-50 transition"
                    onClick={() => { setQuery(search); handleSend(search); }}
                    disabled={loading}
                    style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-8">
              <div className="text-xs text-gray-500 mb-1">Plan usage <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-0.5 rounded">Free</span></div>
              <div className="text-xs text-gray-500">Searches: <span className="font-semibold">Unlimited</span></div>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-8">
            <Avatar className="h-8 w-8"><AvatarFallback>RK</AvatarFallback></Avatar>
            <span className="text-sm font-medium text-gray-700">Rikhin Kavuru</span>
          </div>
        </aside>
        {/* Main Content - Centered Search UI */}
        <main className="flex-1 flex flex-col items-center justify-center py-24 px-2 sm:px-4 relative">
          {/* Move header higher */}
          <div className="w-full flex flex-col items-center" style={{ marginTop: '-3rem', marginBottom: '2.5rem' }}>
            <h1 className="text-5xl md:text-6xl font-extrabold text-black text-center leading-tight tracking-tight mb-2">Prioritize Efficiency. Search Smartly.</h1>
          </div>
          <div className="w-full max-w-xl mx-auto flex flex-col items-center">
            <div className="w-full flex flex-col items-center mb-6">
              <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg border border-gray-200 p-6 flex flex-col items-center relative">
                {/* Upgrade plan tab, dynamic */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-50 border border-gray-200 rounded-full px-4 py-1 text-xs text-gray-500 flex items-center gap-2 z-10">
                  {userPlan === "Free" ? (
                    <>
                      You're on the free plan. Upgrade for unlimited searches.
                      <button className="ml-2 text-purple-600 font-semibold hover:underline">Upgrade Plan</button>
                    </>
                  ) : (
                    <>
                      You're on the <span className="ml-1 font-bold text-indigo-600">{userPlan}</span> plan.
                    </>
                  )}
                </div>
                <input
                  className="w-full text-lg px-6 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 bg-gray-50 text-gray-500 placeholder-gray-400 outline-none mt-8"
                  placeholder="Search for people who..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  disabled={loading}
                  style={{ fontWeight: 500 }}
                />
                <div className="w-full flex justify-end mt-2">
                  <button className="bg-gray-100 rounded-full p-2 text-gray-400" disabled>
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-up"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
                  </button>
                </div>
              </div>
            </div>
            {/* Marquee pills */}
            <div className="relative w-full max-w-2xl overflow-x-hidden" style={{ height: '56px' }}>
              <div className="absolute left-0 top-0 w-16 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 w-16 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
              <div className="flex gap-3 animate-marquee whitespace-nowrap" style={{ animation: 'marquee 18s linear infinite' }}>
                {marqueePills.map((pill, i) => (
                  <span
                    key={i}
                    className="bg-white border border-gray-200 px-4 py-2 rounded-full text-gray-700 text-sm font-medium shadow-sm cursor-pointer hover:bg-gray-50 transition mx-1"
                    onClick={() => setQuery(pill)}
                  >
                    {pill}
                  </span>
                ))}
                {/* Duplicate for seamless loop */}
                {marqueePills.map((pill, i) => (
                  <span
                    key={i + marqueePills.length}
                    className="bg-white border border-gray-200 px-4 py-2 rounded-full text-gray-700 text-sm font-medium shadow-sm cursor-pointer hover:bg-gray-50 transition mx-1"
                    onClick={() => setQuery(pill)}
                  >
                    {pill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </OnboardingScrollEnforcer>
  );
} 