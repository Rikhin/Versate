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
import { SignInButton, SignUpButton } from "@clerk/nextjs"

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
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [teamFilter, setTeamFilter] = useState("all")
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isSignedIn, setIsSignedIn] = useState(false)

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
      case "active": return "bg-green-100 text-green-800 border-green-300"
      case "upcoming": return "bg-blue-100 text-blue-800 border-blue-300"
      case "past": return "bg-gray-100 text-gray-800 border-gray-300"
      default: return "bg-gray-100 text-gray-800 border-gray-300"
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

  useEffect(() => {
    if (!isSignedIn) setShowAuthModal(true)
    else setShowAuthModal(false)
  }, [isSignedIn])

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background Animations */}
      <BackgroundGradient 
        startColor="from-gray-50/50" 
        endColor="to-gray-100/50" 
        triggerStart="top center"
        triggerEnd="center center"
      />
      <FloatingShapes 
        count={3} 
        triggerStart="top center"
        triggerEnd="bottom center"
      />
      
      {/* Main Content Container */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Trophy className="h-8 w-8 text-black" />
                <div>
                  <span className="text-2xl font-black text-black">Versa</span>
                  <p className="text-sm text-gray-600">Competitions</p>
                </div>
              </div>
              <Link href="/dashboard">
                <Button variant="outline" className="border-2 border-black text-black hover:bg-black hover:text-white">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-4 md:px-8 py-8 md:py-16">
          <TextFade triggerStart="top 80%" triggerEnd="center center" stagger={0.1}>
            {/* Header Section */}
            <div className="text-center mb-8 md:mb-16">
              <h1 className="text-2xl sm:text-3xl md:text-6xl md:text-7xl font-black text-black mb-4 md:mb-8 leading-none">
                Academic<br /><span className="text-gray-400">Competitions</span>
              </h1>
              <p className="text-sm sm:text-base md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Discover prestigious competitions and opportunities to showcase your skills and win amazing prizes
              </p>
            </div>

            {/* Search and Filters */}
            <div className="mb-8 md:mb-12 space-y-4 md:space-y-6">
              <div className="flex flex-col md:flex-row gap-4 w-full">
                <div className="flex-1 relative w-full">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search competitions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-10 sm:h-12 md:h-14 text-base md:text-lg border-2 border-gray-300 focus:border-black w-full"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="h-10 sm:h-12 md:h-14 text-base md:text-lg border-2 border-gray-300 focus:border-black min-w-[120px] sm:min-w-[140px] md:min-w-[200px] w-full sm:w-auto">
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
                  <SelectTrigger className="h-10 sm:h-12 md:h-14 text-base md:text-lg border-2 border-gray-300 focus:border-black min-w-[120px] sm:min-w-[140px] md:min-w-[200px] w-full sm:w-auto">
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
                  <SelectTrigger className="h-10 sm:h-12 md:h-14 text-base md:text-lg border-2 border-gray-300 focus:border-black min-w-[120px] sm:min-w-[140px] md:min-w-[200px] w-full sm:w-auto">
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
              <div className="mb-8 md:mb-16">
                <div className="text-center mb-6 md:mb-12">
                  <div className="text-2xl md:text-4xl font-black text-black mb-2 md:mb-4">Active Competitions</div>
                  <p className="text-base md:text-xl text-gray-600">Don't miss these ongoing opportunities</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                  {activeCompetitions.map((competition) => (
                    <Link key={competition.id} href={`/competitions/${competition.id}`} className="focus:outline-none focus:ring-4 focus:ring-black/30 rounded-xl">
                      <Card className="border-0 shadow-none bg-transparent hover:scale-105 transition-transform cursor-pointer">
                        <CardHeader className="pb-6">
                          <div className="flex justify-between items-start mb-4">
                            <Badge className={`border-2 ${getStatusColor(competition.status)} px-4 py-2 text-sm font-bold uppercase tracking-widest`}>
                              {getStatusText(competition.status)}
                            </Badge>
                            <div className="text-3xl">{competition.icon}</div>
                          </div>
                          <CardTitle className="text-2xl font-black text-black">{competition.name}</CardTitle>
                          <CardDescription className="text-lg text-gray-600">{competition.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="text-lg font-bold text-black mb-3">Tags</h4>
                            <div className="flex flex-wrap gap-2">
                              {competition.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="border-2 border-gray-300 text-gray-700 px-3 py-1 text-sm font-bold">
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
                              <Button className="w-full bg-black text-white hover:bg-gray-800 py-4 text-lg font-bold">
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
              <div className="mb-8 md:mb-16">
                <div className="text-center mb-6 md:mb-12">
                  <div className="text-2xl md:text-4xl font-black text-black mb-2 md:mb-4">Upcoming Competitions</div>
                  <p className="text-base md:text-xl text-gray-600">Start preparing for these exciting opportunities</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                  {upcomingCompetitions.map((competition) => (
                    <Card key={competition.id} className="border-0 shadow-none bg-transparent hover:scale-105 transition-transform cursor-pointer">
                      <CardHeader className="pb-6">
                        <div className="flex justify-between items-start mb-4">
                          <Badge className={`border-2 ${getStatusColor(competition.status)} px-4 py-2 text-sm font-bold uppercase tracking-widest`}>
                            {getStatusText(competition.status)}
                          </Badge>
                          <div className="text-3xl">{competition.icon}</div>
                        </div>
                        <CardTitle className="text-2xl font-black text-black">{competition.name}</CardTitle>
                        <CardDescription className="text-lg text-gray-600">{competition.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="flex items-center justify-between text-lg text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-5 w-5" />
                            <span>Deadline: {formatDeadline(competition.deadline)}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-lg text-gray-600">
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-5 w-5" />
                            <span>{competition.prize}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-lg text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Users className="h-5 w-5" />
                            <span>{competition.participants}/{competition.maxParticipants} participants</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-lg text-gray-600">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-5 w-5" />
                            <span>{competition.location}</span>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-lg font-bold text-black mb-3">Tags</h4>
                          <div className="flex flex-wrap gap-2">
                            {competition.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="border-2 border-gray-300 text-gray-700 px-3 py-1 text-sm font-bold">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Button className="flex-1 bg-black text-white hover:bg-gray-800 py-4 text-lg font-bold">
                            <ExternalLink className="h-5 w-5 mr-3" />
                            Learn More
                          </Button>
                          <Button variant="outline" className="border-2 border-black text-black hover:bg-black hover:text-white py-4 text-lg font-bold">
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
              <div className="mb-8 md:mb-16">
                <div className="text-center mb-6 md:mb-12">
                  <div className="text-2xl md:text-4xl font-black text-black mb-2 md:mb-4">Past Competitions</div>
                  <p className="text-base md:text-xl text-gray-600">Learn from previous competitions and prepare for next year</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                  {pastCompetitions.map((competition) => (
                    <Card key={competition.id} className="border-0 shadow-none bg-transparent hover:scale-105 transition-transform cursor-pointer opacity-75">
                      <CardHeader className="pb-6">
                        <div className="flex justify-between items-start mb-4">
                          <Badge className={`border-2 ${getStatusColor(competition.status)} px-4 py-2 text-sm font-bold uppercase tracking-widest`}>
                            {getStatusText(competition.status)}
                          </Badge>
                          <div className="text-3xl">{competition.icon}</div>
                        </div>
                        <CardTitle className="text-2xl font-black text-black">{competition.name}</CardTitle>
                        <CardDescription className="text-lg text-gray-600">{competition.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="flex items-center justify-between text-lg text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-5 w-5" />
                            <span>Deadline: {formatDeadline(competition.deadline)}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-lg text-gray-600">
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-5 w-5" />
                            <span>{competition.prize}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-lg text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Users className="h-5 w-5" />
                            <span>{competition.participants}/{competition.maxParticipants} participants</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-lg text-gray-600">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-5 w-5" />
                            <span>{competition.location}</span>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-lg font-bold text-black mb-3">Tags</h4>
                          <div className="flex flex-wrap gap-2">
                            {competition.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="border-2 border-gray-300 text-gray-700 px-3 py-1 text-sm font-bold">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Button className="flex-1 bg-gray-600 text-white hover:bg-gray-700 py-4 text-lg font-bold">
                            <ExternalLink className="h-5 w-5 mr-3" />
                            View Results
                          </Button>
                          <Button variant="outline" className="border-2 border-gray-400 text-gray-600 hover:bg-gray-400 hover:text-white py-4 text-lg font-bold">
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
              <div className="text-center py-8 md:py-16">
                <div className="text-2xl md:text-4xl font-black text-gray-400 mb-2 md:mb-4">No competitions found</div>
                <p className="text-base md:text-xl text-gray-600 mb-4 md:mb-8">Try adjusting your search or filters</p>
                <Button 
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory("all")
                    setSelectedStatus("all")
                    setTeamFilter("all")
                  }}
                  className="bg-black text-white hover:bg-gray-800 px-6 md:px-8 py-2 md:py-4 text-base md:text-lg font-bold"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </TextFade>
        </div>
      </div>

      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full flex flex-col items-center gap-6 animate-fadeInUp">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Sign in or Sign up</h2>
            <p className="text-gray-500 text-center mb-4">Sign in or create an account to access Competitions and start discovering opportunities.</p>
            <div className="flex gap-2 w-full">
              <SignInButton mode="modal">
                <button className="flex-1 py-2 rounded-lg border border-black text-black font-semibold bg-white hover:bg-gray-100 transition">Sign In</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="flex-1 py-2 rounded-lg bg-black text-white font-semibold hover:bg-gray-900 transition">Sign Up</button>
              </SignUpButton>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
