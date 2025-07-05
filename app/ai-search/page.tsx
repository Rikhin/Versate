"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { ChevronLeft, ChevronRight, Send, Search, MessageSquare, Users, Calendar, Award, BookOpen, Lightbulb, Zap, Sparkles, Star, Target, TrendingUp, Globe, Rocket, Brain, Code, Database, Cloud, Shield, Lock, Key, Eye, Heart, Plus, Trash2, Clock, FileText, ChevronDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useRouter } from 'next/navigation';

const VERSATE_PRIMARY = '#6366F1';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface ChatHistory {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export default function AISearchPage() {
  const { userId } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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
      } catch (e) {
        setProfilePlan('Free');
      }
    }
    fetchProfilePlan();
  }, [userId]);

  const startNewSearch = () => {
    setMessages([]);
    setHasSearched(false);
    setError('');
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const searchQuery = query.trim();
    if (!searchQuery) return;
    setLoading(true);
    setError("");
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
    } catch (err) {
      setMessages(prev => prev.map(m => m.id === aiMessageId ? { ...m, content: 'Error: Failed to get response.' } : m));
    } finally {
      setLoading(false);
    }
  };

  // Personalized greeting
  const greeting = user?.firstName ? `Welcome, ${user.firstName}!` : 'Welcome to AI Search';

  if (!userId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Please sign in to use AI Search</h1>
          <p className="text-gray-600">You need to be authenticated to access this feature.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Sidebar - Fixed to viewport, fits under header */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-[#f8f8f7] border-r border-gray-200 flex flex-col fixed left-0 top-16 h-[calc(100vh-4rem)] transition-all duration-300 overflow-hidden z-10 pb-8`}>
        {/* Top Section */}
        <div className="flex flex-col flex-1 pt-6">
          {/* Collapsed: V icon, divider, toggle button */}
          {!sidebarOpen && (
            <div className="flex flex-col items-center pt-6">
              <span className="text-3xl font-extrabold text-indigo-600 mb-2">V</span>
              <div className="w-8 border-b-2 border-indigo-200 mb-2" />
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 hover:bg-indigo-100 rounded-full transition-colors"
              >
                <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <span className="text-xl font-semibold text-indigo-500 tracking-tight">Versate</span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 hover:bg-indigo-100 rounded-full transition-colors"
                >
                  <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-200 focus:border-transparent text-sm bg-white placeholder-gray-400"
                  />
                  <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Start a New Search Button */}
              <div className="px-6 mb-2">
                <button
                  className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-500 font-medium rounded-lg py-1.5 text-sm transition shadow-none border border-indigo-100"
                  onClick={startNewSearch}
                >
                  + Start a New Search
                </button>
              </div>

              {/* Search History */}
              <div className="px-6 mb-4">
                <h3 className="text-xs font-medium text-gray-500 mb-2 tracking-wide uppercase">Search History</h3>
                <div className="space-y-2">
                  {/* chatHistory.slice(0, 3).map((chat, index) => (
                    <div key={index} className="text-xs text-gray-500 hover:bg-indigo-50 p-2 rounded cursor-pointer truncate">
                      {chat.title}
                    </div>
                  )) */}
                </div>
              </div>
            </>
          )}
        </div>
        {/* Bottom Section: Profile/plan/upgrade always visible, flush to bottom, matches chat input bar */}
        <div className="mt-auto mb-8 flex flex-col items-center px-6 w-full">
          {/* Profile icon and plan/upgrade button here */}
          <div className="flex flex-col items-center w-full">
            <div className="mb-3 flex justify-center w-full">
              <img
                src={user?.imageUrl || '/placeholder-user.jpg'}
                alt="Profile"
                className={`${sidebarOpen ? 'h-11 w-11' : 'h-8 w-8'} rounded-full border border-indigo-200 shadow-sm transition-all duration-300`}
              />
            </div>
            {sidebarOpen && (
              <>
                <div className="text-sm text-gray-400 mb-3">Current Plan: <span className="font-semibold text-indigo-400">{profilePlan}</span></div>
                <button
                  className="bg-indigo-100 text-indigo-600 text-sm px-4 py-1.5 rounded-full font-medium hover:bg-indigo-200 transition shadow-none border border-indigo-100"
                  onClick={() => router.push('/dashboard/plans')}
                >
                  Upgrade
                </button>
              </>
            )}
          </div>
        </div>
      </aside>
      
      {/* Main Content - Adjusted for fixed sidebar */}
      <main className={`flex-1 flex flex-col h-screen transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        {/* Welcome Bubble (no arrow) */}
        {!hasSearched && messages.length === 0 && (
          <div className="absolute left-1/2 top-1/4 transform -translate-x-1/2 flex flex-col items-center z-10">
            <div className="mx-auto w-96 md:w-[600px] flex flex-col items-center text-center">
              <div className="bg-indigo-100 rounded-full p-5 mb-5">
                <Sparkles className="h-10 w-10 text-indigo-500" />
              </div>
              <div className="font-bold text-3xl mb-4">Welcome, {user?.firstName || 'there'}!</div>
              <div className="text-gray-600 text-lg md:text-xl leading-relaxed">
                Ask me anything about competitions, projects, opportunities, or any topic you'd like to explore. I'm here to help you find the information you need.
              </div>
            </div>
          </div>
        )}
        {/* Chat Area */}
        <div className="flex flex-col w-full mx-auto flex-1 justify-end min-h-[60vh]" style={{ paddingTop: hasSearched || messages.length > 0 ? '2rem' : 0, paddingBottom: 0 }}>
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-8 pb-32">
            {messages.map((msg, idx) => (
              <div key={msg.id} className={`my-2 flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`rounded-lg px-4 py-2 max-w-[70%] shadow-sm text-base whitespace-pre-line ${msg.type === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
          {/* Chat Input */}
          <form onSubmit={handleSend} className={`fixed bottom-0 flex items-center bg-white border-t border-gray-200 px-8 py-4 z-20 transition-all duration-300 ${sidebarOpen ? 'left-64' : 'left-0'} right-0`} style={{ boxShadow: '0 -2px 16px 0 rgba(80,80,120,0.04)' }}>
            <Search className="h-5 w-5 text-gray-400 mr-3" />
            <input
              type="text"
              className="flex-1 border-none outline-none bg-transparent text-base placeholder-gray-400"
              placeholder="Ask me anything about competitions, projects, or opportunities..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              disabled={loading}
              autoFocus
            />
            <button
              type="submit"
              className="ml-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-2 transition disabled:opacity-50"
              disabled={loading || !query.trim()}
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
} 