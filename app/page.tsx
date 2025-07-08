"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Users, MessageSquare, Target, Star, ArrowRight, Code, Award, Zap, Rocket } from "lucide-react"
import Link from "next/link"
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs"
import { BackgroundGradient, FloatingShapes, TextFade } from "@/components/scroll-animations"
import { competitions } from "@/lib/competitions-data"
import { NetworkBG } from "@/components/ui/network-bg"
import { Inter } from 'next/font/google'
import { useState, useEffect, useRef } from 'react'

const inter = Inter({ subsets: ['latin'], weight: ['400', '700'] })

const versateGradient = "bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end";
const versateTextGradient = "bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end bg-clip-text text-transparent";
const plans = [
  {
    name: "Starter - Free",
    price: 0,
    oldPrice: null,
    description: "Get started with Versate's core features and discover your first opportunities.",
    features: [
      "\u2714\ufe0f Unlimited search of public competitions and programs",
      "\u2714\ufe0f Smart filters and recommendations",
      "\u2714\ufe0f Access to basic team matching",
      "\u2714\ufe0f Community support forum",
      "\u2714\ufe0f Save favorite opportunities",
    ],
    cta: "Get Started",
  },
  {
    name: "Plus - Lifetime Access",
    price: 49.99,
    oldPrice: 99.99,
    description: "Unlock advanced analytics, premium matching, and exclusive resources.",
    features: [
      "\u2714\ufe0f All Starter features",
      "\u2714\ufe0f Advanced team matching & AI recommendations",
      "\u2714\ufe0f Access to premium competitions & programs",
      "\u2714\ufe0f Early access to new features",
      "\u2714\ufe0f Priority support",
    ],
    cta: "Upgrade to Plus",
  },
  {
    name: "Pro - Lifetime Access",
    price: 99.99,
    oldPrice: 199.99,
    description: "For power users: full access to Versate's ecosystem, integrations, and custom tools.",
    features: [
      "\u2714\ufe0f All Plus features",
      "\u2714\ufe0f Custom integrations (Slack, Notion, etc.)",
      "\u2714\ufe0f API access & automation tools",
      "\u2714\ufe0f Dedicated onboarding & support",
      "\u2714\ufe0f Invite-only community events",
    ],
    cta: "Go Pro",
  },
];

