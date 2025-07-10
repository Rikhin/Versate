"use client";

import React, { useState } from 'react';
import { useUser, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import { User } from 'lucide-react';
import Link from 'next/link';

const Header = () => {
  const { isSignedIn } = useUser();
  const [showModal, setShowModal] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-foreground">
          Versate
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/about" className="text-foreground/80 hover:text-foreground transition-colors">
            About
          </Link>
          <Link href="/features" className="text-foreground/80 hover:text-foreground transition-colors">
            Features
          </Link>
          <Link href="/pricing" className="text-foreground/80 hover:text-foreground transition-colors">
            Pricing
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-foreground/80 hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <UserButton afterSignOutUrl="/" />
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <SignInButton mode="modal">
                <button 
                  className="px-4 py-2 rounded-lg border-2 border-white/20 font-semibold bg-gradient-to-r from-helix-gradient-start/90 to-helix-gradient-end/90 text-white hover:from-helix-gradient-start hover:to-helix-gradient-end hover:shadow-lg hover:shadow-helix-gradient-start/20 transition-all duration-200 text-sm md:text-base flex items-center gap-2"
                  disabled={showModal}
                  style={showModal ? { opacity: 0.5, pointerEvents: 'none' } : {}}
                >
                  <User className="h-4 w-4" />
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button 
                  className="px-4 py-2 rounded-lg bg-white text-helix-gradient-start font-bold hover:bg-white/90 transition-all duration-200 text-sm md:text-base shadow-md hover:shadow-lg"
                  disabled={showModal}
                  style={showModal ? { opacity: 0.5, pointerEvents: 'none' } : {}}
                >
                  Get Started
                </button>
              </SignUpButton>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
