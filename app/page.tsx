"use client";
export const dynamic = "force-dynamic";
export const runtime = "edge";

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import { BackgroundGradient, FloatingShapes } from "@/components/scroll-animations"
import { NetworkBG } from "@/components/ui/network-bg"
import { useEffect, useRef } from 'react'
import { AnimatedWrapper } from "@/components/ui/animated-wrapper"
import { motion } from "framer-motion"
import { WhyChooseUs } from "@/components/landing/why-choose-us";
import { HowItWorks } from "@/components/landing/how-it-works";
import CTA from "@/components/landing/cta";
import { Testimonials } from "@/components/landing/testimonials";


export default function LandingPage() {
  const { isSignedIn } = useUser()

  // Typewriter effect for hero paragraph
  const fullParagraph = ` with talented students, join exciting projects, and compete in prestigious academic competitions. Build your portfolio while making lasting connections.`;
  const heroRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let i = 0;
    const totalDuration = 1100; // ms
    const intervalTime = totalDuration / fullParagraph.length;
    const interval = setInterval(() => {
      // setTyped(fullParagraph.slice(0, i)); // This line was removed
      // if (i <= connectLength) { // This line was removed
      //   setHighlightWidth((i / connectLength) * 100); // This line was removed
      // } else { // This line was removed
      //   setHighlightWidth(100); // This line was removed
      // } // This line was removed
      i++;
      if (i > fullParagraph.length) {
        clearInterval(interval);
        // setTypingDone(true); // This line was removed
      }
    }, intervalTime);
    return () => clearInterval(interval);
  }, [fullParagraph.length]);

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
          opacity={1.0}
        />
        <NetworkBG className="absolute inset-0 w-full h-full opacity-50" />
        <FloatingShapes className="absolute inset-0 w-full h-full opacity-90" />
      </div>
      <main className="relative z-10 bg-transparent">
        {/* Hero section - moved slightly up with adjusted padding */}
        <section className="relative pt-16 pb-12 sm:pt-24 sm:pb-16 lg:pt-32 lg:pb-20">
          <div className="container mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
            <div className="text-left max-w-4xl ml-4 md:ml-8 lg:ml-12">
              <AnimatedWrapper delay={0.1} type="fade">
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
                <AnimatedWrapper delay={0.4} type="slide">
                  <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold mb-2 sm:mb-4 text-left leading-[1.1] tracking-[-0.02em] font-sans">
                    <motion.span 
                      className="inline-block whitespace-nowrap"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                    >
                      Your Gateway to
                    </motion.span>
                    <br />
                    <motion.span 
                      className="inline-block"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    >
                      Academic Excellence
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
                    className="text-lg md:text-xl text-white/90 mb-8 max-w-xl text-left tracking-wide font-sans" 
                    style={{ lineHeight: '2.0' }}
                  >
                    Versate streamlines your college preparation journey with AI-powered matching to scholarships, competitions, summer programs, and mentors. Connect, communicate, and collaborate—all in one platform designed for ambitious high school students.
                  </p>
                </AnimatedWrapper>
                <AnimatedWrapper delay={1} type="scale">
                  <motion.div 
                    className="flex flex-row items-center gap-6 mt-2"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 1 }}
                  >
                    <Link href={isSignedIn ? "#" : "/sign-in"}>
                      <button 
                        className="bg-gradient-to-r from-[#7b61ff] to-[#5ad1ff] text-white font-semibold rounded-md px-6 py-3 text-base shadow-lg hover:shadow-xl hover:shadow-[#7b61ff]/30 transition-all hover:scale-105 transform duration-300 border-none"
                        disabled={isSignedIn}
                        aria-disabled={isSignedIn}
                        onClick={(e) => {
                          if (isSignedIn) {
                            e.preventDefault();
                          }
                        }}
                      >
                        {isSignedIn ? "You're Signed In" : "Get Started"}
                      </button>
                    </Link>
                    <Button 
                      variant="outline" 
                      className="px-8 py-6 text-lg bg-transparent text-white border-white/30 hover:bg-white/10 hover:border-white/50 transition-colors duration-300"
                      onClick={() => alert('Demo coming soon!')}
                    >
                      View Demo
                    </Button>
                  </motion.div>
                </AnimatedWrapper>
              </div>
            </div>
          </div>
        </section>
        {/* Competitions Preview Section */}
        {/* Removed Featured Competitions section for minimal hero-only landing */}
        <div className="mt-32 md:mt-48">
          <WhyChooseUs />
        </div>
        <HowItWorks />
        <Testimonials />
        <CTA />
      </main>
    </div>
  );
}