export default function LandingPage() {
  const { isSignedIn, isLoaded } = useUser()

  const stats = [
    { label: "Active Projects", value: "500+", icon: Trophy },
    { label: "Students Connected", value: "2,000+", icon: Users },
    { label: "Successful Teams", value: "150+", icon: Award },
    { label: "Competitions Supported", value: "25+", icon: Target },
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
    <div className="min-h-screen relative overflow-hidden landing-bg">
      <NetworkBG />
      {/* Background Animations */}
      <BackgroundGradient 
        startColor="from-helix-blue/20" 
        endColor="to-helix-dark-blue/20" 
        triggerStart="top center"
        triggerEnd="center center"
      />
      <FloatingShapes 
        count={5} 
        triggerStart="top center"
        triggerEnd="bottom center"
      />
      
      {/* Main Content Container */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* Hero Section */}
        <section id="home" className="flex flex-col items-start justify-center min-h-screen w-full relative pl-12 md:pl-24">
          {/* Not backed by Y Combinator badge */}
          <div className="mb-10">
            <span className="inline-flex items-center rounded-full border border-orange-500 px-8 py-3 text-orange-500 text-lg font-semibold bg-transparent" style={{letterSpacing: '0.01em'}}>
              <span className="bg-orange-500 text-white rounded w-7 h-7 flex items-center justify-center mr-3 font-bold text-base" style={{fontFamily: 'Inter, sans-serif'}}>Y</span>
              Not Backed by Y Combinator
            </span>
          </div>
          <div ref={heroRef} className="relative z-10 flex flex-col items-start justify-center w-full parallax-hero-text">
            <h1 className="text-6xl md:text-7xl font-bold mb-4 text-left leading-tight tracking-tight">
              Enhance Your<br />
              <span className="whitespace-nowrap">High School Experience with <span className="bg-gradient-to-r from-[#7b61ff] to-[#5ad1ff] bg-clip-text text-transparent">Versa</span></span>
            </h1>
            <p className="text-xl md:text-2xl text-white/70 mb-10 max-w-2xl text-left leading-relaxed">Discover, connect, and build with the best students for competitions and projects.</p>
            <div className="flex flex-row items-center gap-8 mt-8">
              <Link href="/dashboard">
                <button className="bg-white text-black font-semibold rounded px-8 py-4 text-lg shadow-none border-none hover:bg-gray-100 transition">Go to Dashboard</button>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 md:py-16 mt-48">
          <TextFade triggerStart="top 80%" triggerEnd="bottom 20%" stagger={0.1}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center py-6">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text-helix mb-3">{stat.value}</div>
                  <div className="text-sm md:text-base text-helix-text-light uppercase tracking-widest font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </TextFade>
        </section>

        {/* Main Content Sections */}
        <div className="space-y-24">
          {/* Why Versate Section */}
          <section className="glass p-8 md:p-16 rounded-[24px] border border-white/10 shadow-xl">
            <div className="text-center mb-12">
              <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 ${inter.className}`}>
                Why <span className="gradient-text-helix">Versate?</span>
              </h2>
              <p className={`text-lg md:text-xl text-helix-text-light max-w-4xl mx-auto leading-relaxed ${inter.className}`}>
                Versate provides info and access to thousands of researchers, college admission counselors, Y-Combinator affiliates, summer programs, competitions, and communication with other student users.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 w-full">
              <div className={`rounded-full border-2 border-helix-gradient-start/30 bg-white/5 backdrop-blur-sm px-6 py-3 text-base font-semibold text-helix-gradient-start whitespace-nowrap ${inter.className}`}>Researchers</div>
              <div className={`rounded-full border-2 border-green-400/30 bg-white/5 backdrop-blur-sm px-6 py-3 text-base font-semibold text-green-400 whitespace-nowrap ${inter.className}`}>Admission Counselors</div>
              <div className={`rounded-full border-2 border-blue-400/30 bg-white/5 backdrop-blur-sm px-6 py-3 text-base font-semibold text-blue-400 whitespace-nowrap ${inter.className}`}>Y-Combinator Affiliates</div>
              <div className={`rounded-full border-2 border-purple-400/30 bg-white/5 backdrop-blur-sm px-6 py-3 text-base font-semibold text-purple-400 whitespace-nowrap ${inter.className}`}>Summer Programs</div>
              <div className={`rounded-full border-2 border-pink-400/30 bg-white/5 backdrop-blur-sm px-6 py-3 text-base font-semibold text-pink-400 whitespace-nowrap ${inter.className}`}>Competitions</div>
              <div className={`rounded-full border-2 border-gray-400/30 bg-white/5 backdrop-blur-sm px-6 py-3 text-base font-semibold text-gray-300 whitespace-nowrap ${inter.className}`}>Student Community</div>
            </div>
          </section>

          {/* Everything You Need to Succeed (Features) */}
          <section className="glass p-8 md:p-16 rounded-[24px] border border-white/10 shadow-xl">
            <div className="text-center mb-12">
              <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 ${inter.className}`}>
                Everything You Need to <span className="gradient-text-helix">Succeed</span>
              </h2>
              <p className={`text-lg md:text-xl text-helix-text-light max-w-4xl mx-auto leading-relaxed ${inter.className}`}>
                Access to thousands of researchers, college admission counselors, Y-Combinator affiliates, summer programs, competitions, and communication with other student users.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full max-w-6xl mx-auto">
              <div className="glass p-6 md:p-8 rounded-[20px] border border-white/10 text-center shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end rounded-full flex items-center justify-center mx-auto mb-4 glow">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Connect with Peers</h3>
                <p className="text-helix-text-light text-base leading-relaxed">Find like-minded students, form study groups, and collaborate on projects. Build meaningful connections that last beyond competitions.</p>
              </div>
              
              <div className="glass p-6 md:p-8 rounded-[20px] border border-white/10 text-center shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 glow">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Discover Opportunities</h3>
                <p className="text-helix-text-light text-base leading-relaxed">Access curated competitions, research programs, and mentorship opportunities. Find the perfect fit for your interests and goals.</p>
              </div>
              
              <div className="glass p-6 md:p-8 rounded-[20px] border border-white/10 text-center shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 glow">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Accelerate Growth</h3>
                <p className="text-helix-text-light text-base leading-relaxed">Get personalized recommendations, track your progress, and receive guidance from experts. Maximize your potential and achieve your goals faster.</p>
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="glass p-8 md:p-16 rounded-[24px] border border-white/10 shadow-xl">
            <div className="text-center mb-12">
              <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 ${inter.className}`}>
                <span className="gradient-text-helix">How</span> It Works
              </h2>
            </div>
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 w-full justify-center items-stretch max-w-6xl mx-auto">
              <Card className="flex-1 glass border border-white/10 rounded-[20px] shadow-lg p-6 md:p-8 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end rounded-full flex items-center justify-center mb-4 glow">
                  <span className="text-xl font-bold text-white">1</span>
                </div>
                <CardTitle className="text-xl font-semibold mb-3 text-white">Sign Up & Create Profile</CardTitle>
                <CardDescription className="text-helix-text-light text-base leading-relaxed">Tell us your interests, skills, and goals to get personalized matches and recommendations.</CardDescription>
              </Card>
              <Card className="flex-1 glass border border-white/10 rounded-[20px] shadow-lg p-6 md:p-8 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mb-4 glow">
                  <span className="text-xl font-bold text-white">2</span>
                </div>
                <CardTitle className="text-xl font-semibold mb-3 text-white">Connect & Collaborate</CardTitle>
                <CardDescription className="text-helix-text-light text-base leading-relaxed">Message, join teams, and work together on research, competitions, and projects.</CardDescription>
              </Card>
              <Card className="flex-1 glass border border-white/10 rounded-[20px] shadow-lg p-6 md:p-8 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mb-4 glow">
                  <span className="text-xl font-bold text-white">3</span>
                </div>
                <CardTitle className="text-xl font-semibold mb-3 text-white">Achieve & Grow</CardTitle>
                <CardDescription className="text-helix-text-light text-base leading-relaxed">Win competitions, publish research, and build your network with Versate's support.</CardDescription>
              </Card>
            </div>
          </section>

          {/* Supported Competitions */}
          <section className="glass p-8 md:p-16 rounded-[24px] border border-white/10 shadow-xl">
            <div className="text-center mb-12">
              <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 ${inter.className}`}>
                Supported <span className="gradient-text-helix">Competitions</span>
              </h2>
              <p className="text-lg md:text-xl text-helix-text-light max-w-4xl mx-auto leading-relaxed">We support teams participating in prestigious academic competitions worldwide</p>
            </div>
            <div className="flex flex-wrap justify-center gap-6 md:gap-8 w-full max-w-6xl mx-auto">
              {competitions.slice(0, 8).map((competition) => (
                <Link
                  key={competition.id}
                  href={`/competitions/${competition.id}`}
                  className="focus:outline-none focus:ring-4 focus:ring-helix-gradient-start/30"
                >
                  <div className="glass border border-white/10 rounded-[20px] shadow-lg px-8 py-8 w-64 h-48 hover:glow transition-all duration-300 flex flex-col items-center justify-center">
                    <span className="text-4xl mb-3">{competition.icon}</span>
                    <span className="text-lg font-semibold leading-tight text-center text-white">{competition.name}</span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="flex justify-center mt-12">
              <Link href="/competitions">
                <Button className="rounded-full bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end text-white hover:shadow-xl glow font-semibold text-lg px-10 py-4">
                  View All Competitions
                </Button>
              </Link>
            </div>
          </section>

          {/* Pricing */}
          <section className="glass p-8 md:p-16 rounded-[24px] border border-white/10 shadow-xl">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <span className={`inline-flex items-center text-base font-semibold text-white ${versateGradient} rounded-full px-6 py-3 tracking-wide glow`}>
                  <Rocket className="w-4 h-4 mr-2" />
                  One-Time Purchase, Lifetime Access
                </span>
              </div>
              <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 ${inter.className}`}>Pricing</h2>
            </div>
            <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-6 md:gap-6 justify-center items-stretch mb-12">
              {plans.map((plan, i) => (
                <div
                  key={plan.name}
                  className={`flex-1 glass border border-white/10 rounded-[20px] shadow-lg p-6 md:p-8 flex flex-col items-center min-w-[280px] max-w-sm relative transition-all duration-300 ${i === 1 ? 'border-2 border-helix-gradient-start glow' : ''}`}
                >
                  {i === 1 && (
                    <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-sm font-semibold px-4 py-1 rounded-full bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end text-white shadow-lg glow">Most Popular</span>
                  )}
                  <h2 className="text-xl font-semibold text-white mb-3">{plan.name}</h2>
                  <p className="text-helix-text-light text-base mb-4 text-center">{plan.description}</p>
                  <div className="mb-4 flex items-center gap-2">
                    {plan.oldPrice && <span className="text-helix-text-light line-through text-lg">${plan.oldPrice}</span>}
                    <span className="text-3xl font-bold gradient-text-helix">{plan.price === 0 ? "Free" : `$${plan.price}`}</span>
                    {plan.price !== 0 && <span className="text-sm text-helix-text-light font-semibold">USD</span>}
                  </div>
                  <ul className="text-left text-helix-text-light text-base space-y-2 mt-4 mb-6 w-full max-w-xs">
                    {plan.features.map((f, idx) => (
                      <li key={idx}>{f}</li>
                    ))}
                  </ul>
                  <button
                    className={`mt-auto w-full py-3 rounded-full font-semibold text-base transition-all duration-300 bg-white/10 text-white hover:bg-white/20 border border-white/20`}
                    disabled
                  >
                    {plan.cta}
                  </button>
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              {isSignedIn ? (
                <Button size="lg" className="bg-white/10 text-helix-text-light font-semibold text-lg px-10 py-4 rounded-full border border-white/20 cursor-not-allowed" disabled>
                  Join Versate Now
                </Button>
              ) : (
                <Link href="/sign-up">
                  <Button size="lg" className="bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end text-white hover:shadow-xl glow font-semibold text-lg px-10 py-4 rounded-full">
                    Join Versate Now
                  </Button>
                </Link>
              )}
            </div>
          </section>

          {/* Newsletter Signup */}
          <section className="glass p-12 md:p-20 rounded-[32px] border border-white/10 shadow-2xl">
            <div className="text-center mb-16">
              <h2 className={`text-4xl sm:text-5xl md:text-6xl font-black text-white mb-8 ${inter.className}`}>Join the Versate Newsletter</h2>
              <p className="text-xl text-helix-text-light max-w-2xl mx-auto leading-relaxed">Get the latest research, competitions, and team-building tips delivered to your inbox.</p>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const email = formData.get('email') as string;
              
              if (!email) return;
              
              try {
                const response = await fetch('/api/email/newsletter', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email })
                });
                
                if (response.ok) {
                  alert('Welcome to Versate! Check your email for a complete guide to our platform.');
                  e.currentTarget.reset();
                } else {
                  alert('Something went wrong. Please try again.');
                }
              } catch (error) {
                alert('Something went wrong. Please try again.');
              }
            }} className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl mx-auto">
              <input 
                name="email"
                type="email" 
                placeholder="Your email address" 
                className="flex-1 px-8 py-6 rounded-full border-2 border-white/20 focus:border-helix-gradient-start outline-none text-lg bg-white/10 text-white placeholder-helix-text-light backdrop-blur-sm" 
                required
              />
              <Button type="submit" className="rounded-full bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end text-white hover:shadow-xl glow font-bold text-lg px-10 py-6">
                Subscribe
              </Button>
            </form>
          </section>
        </div>

        {/* CTA Section */}
        <section id="contacts" className="py-20">
          <TextFade triggerStart="top 80%" triggerEnd="bottom 20%" stagger={0.2}>
            <Card className="glass border border-white/10 shadow-2xl">
              <CardContent className="p-12 md:p-24 text-center">
                <h2 className="text-4xl md:text-7xl md:text-8xl font-black mb-8 md:mb-12 leading-none gradient-text-helix">Ready to Build Your Dream Team?</h2>
                <p className="text-xl md:text-3xl mb-12 md:mb-16 text-helix-text-light max-w-4xl mx-auto leading-relaxed">
                  Join thousands of students who are already collaborating on amazing projects and winning competitions together.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 md:gap-8 justify-center">
                  <Link href="/dashboard">
                    <Button size="lg" variant="secondary" className="text-2xl px-16 py-8 bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end text-white hover:shadow-xl glow font-bold">
                      Get Started Now
                      <ArrowRight className="ml-4 h-8 w-8" />
                    </Button>
                  </Link>
                  <Link href="/explore">
                    <Button
                      size="lg"
                      variant="outline"
                      className="text-2xl px-16 py-8 border-2 border-white text-white hover:bg-white hover:text-helix-dark bg-transparent font-bold"
                    >
                      Explore Projects
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TextFade>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 py-20">
          <div className="flex flex-col items-center justify-center">
            <div className="flex flex-col items-center mb-12">
              <Trophy className="h-12 w-12 text-helix-gradient-start mb-4" />
              <span className="text-4xl font-black gradient-text-helix mb-2">Versate</span>
              <p className="text-lg text-helix-text-light">built by Rikhin Kavuru</p>
            </div>
            <div className="flex flex-wrap justify-center gap-8 mb-12 text-lg text-helix-text-light">
              <a href="#" className="hover:text-white transition-colors font-bold uppercase tracking-widest">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors font-bold uppercase tracking-widest">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors font-bold uppercase tracking-widest">Contact</a>
            </div>
            <div className="flex gap-6 mb-12">
              <a href="#" aria-label="Twitter" className="text-helix-text-light hover:text-helix-gradient-start transition"><svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.58-2.47.69a4.3 4.3 0 0 0 1.88-2.37 8.59 8.59 0 0 1-2.72 1.04A4.28 4.28 0 0 0 16.11 4c-2.37 0-4.29 1.92-4.29 4.29 0 .34.04.67.11.99C7.69 9.13 4.07 7.38 1.64 4.7c-.37.64-.58 1.38-.58 2.17 0 1.5.76 2.82 1.92 3.6-.7-.02-1.36-.21-1.94-.53v.05c0 2.1 1.5 3.85 3.5 4.25-.36.1-.74.16-1.13.16-.28 0-.54-.03-.8-.08.54 1.7 2.1 2.94 3.95 2.97A8.6 8.6 0 0 1 2 19.54c-.29 0-.57-.02-.85-.05A12.13 12.13 0 0 0 8.29 21.5c7.55 0 11.68-6.26 11.68-11.68 0-.18-.01-.36-.02-.54A8.18 8.18 0 0 0 24 4.59a8.36 8.36 0 0 1-2.54.7z"/></svg></a>
              <a href="#" aria-label="LinkedIn" className="text-helix-text-light hover:text-helix-gradient-start transition"><svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 11.28h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.88v1.36h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v5.59z"/></svg></a>
              <a href="#" aria-label="Email" className="text-helix-text-light hover:text-helix-gradient-start transition"><svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><path d="M12 13.065l-11.99-7.065v14h24v-14l-12.01 7.065zm11.99-9.065h-23.98l11.99 7.065 11.99-7.065z"/></svg></a>
            </div>
            <div className="border-t border-white/10 pt-12 text-center text-lg text-helix-text-light">
              <p>&copy; 2024 Versate. All rights reserved. Empowering students to achieve excellence together.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

