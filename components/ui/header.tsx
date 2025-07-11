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
  { href: "/connect", label: "Connect" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/plans", label: "Plans" },
];

export default function Header() {
  const { isSignedIn } = useUser();
  const { theme, setTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-br from-[#181c2a]/80 to-[#232946]/80 backdrop-blur-xl shadow-lg border-b border-white/10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-[#7b61ff] to-[#5ad1ff] bg-clip-text text-transparent">
          Versate
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-white/90 hover:text-white transition-colors font-medium text-lg px-2 py-1 rounded-lg hover:bg-white/10 bg-transparent">Find</NavigationMenuTrigger>
                <NavigationMenuContent className="bg-helix-dark-blue border border-white/10 rounded-xl shadow-xl p-4 min-w-[220px]">
                  <ul className="flex flex-col gap-2">
                    <li>
                      <Link href="/competitions" legacyBehavior passHref>
                        <NavigationMenuLink className="block px-3 py-2 rounded-lg hover:bg-white/10 text-white/90 font-medium">Competitions</NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link href="/scholarships" legacyBehavior passHref>
                        <NavigationMenuLink className="block px-3 py-2 rounded-lg hover:bg-white/10 text-white/90 font-medium">Scholarships</NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link href="/summer-programs" legacyBehavior passHref>
                        <NavigationMenuLink className="block px-3 py-2 rounded-lg hover:bg-white/10 text-white/90 font-medium">Summer Programs</NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link href="/messages" legacyBehavior passHref>
                        <NavigationMenuLink className="block px-3 py-2 rounded-lg hover:bg-white/10 text-white/90 font-medium">Messages</NavigationMenuLink>
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              {navLinks.map((link) => (
                <NavigationMenuItem key={link.href}>
                  <Link href={link.href} className="text-white/90 hover:text-white transition-colors font-medium text-lg px-2 py-1 rounded-lg hover:bg-white/10">
                    {link.label}
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>
        <div className="flex items-center gap-3">
          <a href="https://x.com/versatehq" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="text-white/80 hover:text-white">
            <Twitter className="h-5 w-5" />
          </a>
          <a href="https://instagram.com/versatehq" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white/80 hover:text-white">
            <Instagram className="h-5 w-5" />
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
                <Button variant="outline" className="text-white border-white/20 bg-gradient-to-r from-helix-gradient-start/90 to-helix-gradient-end/90 hover:from-helix-gradient-start hover:to-helix-gradient-end hover:shadow-lg hover:shadow-helix-gradient-start/20 transition-all duration-200 text-base flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button variant="secondary" className="bg-white text-helix-gradient-start font-bold hover:bg-white/90 transition-all duration-200 text-base shadow-md hover:shadow-lg">
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
