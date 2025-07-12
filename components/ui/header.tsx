"use client";

import React from "react";
import Link from "next/link";
import { useUser, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Twitter, Instagram } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
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
  <span className="text-2xl font-bold text-black tracking-tight">Versate</span>
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
    href: "/dashboard", 
    label: "Dashboard" 
  },
  { 
    href: "/plans", 
    label: "Plans" 
  },
  { 
    href: "/messages", 
    label: "Messages" 
  },
];

export default function Header() {
  const { isSignedIn } = useUser();
  const { theme, setTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white backdrop-blur-xl shadow-lg border-b border-gray-200">
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
          
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
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
