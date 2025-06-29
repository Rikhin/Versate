"use client";

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Trophy } from "lucide-react";

export function Header() {
  const { isSignedIn } = useUser();

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
              <UserButton afterSignOutUrl="/" />
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