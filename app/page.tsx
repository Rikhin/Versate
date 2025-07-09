"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trophy, Users, Award, Target, ArrowRight, Rocket, BrainCircuit, LayoutDashboard, ShieldCheck, UserPlus, LayoutTemplate, Send, PlayCircle, Zap, Infinity } from "lucide-react"
import Link from "next/link"
import { SignInButton, SignUpButton, useUser } from "@clerk/nextjs"
import { BackgroundGradient, FloatingShapes } from "@/components/scroll-animations"
import { NetworkBG } from "@/components/ui/network-bg"
import { Inter } from 'next/font/google'
import { useState, useEffect, useRef } from 'react'
import { AnimatedWrapper } from "@/components/ui/animated-wrapper"
import { motion } from "framer-motion"
import { Star } from "lucide-react"

// Import new components
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
          opacity={1.0}
        />
        <NetworkBG className="absolute inset-0 w-full h-full opacity-50" />
        <FloatingShapes className="absolute inset-0 w-full h-full opacity-90" />
      </div>
      
      {/* Main Content Container */}
      <main className="relative z-10 bg-transparent">
        {/* Hero section - moved slightly up with adjusted padding */}
        <section className="relative pt-16 pb-12 sm:pt-24 sm:pb-16 lg:pt-32 lg:pb-20">
          <div className="container mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
            <div className="text-left max-w-4xl ml-4 md:ml-8 lg:ml-12">
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
                    className="text-lg md:text-xl text-white/90 mb-8 max-w-xl text-left tracking-wide font-sans" 
                    style={{ lineHeight: '2.0' }}
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

        {/* Main Content Sections with card containers */}
        <div className="relative z-10 py-20">
          <div className="space-y-24">
            {/* Why Choose Us Section */}
            <section className="py-16 relative">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why Choose Us</h2>
                  <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                    Discover what makes our platform the perfect choice for your collaborative projects
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                    {
                      title: "Intuitive Collaboration",
                      description: "Real-time editing, comments, and version history make teamwork seamless.",
                      icon: Users,
                      color: "from-purple-500 to-indigo-600"
                    },
                    {
                      title: "Powerful AI Tools",
                      description: "Built-in AI assists with code generation, debugging, and documentation.",
                      icon: BrainCircuit,
                      color: "from-teal-400 to-cyan-500"
                    },
                    {
                      title: "Flexible Workspaces",
                      description: "Organize projects with customizable boards, lists, and timelines.",
                      icon: LayoutDashboard,
                      color: "from-amber-500 to-orange-500"
                    },
                    {
                      title: "Secure & Private",
                      description: "Enterprise-grade security keeps your projects and data safe.",
                      icon: ShieldCheck,
                      color: "from-emerald-500 to-green-500"
                    }
                  ].map((feature, index) => (
                    <div 
                      key={index}
                      className="bg-gradient-to-br backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 shadow-lg"
                    >
                      <div className={`mb-4 inline-flex items-center justify-center p-3 rounded-xl bg-gradient-to-r ${feature.color}`}>
                        <feature.icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                      <p className="text-gray-300">{feature.description}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-16 text-center">
                  <div className="inline-flex flex-col sm:flex-row gap-4">
                    <Button className="bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end hover:opacity-90 transition-opacity">
                      Get Started
                    </Button>
                    <Button variant="outline" className="text-white border-white/30 hover:bg-white/10">
                      View Demo
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            {/* How It Works Section */}
            <section className="py-16 relative">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How It Works</h2>
                  <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                    Get started in just a few simple steps and unlock powerful collaboration features
                  </p>
                </div>

                <div className="relative max-w-4xl mx-auto">
                  {/* Timeline line */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-helix-gradient-start to-helix-gradient-end z-0"></div>
                  
                  <div className="space-y-12 relative z-10">
                    {[
                      {
                        step: 1,
                        title: "Create Your Account",
                        description: "Sign up in seconds using your email or social accounts.",
                        icon: UserPlus,
                        position: "left"
                      },
                      {
                        step: 2,
                        title: "Set Up Your Workspace",
                        description: "Create a new project or join an existing team workspace.",
                        icon: LayoutTemplate,
                        position: "right"
                      },
                      {
                        step: 3,
                        title: "Invite Your Team",
                        description: "Collaborate with teammates by inviting them to your project.",
                        icon: Send,
                        position: "left"
                      },
                      {
                        step: 4,
                        title: "Start Creating",
                        description: "Use our powerful tools to build, test, and deploy your projects.",
                        icon: Rocket,
                        position: "right"
                      }
                    ].map((step, index) => (
                      <div 
                        key={index}
                        className={`flex ${step.position === 'left' ? 'flex-row' : 'flex-row-reverse'} items-center`}
                      >
                        <div className="w-1/2 px-8">
                          <div className="bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:shadow-xl transition-shadow">
                            <div className="flex items-center mb-4">
                              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end mr-4">
                                <step.icon className="h-6 w-6 text-white" />
                              </div>
                              <h3 className="text-xl font-bold text-white">{step.title}</h3>
                            </div>
                            <p className="text-gray-300">{step.description}</p>
                          </div>
                        </div>
                        
                        <div className="w-1/2 flex justify-center">
                          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end text-2xl font-bold text-white">
                            {step.step}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-16 relative overflow-hidden">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What Our Users Say</h2>
                  <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                    Hear from students and professionals who have transformed their collaboration experience
                  </p>
                </div>

                <div className="relative py-12">
                  {/* Gradient backgrounds */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -left-32 -top-32 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-indigo-600/20 rounded-full blur-3xl"></div>
                    <div className="absolute -right-32 -bottom-32 w-96 h-96 bg-gradient-to-r from-teal-400/20 to-cyan-500/20 rounded-full blur-3xl"></div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                    {[
                      {
                        name: "Alex Johnson",
                        role: "Computer Science Student",
                        content: "This platform completely changed how my team collaborates on projects. The real-time editing and AI tools save us hours every week!",
                        avatar: "/avatars/alex.jpg"
                      },
                      {
                        name: "Sarah Williams",
                        role: "Research Team Lead",
                        content: "The flexible workspaces allowed us to organize our complex research project in a way that made sense for our team. Game changer!",
                        avatar: "/avatars/sarah.jpg"
                      },
                      {
                        name: "Michael Chen",
                        role: "Startup Founder",
                        content: "As a non-technical founder, the AI coding assistant helped me understand and contribute to our codebase. Incredibly powerful tool.",
                        avatar: "/avatars/michael.jpg"
                      }
                    ].map((testimonial, index) => (
                      <motion.div 
                        key={index}
                        className="bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300"
                        whileHover={{ 
                          y: -10,
                          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                        }}
                      >
                        <div className="flex items-center mb-4">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end rounded-full blur"></div>
                            <img 
                              src={testimonial.avatar} 
                              alt={testimonial.name} 
                              className="relative w-16 h-16 rounded-full border-2 border-white/20"
                            />
                          </div>
                          <div className="ml-4">
                            <h3 className="text-lg font-bold text-white">{testimonial.name}</h3>
                            <p className="text-sm text-gray-400">{testimonial.role}</p>
                          </div>
                        </div>
                        <div className="relative">
                          <div className="absolute -top-4 -left-4 text-6xl text-gray-700 opacity-30">"</div>
                          <p className="text-gray-300 relative z-10 pl-6">{testimonial.content}</p>
                          <div className="absolute -bottom-4 -right-4 text-6xl text-gray-700 opacity-30 transform rotate-180">"</div>
                        </div>
                        <div className="mt-6 flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="mt-12 text-center">
                    <Button variant="outline" className="text-white border-white/30 hover:bg-white/10">
                      Read More Stories
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-24 relative overflow-hidden">
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-1/4 -left-1/4 w-[150%] h-[150%] bg-gradient-to-r from-helix-gradient-start via-indigo-600 to-helix-gradient-end animate-pulse-slow opacity-20"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,rgba(0,0,0,0)_70%)]"></div>
              </div>
              
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                    Ready to Transform Your Collaboration Experience?
                  </h2>
                  <p className="text-xl text-gray-200 mb-10 max-w-3xl mx-auto">
                    Join thousands of students and professionals who are already building amazing projects together
                  </p>
                  
                  <div className="flex flex-col sm:flex-row justify-center gap-6">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button className="bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end hover:opacity-90 transition-opacity text-lg px-8 py-6">
                        <Rocket className="mr-2 h-5 w-5" />
                        Get Started Free
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button variant="outline" className="text-white border-white/30 hover:bg-white/10 text-lg px-8 py-6">
                        <PlayCircle className="mr-2 h-5 w-5" />
                        Watch Demo
                      </Button>
                    </motion.div>
                  </div>
                  
                  <div className="mt-10 flex flex-wrap justify-center gap-4">
                    {[
                      { icon: ShieldCheck, text: "No credit card required" },
                      { icon: Zap, text: "Setup in minutes" },
                      { icon: Infinity, text: "Free forever plan" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center text-gray-300">
                        <item.icon className="h-5 w-5 mr-2" />
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
