"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trophy, Users, Award, Target, ArrowRight, Rocket } from "lucide-react"
import Link from "next/link"
import { SignInButton, SignUpButton, useUser } from "@clerk/nextjs"
import { BackgroundGradient, FloatingShapes } from "@/components/scroll-animations"
import { NetworkBG } from "@/components/ui/network-bg"
import { Inter } from 'next/font/google'
import { useState, useEffect, useRef } from 'react'
import { AnimatedWrapper } from "@/components/ui/animated-wrapper"
import { motion } from "framer-motion"

// Import new components
import { WhyChooseUs } from "@/components/landing/why-choose-us"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Testimonials } from "@/components/landing/testimonials"
import { CTA } from "@/components/landing/cta"

const inter = Inter({ subsets: ['latin'], weight: ['400', '700'] })

const versateGradient = "bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end";
const versateTextGradient = "bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end bg-clip-text text-transparent";

export default function LandingPage() {
  const { isSignedIn, isLoaded } = useUser()

  const stats = [
    { label: "Active Projects", value: "500+", icon: Trophy },
    { label: "Students Connected", value: "750+", icon: Users },
    { label: "Successful Teams", value: "150+", icon: Award },
    { label: "Competitions Supported", value: "100+", icon: Target },
  ]

  // Typewriter effect for hero paragraph
  const fullParagraph = ` with talented students, join exciting projects, and compete in prestigious academic competitions. Build your portfolio while making lasting connections.`;
  const [typed, setTyped] = useState('');
  const [typingDone, setTypingDone] = useState(false);
  const [highlightWidth, setHighlightWidth] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let i = 0;
    const connectLength = 7; // 'Connect'.length
    const totalDuration = 1100; // ms
    const intervalTime = totalDuration / fullParagraph.length;
    const interval = setInterval(() => {
      setTyped(fullParagraph.slice(0, i));
      if (i <= connectLength) {
        setHighlightWidth((i / connectLength) * 100);
      } else {
        setHighlightWidth(100);
      }
      i++;
      if (i > fullParagraph.length) {
        clearInterval(interval);
        setTypingDone(true);
      }
    }, intervalTime);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const max = 240; // px before effect maxes out
      const progress = Math.min(scrollY / max, 1);
      if (heroRef.current) {
        heroRef.current.style.transform = `translateY(-${progress * 40}px) scale(${1 - progress * 0.05})`;
        heroRef.current.style.opacity = `${1 - progress * 0.25}`;
      }
      if (orbRef.current) {
        orbRef.current.style.transform = `translateY(-${progress * 80}px) scale(${1 + progress * 0.08})`;
        orbRef.current.style.opacity = `${0.3 - progress * 0.15}`;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden antialiased bg-transparent">
      {/* Enhanced Background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <BackgroundGradient 
          className="absolute inset-0 w-full h-full" 
          startColor="from-[#0f0c29]"
          endColor="to-[#302b63]"
          opacity={0.9}
        />
        <NetworkBG className="absolute inset-0 w-full h-full opacity-30" />
        <FloatingShapes className="absolute inset-0 w-full h-full opacity-70" />
      </div>
      
      {/* Main Content Container */}
      <main className="relative z-10 bg-transparent">
        {/* Hero section - left aligned */}
        <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 lg:pt-40 lg:pb-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-left max-w-4xl">
              <AnimatedWrapper delay={0.1} type="fade" direction="up">
                <div className="mb-4 sm:mb-6 inline-block">
                  <motion.span 
                    className="inline-flex items-center rounded-full border border-orange-500/50 px-4 py-1.5 text-sm font-semibold text-orange-400 bg-orange-500/10 backdrop-blur-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <span className="bg-orange-500 text-white rounded w-5 h-5 flex items-center justify-center mr-2 font-bold text-xs" style={{fontFamily: 'Inter, sans-serif'}}>Y</span>
                    Not Backed by Y Combinator
                  </motion.span>
                </div>
              </AnimatedWrapper>
              <div ref={heroRef} className="relative z-10 flex flex-col items-start justify-center w-full parallax-hero-text">
                <AnimatedWrapper delay={0.4} type="slide" direction="up">
                  <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold mb-2 sm:mb-4 text-left leading-[1.1] tracking-[-0.02em] font-sans">
                    <motion.span 
                      className="inline-block whitespace-nowrap"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                    >
                      Enhance Your High
                    </motion.span>
                    <br />
                    <motion.span 
                      className="inline-block"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    >
                      School Experience
                    </motion.span>
                    <br />
                    <motion.span 
                      className="inline-flex items-baseline"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                    >
                      with <span className="bg-gradient-to-r from-[#7b61ff] to-[#5ad1ff] bg-clip-text text-transparent ml-2">Versate</span>
                    </motion.span>
                  </h1>
                </AnimatedWrapper>
                
                <AnimatedWrapper delay={0.8} type="fade">
                  <p 
                    className="text-lg md:text-xl text-white/90 mb-8 max-w-xl text-left leading-relaxed tracking-wide font-sans" 
                    style={{ lineHeight: '1.7' }}
                  >
                    Discover, connect, and build with the best students for competitions and projects.
                  </p>
                </AnimatedWrapper>
                
                <AnimatedWrapper delay={1} type="scale">
                  <motion.div 
                    className="flex flex-row items-center gap-6 mt-2"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 1 }}
                  >
                    <Link href="/dashboard">
                      <button className="bg-gradient-to-r from-[#7b61ff] to-[#5ad1ff] text-white font-semibold rounded-md px-6 py-3 text-base shadow-lg hover:shadow-xl hover:shadow-[#7b61ff]/30 transition-all hover:scale-105 transform duration-300 border-none">
                        Go to Dashboard
                      </button>
                    </Link>
                    <Link href="#features">
                      <button className="bg-transparent text-white font-semibold rounded-md px-6 py-3 text-base border border-white/30 hover:bg-white/10 transition hover:scale-105 transform transition-transform duration-300">
                        Learn More
                      </button>
                    </Link>
                  </motion.div>
                </AnimatedWrapper>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Sections with enhanced spacing */}
        <div className="relative z-10 space-y-32 py-20">
          {/* Why Choose Us Section */}
          <WhyChooseUs />

          {/* How It Works Section */}
          <HowItWorks />

          {/* Testimonials Section */}
          <Testimonials />

          {/* Final CTA Section */}
          <CTA />
        </div>
      </main>
    </div>
  )
}

