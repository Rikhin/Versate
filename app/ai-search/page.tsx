"use client";
export const dynamic = "force-dynamic";
export const runtime = "edge";

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@clerk/nextjs';
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { BackgroundGradient, FloatingShapes } from "@/components/scroll-animations";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export default function AISearchPage() {
  const { userId } = useAuth();
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [profilePlan, setProfilePlan] = useState<string>('Free');

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, 50);
  }, [messages]);

  // Fetch user profile plan from Supabase
  useEffect(() => {
    async function fetchProfilePlan() {
      if (!userId) return;
      try {
        const res = await fetch(`/api/profiles/${userId}`);
        if (res.ok) {
          const data = await res.json();
          setProfilePlan(data?.plan || data?.profile?.plan || 'Free');
        }
      } catch {
        setProfilePlan('Free');
      }
    }
    fetchProfilePlan();
  }, [userId]);

  const startNewSearch = () => {
    setMessages([]);
    setHasSearched(false);
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const searchQuery = query.trim();
    if (!searchQuery) return;
    setLoading(true);
    setHasSearched(true);
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: searchQuery,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    // Placeholder AI message
    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage: Message = {
      id: aiMessageId,
      type: 'ai',
      content: '',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, aiMessage]);
    setQuery('');
    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: searchQuery }),
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(prev => prev.map(m => m.id === aiMessageId ? { ...m, content: JSON.stringify(data.results, null, 2) } : m));
      } else {
        setMessages(prev => prev.map(m => m.id === aiMessageId ? { ...m, content: 'Error: Failed to get response.' } : m));
      }
    } catch {
      setMessages(prev => prev.map(m => m.id === aiMessageId ? { ...m, content: 'Error: Failed to get response.' } : m));
    } finally {
      setLoading(false);
    }
  };

  if (!userId) {
    return (
      <div className="min-h-screen bg-helix-dark relative overflow-hidden flex items-center justify-center">
        <BackgroundGradient startColor="from-helix-blue/20" endColor="to-helix-dark-blue/20" triggerStart="top center" triggerEnd="center center" />
        <FloatingShapes count={3} triggerStart="top center" triggerEnd="bottom center" />
        <div className="relative z-10 text-center">
          <h1 className="text-3xl md:text-5xl font-black text-white mb-6">Please sign in to use AI Search</h1>
          <p className="text-xl text-helix-text-light">You need to be authenticated to access this feature.</p>
        </div>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn">
          <div className="glass border border-white/10 rounded-[24px] shadow-2xl p-8 max-w-sm w-full flex flex-col items-center gap-6 animate-fadeInUp">
            <h2 className="text-2xl font-bold text-white mb-2">Sign in or Sign up</h2>
            <p className="text-helix-text-light text-center mb-4">Sign in or create an account to access AI Search and start exploring.</p>
            <div className="flex w-full gap-3">
              <SignInButton mode="modal">
                <button className="flex-1 py-3 rounded-full border border-white/20 text-white font-bold bg-white/10 hover:bg-white/20 transition">Sign In</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="flex-1 py-3 rounded-full bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end text-white font-bold hover:shadow-xl glow transition">Sign Up</button>
              </SignUpButton>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-helix-dark relative overflow-hidden">
      <BackgroundGradient startColor="from-helix-blue/20" endColor="to-helix-dark-blue/20" triggerStart="top center" triggerEnd="center center" />
      <FloatingShapes count={3} triggerStart="top center" triggerEnd="bottom center" />
      {/* Sidebar - Fixed to viewport, fits under header */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} glass border-r border-white/10 flex flex-col fixed left-0 top-16 h-[calc(100vh-4rem)] transition-all duration-300 overflow-hidden z-10 pb-8`}>
        {/* Top Section */}
        <div className="flex flex-col flex-1 pt-6">
          {/* Collapsed: V icon, divider, toggle button */}
          {!sidebarOpen && (
            <div className="flex flex-col items-center pt-6">
                <span className="text-3xl font-extrabold text-helix-gradient-start mb-2">V</span>
                <div className="w-8 border-b-2 border-white/20 mb-2" />
              <button
                onClick={() => setSidebarOpen(true)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                  <svg className="w-4 h-4 text-helix-gradient-start" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
          {/* Expanded: Logo, toggle, search, history */}
          {sidebarOpen && (
            <>
              {/* Logo and toggle */}
              <div className="flex items-center justify-between px-6 mb-4">
                <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-white tracking-tight">Versate</span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                    <svg className="w-4 h-4 text-helix-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </div>

              {/* Search bar */}
              <div className="px-6 mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                      className="w-full pl-10 pr-4 py-3 border-2 border-white/20 focus:border-helix-gradient-start bg-white/10 text-white placeholder-helix-text-light backdrop-blur-sm rounded-full text-base"
                  />
                    <svg className="absolute left-3 top-3 w-4 h-4 text-helix-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Start a New Search Button */}
              <div className="px-6 mb-2">
                <button
                    className="w-full bg-white/10 hover:bg-white/20 text-white font-bold rounded-full py-3 text-base transition border-2 border-white/20"
                  onClick={startNewSearch}
                >
                  + Start a New Search
                </button>
              </div>

              {/* Chat History */}
              <div className="flex-1 overflow-y-auto px-6">
                <div className="space-y-2">
                  {messages.length > 0 && (
                    <div className="text-sm text-helix-text-light mb-4">Recent Searches</div>
                  )}
                  {messages.map((message, idx) => (
                    <div key={idx} className="text-sm text-helix-text-light hover:text-white cursor-pointer p-2 rounded hover:bg-white/5 transition-colors">
                      {message.content.substring(0, 50)}...
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col ml-0 lg:ml-64 transition-all duration-300">
        {/* Header */}
        <header className="glass border-b border-white/10 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-white">AI Search</h1>
            <div className="text-sm text-helix-text-light">Powered by Versate</div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-sm text-helix-text-light">Plan: {profilePlan}</div>
          </div>
        </header>

        {/* Chat Messages */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-6 space-y-6"
        >
          {!hasSearched && (
            <div className="text-center py-12">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold text-white mb-6">Welcome to AI Search</h2>
                <p className="text-xl text-helix-text-light mb-8">
                  Ask me anything about competitions, projects, or finding teammates. I&apos;ll help you discover opportunities and connect with the right people.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">Find Competitions</h3>
                    <p className="text-helix-text-light text-sm">Discover hackathons, science fairs, and coding competitions</p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">Connect with Teammates</h3>
                    <p className="text-helix-text-light text-sm">Find students with complementary skills for your projects</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {messages.map((message, idx) => (
            <div key={idx} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-3xl rounded-2xl p-4 ${
                message.type === 'user' 
                  ? 'bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end text-white' 
                  : 'bg-white/10 text-white border border-white/20'
              }`}>
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div className="text-xs opacity-60 mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="max-w-3xl rounded-2xl p-4 bg-white/10 text-white border border-white/20">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-helix-gradient-start"></div>
                  <span>Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="glass border-t border-white/10 p-4">
          <form onSubmit={handleSend} className="flex space-x-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask me anything about competitions, projects, or finding teammates..."
              className="flex-1 bg-white/10 border border-white/20 rounded-full px-6 py-3 text-white placeholder-helix-text-light focus:outline-none focus:border-helix-gradient-start transition-colors"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}