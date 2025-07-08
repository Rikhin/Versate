"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Trophy, 
  Users, 
  Target, 
  Star, 
  ArrowRight, 
  Code, 
  Award, 
  Zap,
  Search,
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  BookOpen,
  Lightbulb,
  TrendingUp,
  Filter,
  ExternalLink
} from "lucide-react"
import Link from "next/link"
import { BackgroundGradient, FloatingShapes, TextFade } from "@/components/scroll-animations"
import { competitions } from "@/lib/competitions-data"
import { SignInButton, SignUpButton, useUser, SignIn, SignUp } from "@clerk/nextjs"
import OnboardingScrollEnforcer from "@/components/onboarding/OnboardingScrollEnforcer"

import { Dialog, DialogContent } from "@/components/ui/dialog"

interface Competition {
  id: string
  name: string
  category: string
  status: "active" | "upcoming" | "past"
  description: string
  deadline: string
  prize: string
  participants: number
  maxParticipants: number
  location: string
  website: string
  requirements: string[]
  tags: string[]
  icon: string
  teamRequired: boolean
}

const categories = [
  { id: "all", name: "All Categories", icon: "🏆" },
  { id: "Technology", name: "Technology", icon: "💻" },
  { id: "STEM", name: "STEM", icon: "🔬" },
  { id: "Business", name: "Business", icon: "💼" },
  { id: "Robotics", name: "Robotics", icon: "🤖" }
]

