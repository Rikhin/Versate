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

const playfair = Playfair_Display({ subsets: ['latin'], style: ['italic'], weight: ['400', '700'] })

export default function LandingPage() {
  const { isSignedIn } = useUser()

  const featuredProjects = [
    {
      title: "AI-Powered Study Assistant",
      competition: "Congressional App Challenge",
      category: "Computer Science",
      teamSize: 3,
      maxTeamSize: 5,
      techStack: ["React", "Python", "AI"],
      leader: {
        name: "Sarah Chen",
        avatar: "/placeholder-user.jpg",
        school: "Stanford University",
      },
      matchScore: 94,
    },
    {
      title: "Sustainable Energy Monitor",
      competition: "Regeneron ISEF",
      category: "STEM",
      teamSize: 2,
      maxTeamSize: 4,
      techStack: ["Arduino", "IoT", "Data Science"],
      leader: {
        name: "Alex Rivera",
        avatar: "/placeholder-user.jpg",
        school: "MIT",
      },
      matchScore: 89,
    },
    {
      title: "Mental Health Chatbot",
      competition: "Technovation Girls",
      category: "Innovation",
      teamSize: 4,
      maxTeamSize: 6,
      techStack: ["Flutter", "NLP", "Psychology"],
      leader: {
        name: "Priya Sharma",
        avatar: "/placeholder-user.jpg",
        school: "Harvard University",
      },
      matchScore: 91,
    },
  ]

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
    }, 26); // now ~1.8s for 'Connect'
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
      <div className="relative z-10">
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
                    style={{ width: highlightWidth + '%', opacity: 0.55, height: '100%', background: 'linear-gradient(90deg, #ffe066 60%, #ffd600 100%)', verticalAlign: 'baseline' }}
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
            <div className="text-center mb-12 md:mb-24">
              <div className="text-5xl md:text-9xl font-black text-black mb-6 md:mb-8">01</div>
              <h2 className="text-2xl md:text-6xl md:text-7xl font-black text-black mb-6 md:mb-8 leading-none">
                Everything You<br />Need to Succeed
              </h2>
              <p className="text-base md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Our platform provides all the tools and connections you need to excel in academic competitions
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-16">
              <Card className="border-0 shadow-none bg-transparent">
                <CardHeader className="pb-8">
                  <div className="flex items-center space-x-6">
                    <div className="text-4xl font-black text-black">01</div>
                    <CardTitle className="text-3xl font-black text-black">Smart Team Matching</CardTitle>
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
                    <div className="text-4xl font-black text-black">02</div>
                    <CardTitle className="text-3xl font-black text-black">Real-time Collaboration</CardTitle>
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
                    <div className="text-4xl font-black text-black">03</div>
                    <CardTitle className="text-3xl font-black text-black">Competition Support</CardTitle>
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
            <div className="text-center mb-12 md:mb-24">
              <div className="text-5xl md:text-9xl font-black text-black mb-6 md:mb-8">02</div>
              <h2 className="text-2xl md:text-6xl md:text-7xl font-black text-black mb-6 md:mb-8 leading-none">
                Featured<br />Projects
              </h2>
              <p className="text-base md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Discover exciting projects looking for talented team members
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-16">
              {featuredProjects.map((project, index) => (
                <Card key={index} className="border-0 shadow-none bg-transparent">
                  <CardHeader className="pb-8">
                    <div className="flex justify-between items-start mb-4">
                      <Badge variant="outline" className="border-2 border-black text-black px-4 py-2 text-sm font-bold uppercase tracking-widest">{project.competition}</Badge>
                      <div className="flex items-center space-x-2">
                        <Zap className="h-5 w-5 text-black" />
                        <span className="text-sm font-bold text-black">{project.matchScore}% match</span>
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-black text-black">{project.title}</CardTitle>
                    <CardDescription className="text-lg text-gray-600">
                      Looking for talented teammates to join this {project.category} project
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={project.leader.avatar || "/placeholder.svg"} alt={project.leader.name} />
                        <AvatarFallback className="bg-black text-white font-bold">{project.leader.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-lg font-bold text-black">{project.leader.name}</p>
                        <p className="text-sm text-gray-600">{project.leader.school}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-lg text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Users className="h-5 w-5" />
                        <span>
                          {project.teamSize}/{project.maxTeamSize} members
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-lg text-gray-600 mb-3">Tech Stack:</p>
                      <div className="flex flex-wrap gap-2">
                        {project.techStack.map((tech) => (
                          <Badge key={tech} variant="outline" className="border-2 border-gray-300 text-gray-700 px-3 py-1 text-sm font-bold">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button className="w-full bg-black text-white hover:bg-gray-800 py-4 text-lg font-bold">
                      <Target className="h-5 w-5 mr-3" />
                      Apply to Join
                    </Button>
                  </CardContent>
                </Card>
              ))}
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
            <div className="text-center mb-12 md:mb-24">
              <div className="text-5xl md:text-9xl font-black text-black mb-6 md:mb-8">03</div>
              <h2 className="text-2xl md:text-6xl md:text-7xl font-black text-black mb-6 md:mb-8 leading-none">
                Supported<br />Competitions
              </h2>
              <p className="text-base md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                We support teams participating in prestigious academic competitions worldwide
              </p>
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
