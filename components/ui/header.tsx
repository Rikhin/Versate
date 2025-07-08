"use client";

import { SignInButton, SignUpButton, UserButton, useUser, SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import { Trophy, User, Settings, LogOut, ChevronDown, Menu, X, MessageSquare } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "./button";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Badge } from "./badge";
import { createClient } from "@/lib/supabase";
import { useOnboardingModal } from "@/components/onboarding/OnboardingScrollEnforcer";
import { useRouter } from "next/navigation";
import { FaInstagram } from 'react-icons/fa';
import { SiX } from 'react-icons/si';

export function Header() {
  const { isSignedIn, user } = useUser();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const userMenuRef = useRef<HTMLDivElement>(null);
  let showModal = false;
  try {
    const { showModal: modalState } = useOnboardingModal();
    showModal = modalState;
  } catch (error) {
    // Context not available, navigation should work normally
    showModal = false;
  }
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [findDropdownOpen, setFindDropdownOpen] = useState(false);
  const router = useRouter();

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

  useEffect(() => {
    if (showModal && findDropdownOpen) setFindDropdownOpen(false);
  }, [showModal, findDropdownOpen]);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#111216]">
      <div className="w-full flex items-center justify-between px-12" style={{maxWidth: '1200px', marginLeft: 'auto', marginRight: 'auto', minHeight: '80px'}}>
        {/* Left: Logo */}
        <div className="flex items-center gap-8 min-w-[180px]">
          <Link href="/" className="flex items-center gap-2">
            <Trophy className="w-7 h-7 text-[#7b61ff]" />
            <span className="font-black text-2xl text-white">Versate</span>
            </Link>
          </div>
        {/* Center: Nav */}
        <nav className="flex gap-10 items-center justify-center text-base font-semibold text-white">
            <div
              className="relative group"
              onMouseEnter={() => { if (!showModal) setFindDropdownOpen(true); }}
              onMouseLeave={() => setFindDropdownOpen(false)}
            >
              <button
              className="transition pointer-events-auto flex items-center gap-1 text-white hover:text-helix-gradient-start focus:text-helix-gradient-start focus:outline-none focus:ring-2 focus:ring-helix-gradient-start"
                tabIndex={showModal ? -1 : 0}
                aria-disabled={showModal}
                style={showModal ? { pointerEvents: 'none', opacity: 0.5 } : {}}
                onClick={() => { if (!showModal) setFindDropdownOpen((open) => !open); }}
              >
              Find
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </button>
              <div className="absolute left-1/2 -translate-x-1/2 w-32 h-6 top-full z-30" style={{ pointerEvents: 'auto' }} onMouseEnter={() => { if (!showModal) setFindDropdownOpen(true); }} onMouseLeave={() => setFindDropdownOpen(false)} />
              {findDropdownOpen && !showModal && (
                <div
                className="absolute left-1/2 -translate-x-1/2 mt-2 w-48 glass bg-helix-dark/90 border border-white/10 shadow-xl rounded-2xl z-60 flex flex-col"
                  onMouseEnter={() => setFindDropdownOpen(true)}
                  onMouseLeave={() => setFindDropdownOpen(false)}
                >
                <button className="py-4 px-8 text-left hover:bg-helix-gradient-start/10 text-white font-bold transition" onClick={() => { router.push('/competitions'); setFindDropdownOpen(false); }}>Competitions</button>
                <button className="py-4 px-8 text-left hover:bg-helix-gradient-start/10 text-white font-bold transition" onClick={() => { router.push('/summer-programs'); setFindDropdownOpen(false); }}>Summer Programs</button>
                <button className="py-4 px-8 text-left hover:bg-helix-gradient-start/10 text-white font-bold transition" onClick={() => { router.push('/scholarships'); setFindDropdownOpen(false); }}>Scholarships</button>
                </div>
              )}
            </div>
          <Link href="/connect" className="transition pointer-events-auto hover:text-helix-gradient-start focus:text-helix-gradient-start text-white" tabIndex={showModal ? -1 : 0} aria-disabled={showModal} style={showModal ? { pointerEvents: 'none', opacity: 0.5 } : {}}>Connect</Link>
          <Link href="/ai-search" className="transition pointer-events-auto bg-gradient-to-r from-[#7b61ff] to-[#5ad1ff] bg-clip-text text-transparent font-bold hover:opacity-90 focus:opacity-90" tabIndex={showModal ? -1 : 0} aria-disabled={showModal} style={showModal ? { pointerEvents: 'none', opacity: 0.5 } : {}}>AI Search</Link>
          <Link href="/dashboard/plans" className="transition pointer-events-auto hover:text-helix-gradient-start focus:text-helix-gradient-start text-white" tabIndex={showModal ? -1 : 0} aria-disabled={showModal} style={showModal ? { pointerEvents: 'none', opacity: 0.5 } : {}}>Plans</Link>
            {isSignedIn && (
            <Link href="/messages" className="transition relative pointer-events-auto hover:text-helix-gradient-start focus:text-helix-gradient-start text-white" tabIndex={showModal ? -1 : 0} aria-disabled={showModal} style={showModal ? { pointerEvents: 'none', opacity: 0.5 } : {}}>
                Messages
                {unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end text-white font-bold shadow-lg"
                  >
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Badge>
                )}
              </Link>
            )}
          </nav>
        {/* Right: Social, dashboard/profile */}
        <div className="flex items-center gap-8 min-w-[180px] justify-end">
          <a href="https://twitter.com/rikhinkavuru" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform text-white/80 hover:text-[#1da1f2]">
            <SiX className="w-6 h-6" />
          </a>
          <a href="https://instagram.com/rikhin_kavuru" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform text-white/80 hover:text-[#e1306c]">
            <FaInstagram className="w-6 h-6" />
          </a>
          {/* Hamburger menu for mobile */}
          <button
            className="sm:hidden flex items-center justify-center p-2 rounded-md hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-helix-gradient-start ml-2 w-10 h-10"
            onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
            aria-label="Open menu"
            aria-expanded={mobileDropdownOpen}
          >
            <span className="flex flex-col items-center justify-center w-6 h-6 gap-1">
              <span className="block w-6 h-0.5 bg-white rounded"></span>
              <span className="block w-6 h-0.5 bg-white rounded"></span>
              <span className="block w-6 h-0.5 bg-white rounded"></span>
            </span>
          </button>
          {/* Right: User actions/profile */}
          <div className="flex items-center flex-shrink-0 min-w-[120px] md:min-w-[160px] lg:min-w-[180px] justify-end gap-4 md:gap-6">
          {isSignedIn ? (
            <>
                <Link href="/dashboard" className="hidden sm:block pointer-events-auto" tabIndex={showModal ? -1 : 0} aria-disabled={showModal} style={showModal ? { pointerEvents: 'none', opacity: 0.5 } : {}}>
                  <button className="px-4 py-2 rounded-full border-2 border-white/20 text-white font-bold bg-white/10 hover:bg-helix-gradient-start/20 transition text-base shadow-md">Dashboard</button>
              </Link>
              {/* Custom User Menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                    onClick={() => !showModal && setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-2 rounded-full hover:bg-white/10 transition-colors border-2 border-white/10"
                    disabled={showModal}
                    aria-disabled={showModal}
                    tabIndex={showModal ? -1 : 0}
                    style={showModal ? { pointerEvents: 'none', opacity: 0.5 } : {}}
                >
                    <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.imageUrl} alt={user?.fullName || 'User'} />
                      <AvatarFallback className="text-lg bg-white/10 text-white">
                      {user?.firstName?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                    <ChevronDown className={`h-4 w-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                  {isUserMenuOpen && !showModal && (
                    <div className="absolute right-0 mt-2 w-56 glass bg-helix-dark/95 rounded-2xl shadow-xl border border-white/10 py-2 z-50">
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-sm font-bold text-white">{user?.fullName}</p>
                        <p className="text-xs text-helix-text-light">{user?.primaryEmailAddress?.emailAddress}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center px-4 py-3 text-base text-white hover:bg-helix-gradient-start/10 font-bold rounded-xl transition-colors"
                          tabIndex={showModal ? -1 : 0}
                          aria-disabled={showModal}
                          style={showModal ? { pointerEvents: 'none', opacity: 0.5 } : {}}
                      >
                        <User className="h-3 w-3 md:h-4 md:w-4 mr-2 md:mr-3" />
                        View Profile
                      </Link>
                        <Link
                          href="/messages"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center px-4 py-3 text-base text-white hover:bg-helix-gradient-start/10 font-bold rounded-xl transition-colors"
                          tabIndex={showModal ? -1 : 0}
                          aria-disabled={showModal}
                          style={showModal ? { pointerEvents: 'none', opacity: 0.5 } : {}}
                        >
                          <MessageSquare className="h-3 w-3 md:h-4 md:w-4 mr-2 md:mr-3" />
                          Messages
                          {unreadCount > 0 && (
                            <Badge 
                              variant="destructive" 
                              className="ml-auto h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end text-white font-bold shadow-lg"
                            >
                              {unreadCount > 99 ? '99+' : unreadCount}
                            </Badge>
                          )}
                        </Link>
                      <Link
                        href="/dashboard"
                        onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center px-4 py-3 text-base text-white hover:bg-helix-gradient-start/10 font-bold rounded-xl transition-colors"
                          tabIndex={showModal ? -1 : 0}
                          aria-disabled={showModal}
                          style={showModal ? { pointerEvents: 'none', opacity: 0.5 } : {}}
                      >
                        <Settings className="h-3 w-3 md:h-4 md:w-4 mr-2 md:mr-3" />
                        Dashboard
                      </Link>
                    </div>
                      <div className="border-t border-white/10 pt-1">
                      <SignOutButton>
                          <button className="flex items-center w-full px-4 py-3 text-base text-white hover:bg-helix-gradient-start/10 font-bold rounded-xl transition-colors" disabled={showModal}>
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
                <button className="px-2 md:px-4 py-2 rounded-lg border border-black text-black font-semibold bg-white hover:bg-gray-100 transition text-xs md:text-sm" disabled={showModal}>Sign In</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-2 md:px-4 py-2 rounded-lg bg-black text-white font-semibold hover:bg-gray-900 transition text-xs md:text-sm" disabled={showModal}>Sign Up</button>
              </SignUpButton>
            </>
          )}
          </div>
        </div>
      </div>

      {/* Mobile dropdown nav */}
      {mobileDropdownOpen && (
        <div className="absolute left-0 top-full w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-lg z-40 flex flex-col items-center py-4 sm:hidden">
          {/* <Link href="/#works" className="py-3 px-6 w-full text-center text-base font-semibold hover:bg-gray-100" onClick={() => setMobileDropdownOpen(false)}>Features</Link> */}
          <div className="w-full">
            <button
              className="py-3 px-6 w-full text-center text-base font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white flex items-center justify-center gap-2"
              onClick={() => {
                const dropdown = document.getElementById('mobile-find-dropdown');
                if (dropdown) dropdown.classList.toggle('hidden');
              }}
            >
              Find <ChevronDown className="h-4 w-4 inline" />
            </button>
            <div id="mobile-find-dropdown" className="hidden w-full bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
              <button
                className="py-3 px-6 w-full text-left text-base font-normal hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white"
                onClick={() => { window.location.href = '/competitions'; setMobileDropdownOpen(false); }}
              >Competitions</button>
              <button
                className="py-3 px-6 w-full text-left text-base font-normal hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white"
                onClick={() => { window.location.href = '/summer-programs'; setMobileDropdownOpen(false); }}
              >Summer Programs</button>
              <button
                className="py-3 px-6 w-full text-left text-base font-normal hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white"
                onClick={() => { window.location.href = '/scholarships'; setMobileDropdownOpen(false); }}
              >Scholarships</button>
            </div>
          </div>
          <Link href="/connect" className="py-3 px-6 w-full text-center text-base font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white" onClick={() => setMobileDropdownOpen(false)}>Connect</Link>
          <Link href="/ai-search" className="py-3 px-6 w-full text-center text-base font-semibold text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20" onClick={() => setMobileDropdownOpen(false)}>AI Search</Link>
          <Link href="/dashboard/plans" className="py-3 px-6 w-full text-center text-base font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white" onClick={() => setMobileDropdownOpen(false)}>Plans</Link>
          {isSignedIn && (
            <Link href="/messages" className="py-3 px-6 w-full text-center text-base font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white" onClick={() => setMobileDropdownOpen(false)}>
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
          )}
        </div>
      )}
    </header>
  );
} 