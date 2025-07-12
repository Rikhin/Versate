"use client";

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e0e7ef] flex flex-col">
      {/* Header */}
      <header className="w-full flex items-center justify-between px-8 py-6">
        <span className="font-bold text-2xl tracking-tight">Versate</span>
        <nav className="hidden md:flex gap-8 text-gray-700 font-medium">
          <Link href="#features" className="hover:text-black transition">Features</Link>
          <Link href="#examples" className="hover:text-black transition">Examples</Link>
          <Link href="#pricing" className="hover:text-black transition">Pricing</Link>
        </nav>
        <Link href="/sign-up" className="px-5 py-2 rounded-lg bg-black text-white font-semibold hover:bg-gray-800 transition">Sign up</Link>
      </header>
      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">Unlock Academic Opportunities.<br/>Build Your Future with Versate.</h1>
        <p className="text-lg md:text-2xl text-gray-700 mb-8 max-w-2xl">Discover scholarships, competitions, summer programs, and mentors tailored to you. AI-powered matching, in-app messaging, and more—all in one place.</p>
        <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
          <Link href="/sign-up" className="px-8 py-3 rounded-full bg-black text-white font-bold text-lg shadow-lg hover:bg-gray-800 transition">Get Started</Link>
          <Link href="#how-it-works" className="px-8 py-3 rounded-full bg-white border border-black text-black font-bold text-lg shadow-lg hover:bg-gray-100 transition">See How It Works</Link>
        </div>
        {/* Social Proof */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex -space-x-4 mb-2">
            <img src="/placeholder-user.jpg" alt="user1" className="w-10 h-10 rounded-full border-2 border-white shadow" />
            <img src="/placeholder-user.jpg" alt="user2" className="w-10 h-10 rounded-full border-2 border-white shadow" />
            <img src="/placeholder-user.jpg" alt="user3" className="w-10 h-10 rounded-full border-2 border-white shadow" />
            <img src="/placeholder-user.jpg" alt="user4" className="w-10 h-10 rounded-full border-2 border-white shadow" />
            <img src="/placeholder-user.jpg" alt="user5" className="w-10 h-10 rounded-full border-2 border-white shadow" />
          </div>
          <span className="text-gray-700 font-medium">200+ students finding opportunities with Versate</span>
        </div>
      </main>
      {/* Footer logos (optional) */}
      <footer className="w-full flex justify-center items-center py-6 mt-auto">
        {/* Add partner/tech logos here if desired */}
      </footer>
    </div>
  );
}