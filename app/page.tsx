"use client";

import Header from "@/components/ui/header";
import { WhyChooseUs } from "@/components/landing/why-choose-us";
import { HowItWorks } from "@/components/landing/how-it-works";
import CTA from "@/components/landing/cta";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e0e7ef] flex flex-col">
      {/* Header with Clerk sign in/up */}
      <Header />
      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-32 pb-12">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight bg-gradient-to-r from-[#7b61ff] to-[#5ad1ff] bg-clip-text text-transparent">
          Unlock Academic Opportunities.<br/>Build Your Future with Versate.
        </h1>
        <p className="text-lg md:text-2xl text-gray-700 mb-8 max-w-2xl mx-auto">
          Discover scholarships, competitions, summer programs, and mentors tailored to you. AI-powered matching, in-app messaging, and more—all in one place.
        </p>
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
      {/* Why Choose Us Section */}
      <WhyChooseUs />
      {/* How It Works Section */}
      <HowItWorks />
      {/* CTA Section */}
      <CTA />
    </div>
  );
}