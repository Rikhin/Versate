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
import { Playfair_Display } from 'next/font/google'
import React, { useState, useEffect } from 'react'
import styles from './connect-highlight.module.css';
import { createClient } from "@/lib/supabase"

const playfair = Playfair_Display({ subsets: ['latin'], style: ['italic'], weight: ['400', '700'] })

export default function LandingPage() {
  const { isSignedIn } = useUser()
  const [featuredProjects, setFeaturedProjects] = useState<any[]>([])
  const [projectsError, setProjectsError] = useState<string | null>(null)
  const [loadingProjects, setLoadingProjects] = useState(true)

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

  useEffect(() => {
    async function fetchProjects() {
      setLoadingProjects(true)
      setProjectsError(null)
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("projects")
          .select("id, title, authors, category, description, awards, created_at")
        if (error) {
          setProjectsError(error.message)
        } else if (data && data.length > 0) {
          const shuffled = data.sort(() => 0.5 - Math.random())
          setFeaturedProjects(shuffled.slice(0, 3))
        } else {
          setFeaturedProjects([])
        }
      } catch (err: any) {
        setProjectsError(err.message || 'Unknown error')
      } finally {
        setLoadingProjects(false)
      }
    }
    fetchProjects()
  }, [])

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
        <section id="home" className="container mx-auto px-4 md:px-8 py-12 md:py-32 text-left">
          <TextFade triggerStart="top 80%" triggerEnd="center center" stagger={0.2}>
            <div className="max-w-6xl mx-auto relative">
              <div className="text-5xl md:text-8xl font-black text-black mb-6 md:mb-8 leading-none">
                Find Your<br />Perfect<br /><span className="bg-gradient-to-r from-blue-600 via-green-500 to-purple-600 bg-clip-text text-transparent">Team</span>
              </div>
              <p className={playfair.className + " mb-8 md:mb-12 max-w-3xl leading-relaxed md:leading-loose text-black font-medium text-base md:text-xl"} style={{ letterSpacing: '0.01em' }}>
                <span className={playfair.className + ' italic text-black font-bold text-base md:text-xl relative'}>
                  <span
                    className={styles.highlight}
                    style={{ width: highlightWidth + '%', opacity: 0.32, height: '100%', background: 'linear-gradient(90deg, #ffe066 60%, #ffd600 100%)' }}
                  ></span>
                  Connect
                </span>
                {typed}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
                {isSignedIn ? (
                  <Link href="/dashboard">
                    <Button size="lg" className="text-xl px-12 py-6 bg-black text-white hover:bg-gray-800">
                      Go to Dashboard
                      <ArrowRight className="ml-4 h-6 w-6" />
                    </Button>
                  </Link>
                ) : (
                  <>
                    <SignUpButton mode="modal">
                      <Button size="lg" className="text-xl px-12 py-6 bg-black text-white hover:bg-gray-800">
                        Start Building Teams
                        <ArrowRight className="ml-4 h-6 w-6" />
                      </Button>
                    </SignUpButton>
                    <Link href="/explore">
                      <Button size="lg" variant="outline" className="text-xl px-12 py-6 border-2 border-black text-black hover:bg-black hover:text-white">
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
        <section className="container mx-auto px-4 md:px-8 py-12 md:py-32">
          <TextFade triggerStart="top 80%" triggerEnd="bottom 20%" stagger={0.1}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-6xl font-black text-black mb-2 md:mb-4">{stat.value}</div>
                  <div className="text-xs md:text-lg text-gray-600 uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>
          </TextFade>
        </section>

        {/* Features Section */}
        <section id="works" className="container mx-auto px-4 md:px-8 py-12 md:py-32">
          <TextFade triggerStart="top 80%" triggerEnd="bottom 20%" stagger={0.15}>
            <div className="mb-12 md:mb-24 flex flex-col items-end w-full">
              <h2 className="text-xl md:text-4xl font-semibold text-black text-right leading-tight mb-2 md:mb-0">Everything You Need to Succeed</h2>
              <p className="text-base md:text-xl text-gray-600 text-right leading-relaxed mt-2 max-w-2xl">Our platform provides all the tools and connections you need to excel in academic competitions</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-16">
              <Card className="border-0 shadow-none bg-transparent">
                <CardHeader className="pb-8">
                  <div className="flex items-center space-x-6">
                    <div className="text-3xl md:text-4xl font-black text-black">01</div>
                    <CardTitle className="text-xl md:text-2xl font-semibold text-black whitespace-nowrap">Smart Team Matching</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-xl text-gray-600 leading-relaxed">
                    Our AI-powered algorithm matches you with teammates based on skills, interests, and competition goals.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-none bg-transparent">
                <CardHeader className="pb-8">
                  <div className="flex items-center space-x-6">
                    <div className="text-3xl md:text-4xl font-black text-black">02</div>
                    <CardTitle className="text-xl md:text-2xl font-semibold text-black whitespace-nowrap">Real-time Collaboration</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-xl text-gray-600 leading-relaxed">
                    Built-in chat, file sharing, and project management tools to keep your team organized and productive.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-none bg-transparent">
                <CardHeader className="pb-8">
                  <div className="flex items-center space-x-6">
                    <div className="text-3xl md:text-4xl font-black text-black">03</div>
                    <CardTitle className="text-xl md:text-2xl font-semibold text-black whitespace-nowrap">Competition Support</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-xl text-gray-600 leading-relaxed">
                    Access resources, deadlines, and guidelines for 25+ prestigious academic competitions.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </TextFade>
        </section>

        {/* Featured Projects */}
        <section id="about" className="container mx-auto px-4 md:px-8 py-12 md:py-32">
          <TextFade triggerStart="top 80%" triggerEnd="bottom 20%" stagger={0.1}>
            <div className="mb-12 md:mb-24 flex flex-col items-end w-full">
              <h2 className="text-xl md:text-4xl font-semibold text-black text-right leading-tight mb-2 md:mb-0">Featured Projects</h2>
              <p className="text-base md:text-xl text-gray-600 text-right leading-relaxed mt-2 max-w-2xl">Discover exciting projects looking for talented team members</p>
            </div>
            <div className="flex flex-col md:flex-row justify-center items-stretch gap-4 md:gap-8">
              {loadingProjects ? (
                <div className="md:col-span-3 text-center text-gray-500 py-12">Loading featured projects...</div>
              ) : projectsError ? (
                <div className="md:col-span-3 text-center text-red-500 py-12">Error loading projects: {projectsError}</div>
              ) : featuredProjects.length === 0 ? (
                <div className="md:col-span-3 text-center text-gray-500 py-12">No projects found.</div>
              ) : (
                featuredProjects.map((project, index) => (
                  <Card key={project.id || index} className="border-0 shadow-none bg-transparent flex-1 max-w-md mx-auto">
                  <CardHeader className="pb-8">
                    <div className="flex justify-between items-start mb-4">
                        <Badge variant="outline" className="border-2 border-black text-black px-4 py-2 text-sm font-bold uppercase tracking-widest">{project.category || 'Project'}</Badge>
                      </div>
                      <CardTitle className="text-2xl font-black text-black">{project.title || 'Untitled Project'}</CardTitle>
                    <CardDescription className="text-lg text-gray-600">
                        {(project.description && project.description.length > 100)
                          ? project.description.slice(0, 100) + '...'
                          : (project.description || 'No description available.')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                          <AvatarImage src={"/placeholder-user.jpg"} alt={project.authors?.[0] || "?"} />
                          <AvatarFallback className="bg-black text-white font-bold">{project.authors?.[0] || "?"}</AvatarFallback>
                      </Avatar>
                      <div>
                          <p className="text-lg font-bold text-black">{project.authors || 'Unknown Author'}</p>
                          <p className="text-sm text-gray-600">{project.created_at ? new Date(project.created_at).toLocaleDateString() : ''}</p>
                    </div>
                      </div>
                  </CardContent>
                </Card>
                ))
              )}
            </div>
            <div className="text-center mt-12 md:mt-24">
              <Link href="/explore">
                <Button size="lg" variant="outline" className="border-2 border-black text-black hover:bg-black hover:text-white text-base md:text-xl px-6 md:px-12 py-3 md:py-6 font-bold">
                  View All Projects
                  <ArrowRight className="ml-2 md:ml-4 h-6 w-6" />
                </Button>
              </Link>
            </div>
          </TextFade>
        </section>

        {/* Competitions Section */}
        <section id="competitions" className="container mx-auto px-4 md:px-8 py-12 md:py-32">
          <TextFade triggerStart="top 80%" triggerEnd="bottom 20%" stagger={0.1}>
            <div className="mb-12 md:mb-24 flex flex-col items-end w-full">
              <h2 className="text-xl md:text-4xl font-semibold text-black text-right leading-tight mb-2 md:mb-0">Supported Competitions</h2>
              <p className="text-base md:text-xl text-gray-600 text-right leading-relaxed mt-2 max-w-2xl">We support teams participating in prestigious academic competitions worldwide</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {competitions.slice(0, 8).map((competition) => (
                <Link
                  key={competition.id}
                  href={`/competitions/${competition.id}`}
                  className="focus:outline-none focus:ring-4 focus:ring-black/30 rounded-xl"
                >
                  <button
                    className="w-full h-40 flex flex-col items-center justify-center bg-white border-2 border-black rounded-xl shadow-md hover:bg-black hover:text-white transition-colors duration-200 text-center p-6"
                    aria-label={`View details for ${competition.name}`}
                  >
                    <span className="text-4xl mb-3">{competition.icon}</span>
                    <span className="text-lg font-bold leading-tight">{competition.name}</span>
                  </button>
                </Link>
              ))}
            </div>
            <div className="flex justify-center mt-6 md:mt-8">
              <Link href="/competitions">
                <button className="px-6 md:px-8 py-2 md:py-3 rounded-lg bg-black text-white font-bold text-base md:text-lg hover:bg-gray-900 transition">View All Competitions</button>
              </Link>
            </div>
          </TextFade>
        </section>

        {/* CTA Section */}
        <section id="contacts" className="container mx-auto px-4 md:px-8 py-12 md:py-32">
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
          <div className="container mx-auto px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-4 mb-8 md:mb-0">
                <Trophy className="h-8 w-8 text-black" />
                <div>
                  <span className="text-2xl font-black text-black">Versa</span>
                  <p className="text-sm text-gray-600">built by Rikhin Kavuru</p>
                </div>
              </div>
              <div className="flex items-center space-x-8 text-sm text-gray-600">
                <a href="#" className="hover:text-black transition-colors font-bold uppercase tracking-widest">
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-black transition-colors font-bold uppercase tracking-widest">
                  Terms of Service
                </a>
                <a href="#" className="hover:text-black transition-colors font-bold uppercase tracking-widest">
                  Contact
                </a>
              </div>
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
