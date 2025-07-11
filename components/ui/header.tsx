"use client";

import React from "react";
import Link from "next/link";
import { useUser, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { User, Twitter, Instagram } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

const navLinks = [
  { href: "/ai-search", label: "AI Search" },
  { href: "/connect", label: "Connect" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/plans", label: "Plans" },
  { href: "/messages", label: "Messages" },
];

export default function Header() {
  const { isSignedIn } = useUser();
  const { theme, setTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-br from-[#0f0c29]/90 to-[#302b63]/90 backdrop-blur-xl shadow-lg border-b border-white/10">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-medium tracking-tight text-helix-gradient-start" style={{letterSpacing: '0.01em'}}>
          Versate
        </Link>
        <nav className="hidden md:flex items-center gap-10 ml-12">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-helix-gradient-start hover:text-helix-gradient-start transition-colors font-medium text-base px-2 py-1 rounded-md hover:bg-helix-gradient-start/5 bg-transparent">Find</NavigationMenuTrigger>
                <NavigationMenuContent className="bg-white border border-helix-gradient-start/10 rounded-xl shadow p-3 min-w-[200px]">
                  <ul className="flex flex-col gap-1">
                    <li>
                      <Link href="/competitions" legacyBehavior passHref>
                        <NavigationMenuLink className="block px-2 py-1 rounded-md hover:bg-helix-gradient-start/5 text-helix-gradient-start font-medium text-base">Competitions</NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link href="/scholarships" legacyBehavior passHref>
                        <NavigationMenuLink className="block px-2 py-1 rounded-md hover:bg-helix-gradient-start/5 text-helix-gradient-start font-medium text-base">Scholarships</NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link href="/summer-programs" legacyBehavior passHref>
                        <NavigationMenuLink className="block px-2 py-1 rounded-md hover:bg-helix-gradient-start/5 text-helix-gradient-start font-medium text-base">Summer Programs</NavigationMenuLink>
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              {navLinks.map((link) => (
                <NavigationMenuItem key={link.href}>
                  <Link href={link.href} className="text-helix-gradient-start hover:text-helix-gradient-start transition-colors font-medium text-base px-2 py-1 rounded-md hover:bg-helix-gradient-start/5">
                    {link.label}
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>
        <div className="flex items-center gap-4">
          <a href="https://x.com/versatehq" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="text-white/80 hover:text-white">
            <Twitter className="h-6 w-6" />
          </a>
          <a href="https://instagram.com/versatehq" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white/80 hover:text-white">
            <Instagram className="h-6 w-6" />
          </a>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-white hover:bg-white/10"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          {isSignedIn ? (
            <div className="flex items-center gap-2">
              <UserButton afterSignOutUrl="/" />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <SignInButton mode="modal">
                <Button variant="outline" className="text-white border-white/20 bg-transparent hover:bg-white/10 transition-all duration-200 text-base font-medium flex items-center gap-2 px-5 py-1.5 rounded-md">
                  <User className="h-5 w-5" />
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button variant="secondary" className="bg-white text-helix-gradient-start font-medium hover:bg-white/90 transition-all duration-200 text-base shadow-md hover:shadow-lg px-5 py-1.5 rounded-md">
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
