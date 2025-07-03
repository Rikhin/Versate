"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Users, MessageSquare, Target, Star, ArrowRight, Code, Award, Zap } from "lucide-react"
import Link from "next/link"
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs"
import { BackgroundGradient, FloatingShapes, TextFade } from "@/components/scroll-animations"
import { competitions } from "@/lib/competitions-data"
import { NetworkBG } from "@/components/ui/network-bg"
import { Inter } from 'next/font/google'
import React, { useState, useEffect } from 'react'

const inter = Inter({ subsets: ['latin'], weight: ['400', '700'] })

export default function LandingPage() {
  const { isSignedIn } = useUser()

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

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <NetworkBG />
      {/* Background Animations */}
      <BackgroundGradient 
        startColor="from-gray-50/50" 
        endColor="to-gray-100/50" 
        triggerStart="top center"
        triggerEnd="center center"
      />
      <FloatingShapes 
        count={5} 
        triggerStart="top center"
        triggerEnd="bottom center"
      />
      
      {/* Main Content Container */}
      <div className="relative z-10 mx-auto" style={{maxWidth: '1200px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '24px', paddingRight: '24px'}}>
        {/* Hero Section */}
        <section id="home" className="container mx-auto px-4 md:px-8 py-8 md:py-20 text-left">
          <TextFade triggerStart="top 80%" triggerEnd="center center" stagger={0.2}>
            <div className="max-w-6xl mx-auto relative flex flex-col items-center justify-center text-center">
              <div className="text-3xl sm:text-4xl md:text-7xl font-semibold text-black mb-6 sm:mb-8 md:mb-14 flex flex-col items-center leading-snug">
                <span>Find Your</span>
                <span>Perfect</span>
                <span className="inline-block">
                  <span className="bg-gradient-to-r from-blue-600 via-green-500 to-purple-600 bg-clip-text text-transparent font-semibold text-4xl sm:text-5xl md:text-7xl">Team</span>
                </span>
              </div>
              <p className="mb-8 sm:mb-12 md:mb-16 max-w-3xl mx-auto leading-relaxed md:leading-loose text-black text-base sm:text-lg md:text-xl font-normal text-center" style={{ letterSpacing: '0.01em', fontWeight: 300 }}>
                <span className="text-black font-normal text-base sm:text-lg md:text-xl relative">Connect</span>{typed}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center w-full max-w-md mx-auto">
                {isSignedIn ? (
                  <Link href="/dashboard" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto text-lg sm:text-xl px-6 sm:px-12 py-4 sm:py-6 bg-black text-white hover:bg-gray-800">
                      Go to Dashboard
                      <ArrowRight className="ml-4 h-6 w-6" />
                    </Button>
                  </Link>
                ) : (
                  <>
                    <SignUpButton mode="modal">
                      <Button size="lg" className="w-full sm:w-auto text-lg sm:text-xl px-6 sm:px-12 py-4 sm:py-6 bg-black text-white hover:bg-gray-800">
                        Start Building Teams
                        <ArrowRight className="ml-4 h-6 w-6" />
                      </Button>
                    </SignUpButton>
                    <Link href="/explore" className="w-full sm:w-auto">
                      <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg sm:text-xl px-6 sm:px-12 py-4 sm:py-6 border-2 border-black text-black hover:bg-black hover:text-white">
                        Explore Projects
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </TextFade>
        </section>

        {/* Stats Section */}
        <section className="container mx-auto px-4 md:px-8 py-8 md:py-20">
          <TextFade triggerStart="top 80%" triggerEnd="bottom 20%" stagger={0.1}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center py-4 sm:py-6 md:py-0">
                  <div className="text-2xl sm:text-3xl md:text-6xl font-black text-black mb-1 sm:mb-2 md:mb-4">{stat.value}</div>
                  <div className="text-xs sm:text-sm md:text-lg text-gray-600 uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>
          </TextFade>
        </section>

        {/* Wrap all main sections in a very light, airy glass container */}
        <div className="w-full max-w-[1400px] mx-auto px-6 md:px-16 py-16 md:py-24 my-10 rounded-[32px] border border-white/20 shadow-[0_4px_20px_0_rgba(0,0,0,0.05),inset_0_1px_8px_rgba(255,255,255,0.15)] backdrop-blur-sm bg-white/5 flex flex-col gap-20 relative">
          {/* Why Versa Section - reduce top margin even more */}
          <div className="px-8 md:px-20 py-6 md:py-8 flex flex-col items-center">
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-semibold text-black text-center mb-8 pt-8 ${inter.className}`}>Why <span className="bg-gradient-to-r from-blue-600 via-green-500 to-purple-600 bg-clip-text text-transparent">Versa?</span></h2>
            <p className={`text-lg md:text-xl text-gray-700 text-center mb-12 max-w-2xl ${inter.className}`}>Versa provides info and access to thousands of researchers, college admission counselors, Y-Combinator affiliates, summer programs, competitions, and communication with other student users.</p>
            <div className="flex flex-wrap justify-center gap-6 w-full">
              <div className={`rounded-full border-2 border-indigo-100 bg-white/80 shadow px-6 py-3 text-base font-semibold text-indigo-700 whitespace-nowrap ${inter.className}`}>Researchers</div>
              <div className={`rounded-full border-2 border-green-100 bg-white/80 shadow px-6 py-3 text-base font-semibold text-green-700 whitespace-nowrap ${inter.className}`}>Admission Counselors</div>
              <div className={`rounded-full border-2 border-blue-100 bg-white/80 shadow px-6 py-3 text-base font-semibold text-blue-700 whitespace-nowrap ${inter.className}`}>Y-Combinator Affiliates</div>
              <div className={`rounded-full border-2 border-purple-100 bg-white/80 shadow px-6 py-3 text-base font-semibold text-purple-700 whitespace-nowrap ${inter.className}`}>Summer Programs</div>
              <div className={`rounded-full border-2 border-pink-100 bg-white/80 shadow px-6 py-3 text-base font-semibold text-pink-700 whitespace-nowrap ${inter.className}`}>Competitions</div>
              <div className={`rounded-full border-2 border-gray-200 bg-white/80 shadow px-6 py-3 text-base font-semibold text-gray-700 whitespace-nowrap ${inter.className}`}>Student Community</div>
            </div>
          </div>

          {/* Everything You Need to Succeed (Features) */}
          <div className="px-8 md:px-20 py-12 md:py-16 flex flex-col items-center">
            <h2 className={`text-2xl sm:text-3xl md:text-4xl font-semibold text-black text-center mb-4 ${inter.className}`}>Everything You Need to <span className="bg-gradient-to-r from-blue-600 via-green-500 to-purple-600 bg-clip-text text-transparent">Succeed</span></h2>
            <p className={`text-lg md:text-xl text-gray-700 text-center mb-12 max-w-3xl ${inter.className}`}>Access to thousands of researchers, college admission counselors, Y-Combinator affiliates, summer programs, competitions, and communication with other student users.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full max-w-5xl">
              <div className="rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm p-6 md:p-8 text-center shadow-sm">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Connect with Peers</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Find like-minded students, form study groups, and collaborate on projects. Build meaningful connections that last beyond competitions.</p>
              </div>
              
              <div className="rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm p-6 md:p-8 text-center shadow-sm">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Discover Opportunities</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Access curated competitions, research programs, and mentorship opportunities. Find the perfect fit for your interests and goals.</p>
              </div>
              
              <div className="rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm p-6 md:p-8 text-center shadow-sm">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Accelerate Growth</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Get personalized recommendations, track your progress, and receive guidance from experts. Maximize your potential and achieve your goals faster.</p>
              </div>
            </div>
                  </div>

          {/* How It Works */}
          <div className="px-8 md:px-20 pt-6 md:pt-8 pb-12 md:pb-16 flex flex-col items-center">
            <h2 className={`text-2xl sm:text-3xl md:text-4xl font-semibold text-black text-center mb-8 ${inter.className}`}>
              <span className="bg-gradient-to-r from-blue-600 via-green-500 to-purple-600 bg-clip-text text-transparent">How</span> It Works
            </h2>
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 w-full justify-center items-stretch max-w-6xl">
              <Card className="flex-1 bg-white/90 border-2 border-indigo-100 rounded-3xl shadow-xl p-8 flex flex-col items-center text-center">
                <span className="text-3xl font-bold mb-2">1</span>
                <CardTitle className="text-lg font-bold mb-2">Sign Up & Create Profile</CardTitle>
                <CardDescription className="text-gray-600 text-base">Tell us your interests, skills, and goals to get personalized matches and recommendations.</CardDescription>
              </Card>
              <Card className="flex-1 bg-white/90 border-2 border-green-100 rounded-3xl shadow-xl p-8 flex flex-col items-center text-center">
                <span className="text-3xl font-bold mb-2">2</span>
                <CardTitle className="text-lg font-bold mb-2">Connect & Collaborate</CardTitle>
                <CardDescription className="text-gray-600 text-base">Message, join teams, and work together on research, competitions, and projects.</CardDescription>
              </Card>
              <Card className="flex-1 bg-white/90 border-2 border-purple-100 rounded-3xl shadow-xl p-8 flex flex-col items-center text-center">
                <span className="text-3xl font-bold mb-2">3</span>
                <CardTitle className="text-lg font-bold mb-2">Achieve & Grow</CardTitle>
                <CardDescription className="text-gray-600 text-base">Win competitions, publish research, and build your network with Versa's support.</CardDescription>
              </Card>
            </div>
            </div>

          {/* Supported Competitions */}
          <div className="px-8 md:px-20 py-12 md:py-16 flex flex-col items-center">
            <h2 className={`text-2xl sm:text-3xl md:text-4xl font-semibold text-black text-center mb-4 ${inter.className}`}>
              Supported <span className="bg-gradient-to-r from-blue-600 via-green-500 to-purple-600 bg-clip-text text-transparent">Competitions</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-700 text-center mb-12 max-w-2xl">We support teams participating in prestigious academic competitions worldwide</p>
            <div className="flex flex-wrap justify-center gap-6 md:gap-8 w-full max-w-6xl">
              {competitions.slice(0, 8).map((competition) => (
                <Link
                  key={competition.id}
                  href={`/competitions/${competition.id}`}
                  className="focus:outline-none focus:ring-4 focus:ring-black/30"
                >
                  <div className="flex flex-col items-center justify-center bg-white/90 border-2 border-indigo-100 rounded-full shadow-xl px-8 py-8 w-64 h-48 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200">
                    <span className="text-4xl mb-3">{competition.icon}</span>
                    <span className="text-lg font-bold leading-tight text-center">{competition.name}</span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="flex justify-center mt-10">
              <Link href="/competitions">
                <Button className="rounded-full bg-black text-white hover:bg-gray-900 font-semibold text-lg px-10 py-4 shadow-lg">View All Competitions</Button>
              </Link>
            </div>
          </div>

          {/* Pricing */}
          <div className="px-8 md:px-20 pt-6 md:pt-8 pb-12 md:pb-16 flex flex-col items-center">
            <h2 className={`text-2xl sm:text-3xl md:text-4xl font-semibold text-black text-center mb-8 ${inter.className}`}>Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 w-full mb-12 max-w-6xl">
              <div className="rounded-2xl bg-white/90 shadow-lg border border-gray-100 p-8 flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-2">Free</h2>
                <div className="text-4xl font-extrabold mb-2">Free</div>
                <div className="text-gray-500 mb-4 text-center">Basic features for individuals</div>
                <ul className="mb-6 space-y-2 w-full">
                  <li className="flex items-center gap-2 text-gray-700 text-sm">
                    <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full"></span>
                    1 project
                  </li>
                  <li className="flex items-center gap-2 text-gray-700 text-sm">
                    <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full"></span>
                    Basic support
                  </li>
                  <li className="flex items-center gap-2 text-gray-700 text-sm">
                    <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full"></span>
                    Community access
                  </li>
                </ul>
                <Button className="w-full" disabled>Get Started</Button>
              </div>
              <div className="rounded-2xl bg-white/90 shadow-lg border border-gray-100 p-8 flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-2">Pro</h2>
                <div className="text-4xl font-extrabold mb-2">$12/mo</div>
                <div className="text-gray-500 mb-4 text-center">Advanced features for power users</div>
                <ul className="mb-6 space-y-2 w-full">
                  <li className="flex items-center gap-2 text-gray-700 text-sm">
                    <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full"></span>
                    Unlimited projects
                  </li>
                  <li className="flex items-center gap-2 text-gray-700 text-sm">
                    <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full"></span>
                    Priority support
                  </li>
                  <li className="flex items-center gap-2 text-gray-700 text-sm">
                    <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full"></span>
                    Team collaboration
                  </li>
                  <li className="flex items-center gap-2 text-gray-700 text-sm">
                    <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full"></span>
                    Advanced analytics
                  </li>
                </ul>
                <Button className="w-full bg-black text-white hover:bg-gray-900">Subscribe</Button>
              </div>
              <div className="rounded-2xl bg-white/90 shadow-lg border border-gray-100 p-8 flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-2">Enterprise</h2>
                <div className="text-4xl font-extrabold mb-2">$49/mo</div>
                <div className="text-gray-500 mb-4 text-center">Best for organizations and schools</div>
                <ul className="mb-6 space-y-2 w-full">
                  <li className="flex items-center gap-2 text-gray-700 text-sm">
                    <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full"></span>
                    Custom integrations
                  </li>
                  <li className="flex items-center gap-2 text-gray-700 text-sm">
                    <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full"></span>
                    Dedicated support
                  </li>
                  <li className="flex items-center gap-2 text-gray-700 text-sm">
                    <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full"></span>
                    Admin tools
                  </li>
                  <li className="flex items-center gap-2 text-gray-700 text-sm">
                    <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full"></span>
                    SAML SSO
                  </li>
                </ul>
                <Button className="w-full bg-black text-white hover:bg-gray-900">Subscribe</Button>
              </div>
            </div>
            <div className="flex justify-center">
              {isSignedIn ? (
                <Button size="lg" className="bg-gray-200 text-gray-400 font-semibold text-lg px-10 py-5 rounded-full shadow-lg cursor-not-allowed" disabled>
                  Join Versa Now
                </Button>
              ) : (
                <Link href="/sign-up">
                  <Button size="lg" className="bg-black text-white hover:bg-gray-900 font-semibold text-lg px-10 py-5 rounded-full shadow-lg">Join Versa Now</Button>
                </Link>
              )}
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="px-8 md:px-20 py-12 md:py-16 flex flex-col items-center">
            <h2 className={`text-2xl sm:text-3xl md:text-4xl font-semibold text-black text-center mb-4 ${inter.className}`}>Join the Versa Newsletter</h2>
            <p className="text-lg text-gray-700 text-center mb-8 max-w-xl">Get the latest research, competitions, and team-building tips delivered to your inbox.</p>
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
                  alert('Welcome to Versa! Check your email for a complete guide to our platform.');
                  e.currentTarget.reset();
                } else {
                  alert('Something went wrong. Please try again.');
                }
              } catch (error) {
                alert('Something went wrong. Please try again.');
              }
            }} className="flex flex-col sm:flex-row gap-4 w-full max-w-xl">
              <input 
                name="email"
                type="email" 
                placeholder="Your email address" 
                className="flex-1 px-6 py-4 rounded-full border-2 border-gray-200 focus:border-indigo-400 outline-none text-base" 
                required
              />
              <Button type="submit" className="rounded-full bg-black text-white hover:bg-gray-900 font-semibold text-lg px-8 py-4 shadow-lg">Subscribe</Button>
            </form>
          </div>
        </div>

        {/* CTA Section */}
        <section id="contacts" className="container mx-auto px-4 md:px-8 py-8 md:py-20">
          <TextFade triggerStart="top 80%" triggerEnd="bottom 20%" stagger={0.2}>
            <Card className="bg-black text-white border-0">
              <CardContent className="p-8 md:p-24 text-center">
                <h2 className="text-2xl md:text-6xl md:text-7xl font-black mb-6 md:mb-8 leading-none">Ready to Build Your Dream Team?</h2>
                <p className="text-base md:text-2xl mb-8 md:mb-12 opacity-90 max-w-3xl mx-auto leading-relaxed">
                  Join thousands of students who are already collaborating on amazing projects and winning competitions together.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
                  <Link href="/dashboard">
                    <Button size="lg" variant="secondary" className="text-xl px-12 py-6 bg-white text-black hover:bg-gray-100 font-bold">
                      Get Started Now
                      <ArrowRight className="ml-4 h-6 w-6" />
                    </Button>
                  </Link>
                  <Link href="/explore">
                    <Button
                      size="lg"
                      variant="outline"
                      className="text-xl px-12 py-6 border-2 border-white text-white hover:bg-white hover:text-black bg-transparent font-bold"
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
        <footer className="border-t border-gray-200 bg-white py-16">
          <div className="container mx-auto px-8 flex flex-col items-center justify-center">
            <div className="flex flex-col items-center mb-8">
              <Trophy className="h-8 w-8 text-black mb-2" />
                  <span className="text-2xl font-black text-black">Versa</span>
                  <p className="text-sm text-gray-600">built by Rikhin Kavuru</p>
                </div>
            <div className="flex flex-wrap justify-center gap-6 mb-6 text-sm text-gray-600">
              <a href="#" className="hover:text-black transition-colors font-bold uppercase tracking-widest">Privacy Policy</a>
              <a href="#" className="hover:text-black transition-colors font-bold uppercase tracking-widest">Terms of Service</a>
              <a href="#" className="hover:text-black transition-colors font-bold uppercase tracking-widest">Contact</a>
              </div>
            <div className="flex gap-4 mb-6">
              <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-blue-500 transition"><svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.58-2.47.69a4.3 4.3 0 0 0 1.88-2.37 8.59 8.59 0 0 1-2.72 1.04A4.28 4.28 0 0 0 16.11 4c-2.37 0-4.29 1.92-4.29 4.29 0 .34.04.67.11.99C7.69 9.13 4.07 7.38 1.64 4.7c-.37.64-.58 1.38-.58 2.17 0 1.5.76 2.82 1.92 3.6-.7-.02-1.36-.21-1.94-.53v.05c0 2.1 1.5 3.85 3.5 4.25-.36.1-.74.16-1.13.16-.28 0-.54-.03-.8-.08.54 1.7 2.1 2.94 3.95 2.97A8.6 8.6 0 0 1 2 19.54c-.29 0-.57-.02-.85-.05A12.13 12.13 0 0 0 8.29 21.5c7.55 0 11.68-6.26 11.68-11.68 0-.18-.01-.36-.02-.54A8.18 8.18 0 0 0 24 4.59a8.36 8.36 0 0 1-2.54.7z"/></svg></a>
              <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-blue-700 transition"><svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 11.28h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.88v1.36h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v5.59z"/></svg></a>
              <a href="#" aria-label="Email" className="text-gray-400 hover:text-indigo-600 transition"><svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 13.065l-11.99-7.065v14h24v-14l-12.01 7.065zm11.99-9.065h-23.98l11.99 7.065 11.99-7.065z"/></svg></a>
            </div>
            <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
              <p>&copy; 2024 Versa. All rights reserved. Empowering students to achieve excellence together.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
