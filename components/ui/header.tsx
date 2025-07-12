"use client";

import React from "react";
import Link from "next/link";
import { useUser, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Twitter, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

// Custom logo component
const Logo = () => (
  <span className="flex items-center gap-2">
    {/* Classic trophy outline SVG (cup, handles, base) */}
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="black" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-black">
      <ellipse cx="16" cy="8" rx="8" ry="4" />
      <path d="M8 8v4c0 4.418 3.582 8 8 8s8-3.582 8-8V8" />
      <path d="M8 12c-3 0-4 2-4 4s1 4 4 4" />
      <path d="M24 12c3 0 4 2 4 4s-1 4-4 4" />
      <rect x="12" y="20" width="8" height="3" rx="1.5" />
      <rect x="13.5" y="23" width="5" height="2.5" rx="1.25" />
    </svg>
    <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 bg-clip-text text-transparent">Versate</span>
  </span>
);

const navLinks = [
  { 
    href: "/ai-search", 
    label: "AI Search",
    featured: true
  },
  { 
    href: "/connect", 
    label: "Connect" 
  },
  { 
    href: "/plans", 
    label: "Plans" 
  }
  // Messages tab will be conditionally rendered below
];

export default function Header() {
  const { isSignedIn } = useUser();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white backdrop-blur-xl shadow-lg border-b border-gray-200 transition-colors duration-300">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">
        <Link href="/" className="transition-transform hover:scale-105 active:scale-95">
          <Logo />
        </Link>
        
        <nav className="hidden md:flex items-center gap-8 ml-12">
          <NavigationMenu>
            <NavigationMenuList className="gap-2">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-gray-700 font-medium text-base px-3 py-2 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  Find
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-white border border-gray-200 rounded-xl shadow-xl p-2 min-w-[220px]">
                  <ul className="flex flex-col gap-1">
                    <li>
                      <Link href="/competitions" legacyBehavior passHref>
                        <NavigationMenuLink className="block px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-colors">
                          Competitions
                        </NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link href="/scholarships" legacyBehavior passHref>
                        <NavigationMenuLink className="block px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-colors">
                          Scholarships
                        </NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link href="/summer-programs" legacyBehavior passHref>
                        <NavigationMenuLink className="block px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-colors">
                          Summer Programs
                        </NavigationMenuLink>
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              
              {navLinks.map((link) => (
                <NavigationMenuItem key={link.href}>
                  <Link 
                    href={link.href} 
                    className={cn(
                      "px-4 py-2 rounded-lg font-medium text-base transition-colors",
                      link.featured 
                        ? "bg-gray-200 text-gray-900 hover:opacity-90 shadow-lg hover:shadow-gray-500/20"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    )}
                  >
                    {link.label}
                  </Link>
                </NavigationMenuItem>
              ))}
              {/* Conditionally render Messages tab if signed in */}
              {isSignedIn && (
                <NavigationMenuItem key="/messages">
                  <Link 
                    href="/messages" 
                    className="px-4 py-2 rounded-lg font-medium text-base transition-colors text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  >
                    Messages
                  </Link>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>
        
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 border-r border-gray-200 pr-3">
            <a 
              href="https://x.com/versatehq" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="X (Twitter)" 
              className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a 
              href="https://instagram.com/versatehq" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Instagram" 
              className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Instagram className="h-5 w-5" />
            </a>
          </div>
          
          {isSignedIn ? (
            <div className="ml-1">
              <UserButton afterSignOutUrl="/" />
            </div>
          ) : (
            <div className="flex items-center gap-2 ml-1">
              <SignInButton mode="modal">
                <Button 
                  variant="outline" 
                  className="bg-transparent border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all font-medium px-4 h-9 rounded-lg"
                >
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button 
                  className="bg-gray-200 text-gray-900 hover:opacity-90 hover:shadow-lg hover:shadow-gray-500/20 transition-all font-medium px-5 h-9 rounded-lg"
                >
                  Get Started
                </Button>
              </SignUpButton>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
