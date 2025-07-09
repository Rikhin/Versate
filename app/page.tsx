"use client";

import { Suspense, lazy, useState, useEffect, useRef } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trophy, Users, Award, Target, ArrowRight, Rocket, BrainCircuit, LayoutDashboard, ShieldCheck, UserPlus, LayoutTemplate, Send, PlayCircle, Zap, Infinity, AlertCircle } from "lucide-react"
import Link from "next/link"
import { SignInButton, SignUpButton, useUser } from "@clerk/nextjs"
import { BackgroundGradient, FloatingShapes } from "@/components/scroll-animations"
import { NetworkBG } from "@/components/ui/network-bg"
import { Inter } from 'next/font/google'
import { AnimatedWrapper } from "@/components/ui/animated-wrapper"
import { motion } from "framer-motion"
import { Star } from "lucide-react"

// Lazy load heavy components
const HowItWorks = lazy(() => import("@/components/landing/how-it-works"));
const Testimonials = lazy(() => import("@/components/landing/testimonials"));
const CTA = lazy(() => import("@/components/landing/cta"));

// Error fallback component
function ErrorFallback({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) {
  return (
    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg max-w-4xl mx-auto my-8">
      <div className="flex items-center gap-3 text-red-600 dark:text-red-400 mb-3">
        <AlertCircle className="h-5 w-5" />
        <h3 className="font-semibold">Something went wrong</h3>
      </div>
      <p className="text-sm text-red-700 dark:text-red-300 mb-4">
        {error.message || 'Failed to load this section.'}
      </p>
      <button
        onClick={resetErrorBoundary}
        className="text-sm px-4 py-2 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}

// Loading skeleton
function SectionSkeleton() {
  return (
    <div className="space-y-4 p-8 max-w-7xl mx-auto">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mx-auto"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-40 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        ))}
      </div>
    </div>
  );
}

const inter = Inter({ subsets: ['latin'], weight: ['400', '700'] })

const versateGradient = "bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end";
const versateTextGradient = "bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end bg-clip-text text-transparent";

function HeroStats() {
  const stats = [
    { label: "Active Projects", value: "500+", icon: Trophy },
    { label: "Students Connected", value: "750+", icon: Users },
    { label: "Successful Teams", value: "150+", icon: Award },
    { label: "Competitions Supported", value: "100+", icon: Target },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + index * 0.1 }}
        >
          <stat.icon className={`h-8 w-8 mx-auto mb-2 ${versateTextGradient}`} />
          <div className="text-2xl font-bold text-white">{stat.value}</div>
          <div className="text-sm text-gray-300">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
}

export default function LandingPage() {
  const { isSignedIn, isLoaded } = useUser()
  const [typed, setTyped] = useState('');
  const [typingDone, setTypingDone] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const fullParagraph = ` with talented students, join exciting projects, and compete in prestigious academic competitions. Build your portfolio while making lasting connections.`;

  useEffect(() => {
    let i = 0;
    const connectLength = 7; // 'Connect'.length
    const totalDuration = 1100; // ms
    const intervalTime = totalDuration / fullParagraph.length;
    
    const interval = setInterval(() => {
      if (i <= fullParagraph.length) {
        setTyped(fullParagraph.substring(0, i));
        i++;
      } else {
        clearInterval(interval);
        setTypingDone(true);
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [fullParagraph]);

  return (
    <div className="min-h-screen bg-helix-dark text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="absolute inset-0 -z-10">
          <NetworkBG />
          <div className="absolute inset-0 bg-gradient-to-b from-helix-dark/80 to-helix-darker/90" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className={versateTextGradient}>Connect</span>
              <span className="text-white">, Collaborate, and Compete</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              ref={heroRef}
            >
              <span className="font-semibold text-helix-gradient-start">Connect</span>
              {typed}
              <span className={`inline-block w-1 h-8 bg-helix-gradient-start ml-1 align-middle ${typingDone ? 'animate-pulse' : 'opacity-0'}`}></span>
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <SignUpButton mode="modal">
                <Button 
                  size="lg" 
                  className={`${versateGradient} hover:opacity-90 transition-opacity text-lg px-8 py-6 font-semibold`}
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </SignUpButton>
              <Link href="#how-it-works">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-8 py-6 border-white/20 hover:bg-white/10 hover:border-white/30 transition-colors"
                >
                  Learn More
                </Button>
              </Link>
            </motion.div>

            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <Suspense fallback={<SectionSkeleton />}>
                <HeroStats />
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-helix-darker">
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={<SectionSkeleton />}>
            <HowItWorks />
          </Suspense>
        </ErrorBoundary>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-helix-dark">
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={<SectionSkeleton />}>
            <Testimonials />
          </Suspense>
        </ErrorBoundary>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-helix-dark to-helix-darker">
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={<SectionSkeleton />}>
            <CTA />
          </Suspense>
        </ErrorBoundary>
      </section>
    </div>
  );
}
