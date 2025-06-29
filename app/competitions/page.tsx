"use client"

import { useState, useMemo } from "react"
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
}

const competitions: Competition[] = [
  // Active Competitions
  {
    id: "1",
    name: "Congressional App Challenge",
    category: "Technology",
    status: "active",
    description: "Create an app that solves a problem in your community. Open to high school students across the United States.",
    deadline: "2024-11-01",
    prize: "$250,000 in prizes",
    participants: 2450,
    maxParticipants: 5000,
    location: "United States",
    website: "https://www.congressionalappchallenge.us",
    requirements: ["High school student", "U.S. resident", "Original app"],
    tags: ["Mobile App", "Community", "Innovation"],
    icon: "📱"
  },
  {
    id: "2",
    name: "Regeneron ISEF",
    category: "STEM",
    status: "active",
    description: "The world's largest international pre-college science competition, bringing together young scientists from around the globe.",
    deadline: "2024-05-15",
    prize: "$9 million in awards",
    participants: 1800,
    maxParticipants: 2000,
    location: "Los Angeles, CA",
    website: "https://www.societyforscience.org/isef",
    requirements: ["High school student", "Original research", "Qualification through regional fairs"],
    tags: ["Science", "Research", "International"],
    icon: "🔬"
  },
  {
    id: "3",
    name: "Technovation Girls",
    category: "Technology",
    status: "active",
    description: "Empowering girls to become tech entrepreneurs and leaders by creating mobile apps that address real community problems.",
    deadline: "2024-04-30",
    prize: "$20,000 scholarships",
    participants: 3200,
    maxParticipants: 5000,
    location: "Global",
    website: "https://technovationchallenge.org",
    requirements: ["Girls 10-18", "Team of 1-5", "Mobile app solution"],
    tags: ["Girls in Tech", "Mobile App", "Social Impact"],
    icon: "💻"
  },
  {
    id: "4",
    name: "Diamond Challenge",
    category: "Business",
    status: "active",
    description: "A global entrepreneurship competition for high school students to develop innovative business concepts.",
    deadline: "2024-03-15",
    prize: "$100,000 in prizes",
    participants: 1200,
    maxParticipants: 2000,
    location: "Newark, DE",
    website: "https://diamondchallenge.org",
    requirements: ["High school student", "Team of 2-4", "Business concept"],
    tags: ["Entrepreneurship", "Business", "Innovation"],
    icon: "💎"
  },
  {
    id: "5",
    name: "DECA Competition",
    category: "Business",
    status: "active",
    description: "Prepare emerging leaders and entrepreneurs for careers in marketing, finance, hospitality and management.",
    deadline: "2024-04-20",
    prize: "Scholarships and recognition",
    participants: 15000,
    maxParticipants: 20000,
    location: "Anaheim, CA",
    website: "https://www.deca.org",
    requirements: ["High school student", "DECA membership", "Business case study"],
    tags: ["Business", "Marketing", "Leadership"],
    icon: "🎯"
  },

  // Upcoming Competitions
  {
    id: "6",
    name: "Conrad Challenge",
    category: "STEM",
    status: "upcoming",
    description: "Transform education through innovation and entrepreneurship. Students solve real-world problems using STEM.",
    deadline: "2024-06-30",
    prize: "$500,000 in prizes",
    participants: 800,
    maxParticipants: 1500,
    location: "Kennedy Space Center, FL",
    website: "https://www.conradchallenge.org",
    requirements: ["Ages 13-18", "Team of 2-5", "STEM innovation"],
    tags: ["STEM", "Innovation", "Space"],
    icon: "🚀"
  },
  {
    id: "7",
    name: "RoboCupJunior",
    category: "Robotics",
    status: "upcoming",
    description: "An educational initiative that aims to foster AI and robotics research by offering a readily accessible competition.",
    deadline: "2024-07-15",
    prize: "Trophies and recognition",
    participants: 600,
    maxParticipants: 1000,
    location: "Rotterdam, Netherlands",
    website: "https://junior.robocup.org",
    requirements: ["Ages 19 and under", "Team of 2-4", "Robot design"],
    tags: ["Robotics", "AI", "International"],
    icon: "🤖"
  },
  {
    id: "8",
    name: "eCYBERMISSION",
    category: "STEM",
    status: "upcoming",
    description: "A web-based science, technology, engineering, and mathematics competition for 6th-9th grade teams.",
    deadline: "2024-05-01",
    prize: "$9,000 savings bonds",
    participants: 4000,
    maxParticipants: 6000,
    location: "Washington, DC",
    website: "https://www.ecybermission.com",
    requirements: ["Grades 6-9", "Team of 2-4", "U.S. citizen"],
    tags: ["STEM", "Middle School", "Science"],
    icon: "🔬"
  },
  {
    id: "9",
    name: "MIT Launch",
    category: "Business",
    status: "upcoming",
    description: "A summer entrepreneurship program for high school students to start real companies.",
    deadline: "2024-03-01",
    prize: "Seed funding and mentorship",
    participants: 200,
    maxParticipants: 300,
    location: "Cambridge, MA",
    website: "https://launchx.com",
    requirements: ["High school student", "Application", "Entrepreneurial spirit"],
    tags: ["Entrepreneurship", "Startup", "Mentorship"],
    icon: "🚀"
  },
  {
    id: "10",
    name: "Google Science Fair",
    category: "STEM",
    status: "upcoming",
    description: "A global online science and technology competition open to individuals and teams from ages 13 to 18.",
    deadline: "2024-06-30",
    prize: "$50,000 scholarship",
    participants: 1500,
    maxParticipants: 3000,
    location: "Global",
    website: "https://www.googlesciencefair.com",
    requirements: ["Ages 13-18", "Original research", "Scientific method"],
    tags: ["Science", "Research", "Global"],
    icon: "🔬"
  },

  // Past Competitions
  {
    id: "11",
    name: "Intel ISEF 2023",
    category: "STEM",
    status: "past",
    description: "The world's largest international pre-college science competition, bringing together young scientists from around the globe.",
    deadline: "2023-05-15",
    prize: "$9 million in awards",
    participants: 1800,
    maxParticipants: 2000,
    location: "Dallas, TX",
    website: "https://www.societyforscience.org/isef",
    requirements: ["High school student", "Original research", "Qualification through regional fairs"],
    tags: ["Science", "Research", "International"],
    icon: "🔬"
  },
  {
    id: "12",
    name: "Technovation Girls 2023",
    category: "Technology",
    status: "past",
    description: "Empowering girls to become tech entrepreneurs and leaders by creating mobile apps that address real community problems.",
    deadline: "2023-04-30",
    prize: "$20,000 scholarships",
    participants: 3200,
    maxParticipants: 5000,
    location: "Global",
    website: "https://technovationchallenge.org",
    requirements: ["Girls 10-18", "Team of 1-5", "Mobile app solution"],
    tags: ["Girls in Tech", "Mobile App", "Social Impact"],
    icon: "💻"
  },
  {
    id: "13",
    name: "Diamond Challenge 2023",
    category: "Business",
    status: "past",
    description: "A global entrepreneurship competition for high school students to develop innovative business concepts.",
    deadline: "2023-03-15",
    prize: "$100,000 in prizes",
    participants: 1200,
    maxParticipants: 2000,
    location: "Newark, DE",
    website: "https://diamondchallenge.org",
    requirements: ["High school student", "Team of 2-4", "Business concept"],
    tags: ["Entrepreneurship", "Business", "Innovation"],
    icon: "💎"
  },
  {
    id: "14",
    name: "Congressional App Challenge 2023",
    category: "Technology",
    status: "past",
    description: "Create an app that solves a problem in your community. Open to high school students across the United States.",
    deadline: "2023-11-01",
    prize: "$250,000 in prizes",
    participants: 2450,
    maxParticipants: 5000,
    location: "United States",
    website: "https://www.congressionalappchallenge.us",
    requirements: ["High school student", "U.S. resident", "Original app"],
    tags: ["Mobile App", "Community", "Innovation"],
    icon: "📱"
  },
  {
    id: "15",
    name: "DECA Competition 2023",
    category: "Business",
    status: "past",
    description: "Prepare emerging leaders and entrepreneurs for careers in marketing, finance, hospitality and management.",
    deadline: "2023-04-20",
    prize: "Scholarships and recognition",
    participants: 15000,
    maxParticipants: 20000,
    location: "Anaheim, CA",
    website: "https://www.deca.org",
    requirements: ["High school student", "DECA membership", "Business case study"],
    tags: ["Business", "Marketing", "Leadership"],
    icon: "🎯"
  }
]

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

  const filteredCompetitions = useMemo(() => {
    return competitions.filter(competition => {
      const matchesSearch = competition.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           competition.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           competition.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesCategory = selectedCategory === "all" || competition.category === selectedCategory
      const matchesStatus = selectedStatus === "all" || competition.status === selectedStatus
      
      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [searchTerm, selectedCategory, selectedStatus])

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
                  <span className="text-2xl font-black text-black">ColabBoard</span>
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
        <div className="container mx-auto px-8 py-16">
          <TextFade triggerStart="top 80%" triggerEnd="center center" stagger={0.1}>
            {/* Header Section */}
            <div className="text-center mb-16">
              <h1 className="text-6xl md:text-7xl font-black text-black mb-8 leading-none">
                Academic
                <br />
                <span className="text-gray-400">Competitions</span>
              </h1>
              <p className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Discover prestigious competitions and opportunities to showcase your skills and win amazing prizes
              </p>
            </div>

            {/* Search and Filters */}
            <div className="mb-12 space-y-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search competitions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-14 text-lg border-2 border-gray-300 focus:border-black"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="h-14 text-lg border-2 border-gray-300 focus:border-black min-w-[200px]">
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
                  <SelectTrigger className="h-14 text-lg border-2 border-gray-300 focus:border-black min-w-[200px]">
                    <SelectValue placeholder="Status..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="past">Past</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Competitions */}
            {activeCompetitions.length > 0 && (
              <div className="mb-16">
                <div className="text-center mb-12">
                  <div className="text-4xl font-black text-black mb-4">Active Competitions</div>
                  <p className="text-xl text-gray-600">Don't miss these ongoing opportunities</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {activeCompetitions.map((competition) => (
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

            {/* Upcoming Competitions */}
            {upcomingCompetitions.length > 0 && (
              <div className="mb-16">
                <div className="text-center mb-12">
                  <div className="text-4xl font-black text-black mb-4">Upcoming Competitions</div>
                  <p className="text-xl text-gray-600">Start preparing for these exciting opportunities</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
              <div className="mb-16">
                <div className="text-center mb-12">
                  <div className="text-4xl font-black text-black mb-4">Past Competitions</div>
                  <p className="text-xl text-gray-600">Learn from previous competitions and prepare for next year</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
              <div className="text-center py-16">
                <div className="text-4xl font-black text-gray-400 mb-4">No competitions found</div>
                <p className="text-xl text-gray-600 mb-8">Try adjusting your search or filters</p>
                <Button 
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory("all")
                    setSelectedStatus("all")
                  }}
                  className="bg-black text-white hover:bg-gray-800 px-8 py-4 text-lg font-bold"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </TextFade>
        </div>
      </div>
    </div>
  )
}
