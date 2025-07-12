"use client";

import Header from "@/components/ui/header";
import { WhyChooseUs } from "@/components/landing/why-choose-us";
import { HowItWorks } from "@/components/landing/how-it-works";
import CTA from "@/components/landing/cta";
import Link from "next/link";
import { Testimonials } from "@/components/landing/testimonials";
import Image from "next/image";
import { useEffect, useState } from "react";
import Plans from "../components/landing/plans";

function useTypewriter(text: string, speed = 30) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed((prev) => prev + text[i]);
      i++;
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);
  return displayed;
}

export default function Home() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const sections = document.querySelectorAll('[data-section]:not([data-section="hero"])');
    const reveal = (entry: IntersectionObserverEntry) => {
      if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
        entry.target.classList.add("show");
      }
    };
    const observer = new window.IntersectionObserver(
      (entries) => entries.forEach(reveal),
      { threshold: 0.4 }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const heroTypewriter = useTypewriter("AI-powered matching connects you with opportunities and mentors tailored to your goals", 24);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header with Clerk sign in/up */}
      <Header />
      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-56 pb-20 bg-grid" data-section="hero">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-[1.15] md:leading-[1.12] text-black" style={{ letterSpacing: '-0.01em' }}>
          Unlock Opportunities.<br/>Build Your Future with <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 bg-clip-text text-transparent">Versate</span>.
        </h1>
        <p className="text-lg md:text-2xl text-gray-700 mb-10 max-w-2xl mx-auto leading-relaxed md:leading-loose">
          {heroTypewriter}
        </p>
        <div className="flex flex-col sm:flex-row gap-6 mb-10 justify-center">
          <Link href="/sign-up" className="px-10 py-4 rounded-full bg-black text-white font-bold text-lg shadow hover:bg-gray-900 transition">Get Started</Link>
          <Link href="#how-it-works" className="px-10 py-4 rounded-full border border-black text-black font-bold text-lg shadow hover:bg-gray-100 transition">See How It Works</Link>
        </div>
        {/* Social Proof */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex -space-x-4 mb-2">
            <Image src="/placeholder-user.jpg" alt="user1" width={40} height={40} className="w-10 h-10 rounded-full border-2 border-white shadow" />
            <Image src="/placeholder-user.jpg" alt="user2" width={40} height={40} className="w-10 h-10 rounded-full border-2 border-white shadow" />
            <Image src="/placeholder-user.jpg" alt="user3" width={40} height={40} className="w-10 h-10 rounded-full border-2 border-white shadow" />
            <Image src="/placeholder-user.jpg" alt="user4" width={40} height={40} className="w-10 h-10 rounded-full border-2 border-white shadow" />
            <Image src="/placeholder-user.jpg" alt="user5" width={40} height={40} className="w-10 h-10 rounded-full border-2 border-white shadow" />
          </div>
          <span className="text-gray-700 font-medium">200+ students finding opportunities with Versate</span>
        </div>
      </main>
      {/* Why Choose Us Section */}
      <section className="py-24 bg-dots flex flex-col items-center justify-center opacity-0 translate-y-10 transition-all duration-700" data-section="why-choose-us">
        <WhyChooseUs />
      </section>
      {/* How It Works Section */}
      <section className="py-16 relative bg-diagonal" data-section="how-it-works">
        <HowItWorks />
      </section>
      {/* Divider between How It Works and Plans */}
      <div className="w-full flex justify-center items-center my-8">
        <div className="h-0.5 w-32 bg-gray-200 rounded-full" />
      </div>
      {/* Plans Section */}
      <section className="w-full py-20 bg-grid border-b border-gray-100 mt-24" data-section="plans">
        <Plans />
      </section>
      {/* Testimonials Section */}
      <section className="bg-gray-50 bg-dots w-full py-20 border-t border-gray-200 opacity-0 translate-y-10 transition-all duration-700" data-section="testimonials">
        <Testimonials showAllButton={true} />
      </section>
      {/* CTA Section */}
      <div className="bg-diagonal">
        <CTA />
      </div>
    </div>
  );
}