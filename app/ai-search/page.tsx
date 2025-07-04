"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth, SignInButton, SignUpButton } from "@clerk/nextjs";
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
  const [messages, setMessages] = useState<any[]>([]); // {role: 'user'|'assistant', content: string}
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { isSignedIn, isLoaded } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoaded && !isSignedIn) setShowAuthModal(true);
    else setShowAuthModal(false);
  }, [isSignedIn, isLoaded]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (q?: string) => {
    const userMessage = q || query;
    if (!userMessage.trim()) return;
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setQuery("");
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userMessage }),
      });
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      const aiContent = data.results?.[0]?.description || "(No response)";
      setMessages(prev => [...prev, { role: "assistant", content: aiContent }]);
    } catch (e: any) {
      setError(e.message || "Unknown error");
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, something went wrong." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <OnboardingScrollEnforcer>
      <div className="min-h-screen flex bg-[#f6f6fb]">
        {/* Modal for unauthenticated users */}
        {showAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full flex flex-col items-center gap-6 animate-fadeInUp">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Sign in or Sign up</h2>
              <p className="text-gray-500 text-center mb-4">Sign in or create an account to access AI Chat and discover opportunities.</p>
              <div className="flex w-full gap-2">
                <SignInButton mode="modal">
                  <button className="flex-1 py-2 rounded-lg border border-black text-black font-semibold bg-white hover:bg-gray-100 transition">Sign In</button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="flex-1 py-2 rounded-lg bg-black text-white font-semibold hover:bg-gray-900 transition">Sign Up</button>
                </SignUpButton>
              </div>
            </div>
          </div>
        )}
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
        {/* Main Content - Chat UI */}
        <main className="flex-1 flex flex-col items-center justify-center py-12 sm:py-24 px-2 sm:px-4">
          <div className="w-full max-w-lg sm:max-w-2xl mx-auto flex flex-col h-[70vh] sm:h-[80vh] bg-white rounded-2xl shadow-lg border border-indigo-100 overflow-hidden">
            {/* Chat header */}
            <div className="px-6 py-4 border-b border-indigo-50 bg-gradient-to-r from-blue-600 via-green-500 to-purple-600 text-white font-bold text-xl">AI Assistant</div>
            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 bg-[#f6f6fb]">
              {messages.length === 0 && (
                <div className="text-center text-gray-400 text-base mt-12">Start a conversation or try an example below!</div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}> 
                  {msg.role === "assistant" && (
                    <div className="flex items-end gap-2">
                      <Avatar className="h-8 w-8"><AvatarFallback>AI</AvatarFallback></Avatar>
                      <div className="bg-white border border-indigo-100 rounded-2xl px-4 py-3 max-w-[80vw] sm:max-w-[70%] shadow-sm prose prose-indigo text-sm sm:text-base">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    </div>
                  )}
                  {msg.role === "user" && (
                    <div className="flex items-end gap-2 flex-row-reverse">
                      <Avatar className="h-8 w-8"><AvatarFallback>U</AvatarFallback></Avatar>
                      <div className="bg-indigo-600 text-white rounded-2xl px-4 py-3 max-w-[80vw] sm:max-w-[70%] shadow-sm text-sm sm:text-base">
                        {msg.content}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-end gap-2">
                    <Avatar className="h-8 w-8"><AvatarFallback>AI</AvatarFallback></Avatar>
                    <div className="bg-white border border-indigo-100 rounded-2xl px-4 py-3 max-w-[80vw] sm:max-w-[70%] shadow-sm text-sm sm:text-base text-gray-400 italic">Thinking...</div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            {/* Chat input */}
            <div className="px-6 py-4 border-t border-indigo-50 bg-white flex items-center gap-3">
              <Input
                className="flex-1 text-base px-4 py-3 border-0 focus:ring-2 focus:ring-indigo-200 rounded-full bg-white shadow-none"
                placeholder="Type your message..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") handleSend(); }}
                disabled={loading}
                style={{ borderRadius: '2rem' }}
              />
              <Button
                className="px-6 py-3 text-base bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-none"
                onClick={() => handleSend()}
                disabled={loading || !query.trim()}
                style={{ borderRadius: '2rem' }}
              >
                {loading ? "Sending..." : "Send"}
              </Button>
            </div>
            {/* Example queries below input */}
            <div className="px-6 py-2 bg-white border-t border-indigo-50 flex flex-wrap gap-2">
              {exampleQueries.slice(0, 5).map((ex, i) => (
                <button
                  key={i}
                  className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-xs font-medium hover:bg-indigo-100 border border-indigo-100 shadow-none"
                  onClick={() => { setQuery(ex); handleSend(ex); }}
                  disabled={loading}
                  style={{ borderRadius: '2rem' }}
                >
                  {ex}
                </button>
              ))}
            </div>
            {error && <div className="text-red-500 text-center py-2">{error}</div>}
          </div>
        </main>
      </div>
    </OnboardingScrollEnforcer>
  );
} 