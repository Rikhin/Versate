"use client";

import { SignInButton, SignUpButton, UserButton, useUser, SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import { Trophy, User, Settings, LogOut, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "./button";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

export function Header() {
  const { isSignedIn, user } = useUser();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
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

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between gap-8">
        {/* Logo and subtitle */}
        <Link href="/" className="flex items-center gap-3 group">
          <Trophy className="h-8 w-8 text-black group-hover:scale-110 transition-transform" />
          <div>
            <span className="text-2xl font-black text-black leading-tight">ColabBoard</span>
            <p className="text-xs text-gray-500 -mt-1 font-medium">built by Rikhin Kavuru</p>
          </div>
        </Link>
        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-12 text-lg font-bold uppercase tracking-widest">
          <Link href="/#works" className="hover:opacity-60 transition">Features</Link>
          <Link href="/#competitions" className="hover:opacity-60 transition">Competitions</Link>
          <Link href="/#about" className="hover:opacity-60 transition">Projects</Link>
        </nav>
        {/* Auth buttons or user */}
        <div className="flex items-center gap-3">
          {isSignedIn ? (
            <>
              <Link href="/dashboard">
                <button className="px-6 py-2 rounded-lg border border-black text-black font-bold bg-white hover:bg-gray-100 transition">Dashboard</button>
              </Link>
              {/* Custom User Menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.imageUrl} alt={user?.fullName || 'User'} />
                    <AvatarFallback className="text-sm">
                      {user?.firstName?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
                      <p className="text-xs text-gray-500">{user?.primaryEmailAddress?.emailAddress}</p>
                    </div>
                    
                    <div className="py-1">
                      <Link
                        href="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <User className="h-4 w-4 mr-3" />
                        View Profile
                      </Link>
                      
                      <Link
                        href="/dashboard"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <Settings className="h-4 w-4 mr-3" />
                        Dashboard
                      </Link>
                    </div>
                    
                    <div className="border-t border-gray-100 pt-1">
                      <SignOutButton>
                        <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                          <LogOut className="h-4 w-4 mr-3" />
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
                <button className="px-6 py-2 rounded-lg border border-black text-black font-bold bg-white hover:bg-gray-100 transition">Sign In</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-6 py-2 rounded-lg bg-black text-white font-bold hover:bg-gray-900 transition">Sign Up</button>
              </SignUpButton>
            </>
          )}
        </div>
      </div>
    </header>
  );
} 