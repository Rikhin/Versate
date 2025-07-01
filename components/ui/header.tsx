"use client";

import { SignInButton, SignUpButton, UserButton, useUser, SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import { Trophy, User, Settings, LogOut, ChevronDown, Menu, X, MessageSquare } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "./button";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Badge } from "./badge";
import { createClient } from "@/lib/supabase";

export function Header() {
  const { isSignedIn, user } = useUser();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch unread message count
  useEffect(() => {
    if (!user) return;

    const fetchUnreadCount = async () => {
      try {
        const response = await fetch("/api/messages/conversations");
        if (response.ok) {
          const conversations = await response.json();
          const totalUnread = conversations.reduce((sum: number, conv: any) => sum + conv.unreadCount, 0);
          setUnreadCount(totalUnread);
        }
      } catch (error) {
        console.error("Error fetching unread count:", error);
      }
    };

    fetchUnreadCount();

    // Set up real-time subscription for unread count
    const supabase = createClient();
    const channel = supabase.channel('unread-count-realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'messages',
        filter: `recipient_id=eq.${user.id}`
      }, () => {
        fetchUnreadCount();
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [user]);

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 md:py-6 w-full flex items-center justify-between gap-4 md:gap-8">
        {/* Left: Logo group */}
        <div className="flex items-center flex-shrink-0 min-w-[180px] md:min-w-[240px] lg:min-w-[280px] justify-start">
          <Link href="/" className="flex items-center gap-3 group">
            <Trophy className="h-7 w-7 md:h-9 md:w-9 text-black group-hover:scale-110 transition-transform" />
            <div>
              <span className="text-lg md:text-2xl font-black text-black leading-tight">Versa</span>
              <p className="text-sm md:text-base text-gray-500 -mt-1 font-semibold hidden sm:block">built by Rikhin Kavuru</p>
            </div>
          </Link>
        </div>
        {/* Center: Nav links */}
        <nav className="hidden md:flex items-center gap-8 md:gap-12 text-base md:text-lg font-bold uppercase tracking-widest mx-auto">
          <Link href="/#works" className="hover:opacity-60 transition">Features</Link>
          <Link href="/#about" className="hover:opacity-60 transition">Projects</Link>
          <Link href="/#competitions" className="hover:opacity-60 transition">Competitions</Link>
          <Link href="/dashboard/plans" className="hover:opacity-60 transition">Plans</Link>
          {isSignedIn && (
            <Link href="/messages" className="hover:opacity-60 transition relative">
              Messages
              {unreadCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              )}
            </Link>
          )}
        </nav>
        {/* Right: User actions/profile */}
        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0 justify-end min-w-[60px] md:min-w-[120px]">
          {isSignedIn ? (
            <>
              <Link href="/dashboard" className="hidden sm:block">
                <button className="px-4 md:px-6 py-2 rounded-lg border border-black text-black font-bold bg-white hover:bg-gray-100 transition text-sm md:text-base">Dashboard</button>
              </Link>
              {/* Custom User Menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-1 md:space-x-2 p-1 md:p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Avatar className="h-6 w-6 md:h-8 md:w-8">
                    <AvatarImage src={user?.imageUrl} alt={user?.fullName || 'User'} />
                    <AvatarFallback className="text-xs md:text-sm">
                      {user?.firstName?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className={`h-3 w-3 md:h-4 md:w-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 md:w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-3 md:px-4 py-2 md:py-3 border-b border-gray-100">
                      <p className="text-xs md:text-sm font-medium text-gray-900">{user?.fullName}</p>
                      <p className="text-xs text-gray-500">{user?.primaryEmailAddress?.emailAddress}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center px-3 md:px-4 py-2 text-xs md:text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <User className="h-3 w-3 md:h-4 md:w-4 mr-2 md:mr-3" />
                        View Profile
                      </Link>
                      <Link
                        href="/messages"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center px-3 md:px-4 py-2 text-xs md:text-sm text-gray-700 hover:bg-gray-100 transition-colors relative"
                      >
                        <MessageSquare className="h-3 w-3 md:h-4 md:w-4 mr-2 md:mr-3" />
                        Messages
                        {unreadCount > 0 && (
                          <Badge 
                            variant="destructive" 
                            className="ml-auto h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs"
                          >
                            {unreadCount > 99 ? '99+' : unreadCount}
                          </Badge>
                        )}
                      </Link>
                      <Link
                        href="/dashboard"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center px-3 md:px-4 py-2 text-xs md:text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <Settings className="h-3 w-3 md:h-4 md:w-4 mr-2 md:mr-3" />
                        Dashboard
                      </Link>
                    </div>
                    <div className="border-t border-gray-100 pt-1">
                      <SignOutButton>
                        <button className="flex items-center w-full px-3 md:px-4 py-2 text-xs md:text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                          <LogOut className="h-3 w-3 md:h-4 md:w-4 mr-2 md:mr-3" />
                          Sign Out
                        </button>
                      </SignOutButton>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <button className="px-3 md:px-6 py-2 rounded-lg border border-black text-black font-bold bg-white hover:bg-gray-100 transition text-sm md:text-base">Sign In</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-3 md:px-6 py-2 rounded-lg bg-black text-white font-bold hover:bg-gray-900 transition text-sm md:text-base">Sign Up</button>
              </SignUpButton>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <nav className="px-4 py-4 space-y-3">
            <Link 
              href="/#works" 
              className="block py-2 text-base font-bold uppercase tracking-widest hover:opacity-60 transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              href="/#about" 
              className="block py-2 text-base font-bold uppercase tracking-widest hover:opacity-60 transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Projects
            </Link>
            <Link 
              href="/#competitions" 
              className="block py-2 text-base font-bold uppercase tracking-widest hover:opacity-60 transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Competitions
            </Link>
            <Link 
              href="/dashboard/plans" 
              className="block py-2 text-base font-bold uppercase tracking-widest hover:opacity-60 transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Plans
            </Link>
            {isSignedIn && (
              <>
                <Link 
                  href="/dashboard" 
                  className="block py-2 text-base font-bold uppercase tracking-widest hover:opacity-60 transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/messages" 
                  className="block py-2 text-base font-bold uppercase tracking-widest hover:opacity-60 transition relative"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Messages
                  {unreadCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                    >
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </Badge>
                  )}
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
} 