export default function CompetitionsPage() {
  const { isSignedIn, isLoaded } = useUser()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [teamFilter, setTeamFilter] = useState("all")
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    if (isLoaded && !isSignedIn) setShowAuthModal(true)
  }, [isLoaded, isSignedIn])

  // Prevent hydration mismatch by not rendering until loaded
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-helix-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-helix-gradient-start mx-auto mb-4"></div>
          <p className="text-helix-text-light">Loading...</p>
        </div>
      </div>
    )
  }

  const filteredCompetitions = useMemo(() => {
    return competitions.filter(competition => {
      const matchesSearch = competition.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           competition.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           competition.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesCategory = selectedCategory === "all" || competition.category === selectedCategory
      const matchesStatus = selectedStatus === "all" || competition.status === selectedStatus
      const matchesTeam =
        teamFilter === "all" ||
        (teamFilter === "team" && competition.teamRequired) ||
        (teamFilter === "individual" && competition.teamRequired === false)
      
      return matchesSearch && matchesCategory && matchesStatus && matchesTeam
    })
  }, [searchTerm, selectedCategory, selectedStatus, teamFilter])

  const activeCompetitions = filteredCompetitions.filter(c => c.status === "active")
  const upcomingCompetitions = filteredCompetitions.filter(c => c.status === "upcoming")
  const pastCompetitions = filteredCompetitions.filter(c => c.status === "past")

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-400/20 text-green-400 border-green-400/30"
      case "upcoming": return "bg-blue-400/20 text-blue-400 border-blue-400/30"
      case "past": return "bg-gray-400/20 text-gray-400 border-gray-400/30"
      default: return "bg-gray-400/20 text-gray-400 border-gray-400/30"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return "Active"
      case "upcoming": return "Upcoming"
      case "past": return "Past"
      default: return status
    }
  }

  return (
    <OnboardingScrollEnforcer>
        {showAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn">
            <div className="glass border border-white/10 rounded-[24px] shadow-2xl p-8 max-w-sm w-full flex flex-col items-center gap-6 animate-fadeInUp">
              <h2 className="text-2xl font-bold text-white mb-2">Sign in or Sign up</h2>
              <p className="text-helix-text-light text-center mb-4">Sign in or create an account to access Competitions and start discovering opportunities.</p>
              <div className="flex w-full gap-3">
                <SignInButton mode="modal">
                  <button className="flex-1 py-3 rounded-full border border-white/20 text-white font-bold bg-white/10 hover:bg-white/20 transition">Sign In</button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="flex-1 py-3 rounded-full bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end text-white font-bold hover:shadow-xl glow transition">Sign Up</button>
                </SignUpButton>
              </div>
            </div>
          </div>
        )}
      <div className="min-h-screen bg-helix-dark relative overflow-hidden">
          {/* Background Animations */}
          <BackgroundGradient 
            startColor="from-helix-blue/20" 
            endColor="to-helix-dark-blue/20" 
            triggerStart="top center"
            triggerEnd="center center"
          />
          <FloatingShapes 
            count={3} 
            triggerStart="top center"
            triggerEnd="bottom center"
          />
          
          {/* Main Content Container */}
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">

            {/* Hero Section */}
            <section className="py-20 md:py-32 pt-24">
              <div className="text-center mb-16 md:mb-20">
                <TextFade triggerStart="top 80%" triggerEnd="center center" stagger={0.1}>
                  <div className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight">
                    Find Your <span className="gradient-text-helix">Competition</span>
                  </div>
                  <p className="text-xl md:text-2xl text-helix-text-light max-w-4xl mx-auto leading-relaxed">
                    Discover exciting competitions, hackathons, and challenges. Connect with teammates, 
                    showcase your skills, and win amazing prizes.
                  </p>
                </TextFade>
              </div>

              {/* Search and Filters */}
              <div className="mb-12 md:mb-16 space-y-6">
                <div className="flex flex-col md:flex-row gap-4 w-full">
                  <div className="flex-1 relative w-full">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-helix-text-light" />
                    <Input
                      placeholder="Search competitions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12 h-12 sm:h-14 md:h-16 text-lg md:text-xl border-2 border-white/20 focus:border-helix-gradient-start outline-none w-full bg-white/10 text-white placeholder-helix-text-light backdrop-blur-sm rounded-full"
                    />
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="h-12 sm:h-14 md:h-16 text-lg md:text-xl border-2 border-white/20 focus:border-helix-gradient-start min-w-[140px] sm:min-w-[160px] md:min-w-[220px] w-full sm:w-auto bg-white/10 text-white backdrop-blur-sm rounded-full">
                      <SelectValue placeholder="Category..." />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          <span className="mr-2">{category.icon}</span>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="h-12 sm:h-14 md:h-16 text-lg md:text-xl border-2 border-white/20 focus:border-helix-gradient-start min-w-[140px] sm:min-w-[160px] md:min-w-[220px] w-full sm:w-auto bg-white/10 text-white backdrop-blur-sm rounded-full">
                      <SelectValue placeholder="Status..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="past">Past</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={teamFilter} onValueChange={setTeamFilter}>
                    <SelectTrigger className="h-12 sm:h-14 md:h-16 text-lg md:text-xl border-2 border-white/20 focus:border-helix-gradient-start min-w-[140px] sm:min-w-[160px] md:min-w-[220px] w-full sm:w-auto bg-white/10 text-white backdrop-blur-sm rounded-full">
                      <SelectValue placeholder="Team..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="team">Team</SelectItem>
                      <SelectItem value="individual">Individual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Active Competitions */}
              {activeCompetitions.length > 0 && (
                <div className="mb-16 md:mb-20">
                  <div className="text-center mb-12 md:mb-16">
                    <div className="text-3xl md:text-5xl font-black text-white mb-4 md:mb-6">Active Competitions</div>
                    <p className="text-lg md:text-xl text-helix-text-light">Don't miss these ongoing opportunities</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {activeCompetitions.map((competition) => (
                      <Link key={competition.id} href={`/competitions/${competition.id}`} className="focus:outline-none focus:ring-4 focus:ring-helix-gradient-start/30 rounded-[24px]">
                        <Card className="glass border border-white/10 shadow-xl hover:shadow-2xl hover:glow transition-all duration-300 cursor-pointer">
                          <CardHeader className="pb-8">
                            <div className="flex justify-between items-start mb-6">
                              <Badge className={`border-2 ${getStatusColor(competition.status)} px-4 py-2 text-sm font-bold uppercase tracking-widest`}>
                                {getStatusText(competition.status)}
                              </Badge>
                              <div className="text-4xl">{competition.icon}</div>
                            </div>
                            <CardTitle className="text-2xl font-black text-white">{competition.name}</CardTitle>
                            <CardDescription className="text-lg text-helix-text-light">{competition.description}</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            <div>
                              <h4 className="text-lg font-bold text-white mb-4">Tags</h4>
                              <div className="flex flex-wrap gap-2">
                                {competition.tags.map((tag) => (
                                  <Badge key={tag} variant="outline" className="border-2 border-white/20 text-helix-text-light px-3 py-1 text-sm font-bold">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="flex gap-3">
                              <a
                                href={competition.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1"
                              >
                                <Button className="w-full bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end text-white hover:shadow-xl glow py-4 text-lg font-bold rounded-full">
                                  <ExternalLink className="h-5 w-5 mr-3" />
                                  Official Website
                                </Button>
                              </a>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Upcoming Competitions */}
              {upcomingCompetitions.length > 0 && (
                <div className="mb-16 md:mb-20">
                  <div className="text-center mb-12 md:mb-16">
                    <div className="text-3xl md:text-5xl font-black text-white mb-4 md:mb-6">Upcoming Competitions</div>
                    <p className="text-lg md:text-xl text-helix-text-light">Start preparing for these exciting opportunities</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {upcomingCompetitions.map((competition) => (
                      <Card key={competition.id} className="glass border border-white/10 shadow-xl hover:shadow-2xl hover:glow transition-all duration-300 cursor-pointer">
                        <CardHeader className="pb-8">
                          <div className="flex justify-between items-start mb-6">
                            <Badge className={`border-2 ${getStatusColor(competition.status)} px-4 py-2 text-sm font-bold uppercase tracking-widest`}>
                              {getStatusText(competition.status)}
                            </Badge>
                            <div className="text-4xl">{competition.icon}</div>
                          </div>
                          <CardTitle className="text-2xl font-black text-white">{competition.name}</CardTitle>
                          <CardDescription className="text-lg text-helix-text-light">{competition.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="flex items-center justify-between text-lg text-helix-text-light">
                            <div className="flex items-center space-x-3">
                              <Calendar className="h-5 w-5" />
                              <span>Deadline: {formatDeadline(competition.deadline)}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-lg text-helix-text-light">
                            <div className="flex items-center space-x-3">
                              <DollarSign className="h-5 w-5" />
                              <span>{competition.prize}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-lg text-helix-text-light">
                            <div className="flex items-center space-x-3">
                              <Users className="h-5 w-5" />
                              <span>{competition.participants}/{competition.maxParticipants} participants</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-lg text-helix-text-light">
                            <div className="flex items-center space-x-3">
                              <MapPin className="h-5 w-5" />
                              <span>{competition.location}</span>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-lg font-bold text-white mb-4">Tags</h4>
                            <div className="flex flex-wrap gap-2">
                              {competition.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="border-2 border-white/20 text-helix-text-light px-3 py-1 text-sm font-bold">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <Button className="flex-1 bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end text-white hover:shadow-xl glow py-4 text-lg font-bold rounded-full">
                              <ExternalLink className="h-5 w-5 mr-3" />
                              Learn More
                            </Button>
                            <Button variant="outline" className="border-2 border-white/20 text-white hover:bg-white/10 py-4 text-lg font-bold rounded-full">
                              <Users className="h-5 w-5" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Past Competitions */}
              {pastCompetitions.length > 0 && (
                <div className="mb-16 md:mb-20">
                  <div className="text-center mb-12 md:mb-16">
                    <div className="text-3xl md:text-5xl font-black text-white mb-4 md:mb-6">Past Competitions</div>
                    <p className="text-lg md:text-xl text-helix-text-light">Learn from previous competitions and prepare for next year</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {pastCompetitions.map((competition) => (
                      <Card key={competition.id} className="glass border border-white/10 shadow-xl hover:shadow-2xl hover:glow transition-all duration-300 cursor-pointer opacity-75">
                        <CardHeader className="pb-8">
                          <div className="flex justify-between items-start mb-6">
                            <Badge className={`border-2 ${getStatusColor(competition.status)} px-4 py-2 text-sm font-bold uppercase tracking-widest`}>
                              {getStatusText(competition.status)}
                            </Badge>
                            <div className="text-4xl">{competition.icon}</div>
                          </div>
                          <CardTitle className="text-2xl font-black text-white">{competition.name}</CardTitle>
                          <CardDescription className="text-lg text-helix-text-light">{competition.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="flex items-center justify-between text-lg text-helix-text-light">
                            <div className="flex items-center space-x-3">
                              <Calendar className="h-5 w-5" />
                              <span>Deadline: {formatDeadline(competition.deadline)}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-lg text-helix-text-light">
                            <div className="flex items-center space-x-3">
                              <DollarSign className="h-5 w-5" />
                              <span>{competition.prize}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-lg text-helix-text-light">
                            <div className="flex items-center space-x-3">
                              <Users className="h-5 w-5" />
                              <span>{competition.participants}/{competition.maxParticipants} participants</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-lg text-helix-text-light">
                            <div className="flex items-center space-x-3">
                              <MapPin className="h-5 w-5" />
                              <span>{competition.location}</span>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-lg font-bold text-white mb-4">Tags</h4>
                            <div className="flex flex-wrap gap-2">
                              {competition.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="border-2 border-white/20 text-helix-text-light px-3 py-1 text-sm font-bold">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <Button className="flex-1 bg-white/10 text-white hover:bg-white/20 py-4 text-lg font-bold rounded-full border border-white/20">
                              <ExternalLink className="h-5 w-5 mr-3" />
                              View Results
                            </Button>
                            <Button variant="outline" className="border-2 border-white/20 text-helix-text-light hover:bg-white/10 py-4 text-lg font-bold rounded-full">
                              <Users className="h-5 w-5" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* No Results */}
              {filteredCompetitions.length === 0 && (
                <div className="text-center py-16 md:py-24">
                  <div className="text-3xl md:text-5xl font-black text-helix-text-light mb-4 md:mb-6">No competitions found</div>
                  <p className="text-lg md:text-xl text-helix-text-light mb-8 md:mb-12">Try adjusting your search or filters</p>
                  <Button 
                    onClick={() => {
                      setSearchTerm("")
                      setSelectedCategory("all")
                      setSelectedStatus("all")
                      setTeamFilter("all")
                    }}
                    className="bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end text-white hover:shadow-xl glow font-bold text-lg px-8 py-4 rounded-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </section>
          </div>
      </div>
    </OnboardingScrollEnforcer>
  )
}
