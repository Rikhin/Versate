"use client";

import Link from 'next/link';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#fff7f0] flex flex-col">
      {/* Header */}
      <header className="w-full flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xl tracking-tight">Versate</span>
        </div>
        <nav className="hidden md:flex gap-8 text-gray-700 font-medium">
          <Link href="#features" className="hover:text-black transition">Features</Link>
          <Link href="#examples" className="hover:text-black transition">Examples</Link>
          <Link href="#pricing" className="hover:text-black transition">Pricing</Link>
        </nav>
        <Link href="/sign-in" className="px-5 py-2 bg-black text-white rounded-full font-semibold hover:bg-gray-900 transition">Sign up</Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight text-gray-900">
          Unlock Academic Opportunities.<br />
          Build Your Future with Versate.
        </h1>
        <p className="text-lg md:text-2xl text-gray-700 mb-10 max-w-2xl mx-auto">
          Discover scholarships, competitions, summer programs, and mentors tailored to you. AI-powered matching, in-app messaging, and more—all in one place.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link 
            href="/sign-in" 
            className="px-8 py-4 bg-black text-white rounded-full font-semibold text-lg shadow-lg hover:bg-gray-900 transition"
          >
            Get Started
          </Link>
          <Link 
            href="/test" 
            className="px-8 py-4 border-2 border-black text-black rounded-full font-semibold text-lg hover:bg-gray-100 transition"
          >
            See How It Works
          </Link>
        </div>
        {/* Social Proof */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex -space-x-2">
            <img src="/placeholder-user.jpg" alt="user1" className="w-8 h-8 rounded-full border-2 border-white" />
            <img src="/placeholder-user.jpg" alt="user2" className="w-8 h-8 rounded-full border-2 border-white" />
            <img src="/placeholder-user.jpg" alt="user3" className="w-8 h-8 rounded-full border-2 border-white" />
            <img src="/placeholder-user.jpg" alt="user4" className="w-8 h-8 rounded-full border-2 border-white" />
            <img src="/placeholder-user.jpg" alt="user5" className="w-8 h-8 rounded-full border-2 border-white" />
          </div>
          <span className="text-gray-600 text-sm mt-1">200+ students finding opportunities with Versate</span>
        </div>
      </main>

      {/* Subtle background effect */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#fff7f0] via-[#fbeee6] to-[#f7e6d7] opacity-80" />
        <div className="absolute inset-0 rounded-[40px] border border-[#fbeee6] opacity-60 m-8" />
      </div>
    </div>
  );
}