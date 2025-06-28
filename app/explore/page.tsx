"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Search, Users, Calendar, MapPin, Star, Target, Zap, TrendingUp } from "lucide-react"
import Link from "next/link"

// Mock user data
const mockUser = {
  firstName: "John",
  imageUrl: "/placeholder-user.jpg",
}

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCompetition, setSelectedCompetition] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [activeTab, setActiveTab] = useState("projects")

  const mockProjects = [
    {
      id: 1,
      title: "Blockchain Voting System",
      description:
        "Developing a secure, transparent voting system using blockchain technology for student government elections.",
      competition: "Diamond Challenge",
      category: "Innovation & Design",
      deadline: "2024-04-15",
      teamSize: 3,
      maxTeamSize: 5,
      lookingFor: ["Blockchain Developer", "UI/UX Designer"],
      techStack: ["Solidity", "React", "Node.js", "Web3"],
      leader: {
        name: "Emma Rodriguez",
        avatar: "/placeholder-user.jpg",
        school: "Stanford University",
        rating: 4.9,
      },
      matchScore: 92,
      applications: 12,
    },
    {
      id: 2,
      title: "Mental Health Chatbot",
      description: "AI-powered chatbot to provide mental health support and resources for students.",
      competition: "Technovation Girls",
      category: "Computer Science",
      deadline: "2024-03-30",
      teamSize: 2,
      maxTeamSize: 4,
      lookingFor: ["AI/ML Engineer", "Psychology Researcher"],
      techStack: ["Python", "TensorFlow", "NLP", "Flutter"],
      leader: {
        name: "Aisha Patel",
        avatar: "/placeholder-user.jpg",
        school: "MIT",
        rating: 4.8,
      },
      matchScore: 87,
      applications: 8,
    },
    {
      id: 3,
      title: "Smart Agriculture Monitor",
      description: "IoT-based system to monitor soil conditions and optimize crop yields for sustainable farming.",
      competition: "Regeneron ISEF",
      category: "STEM",
      deadline: "2024-05-20",
      teamSize: 4,
      maxTeamSize: 6,
      lookingFor: ["Hardware Engineer", "Data Scientist"],
      techStack: ["Arduino", "Python", "IoT", "Machine Learning"],
      leader: {
        name: "Carlos Martinez",
        avatar: "/placeholder-user.jpg",
        school: "UC Berkeley",
        rating: 4.7,
      },
      matchScore: 78,
      applications: 15,
    },
  ]

  const mockStudents = [
    {
      id: 1,
      name: "Sarah Chen",
      avatar: "/placeholder-user.jpg",
      school: "Harvard University",
      major: "Computer Science",
      skills: ["React", "Python", "Machine Learning", "UI/UX Design"],
      competitions: ["Congressional App Challenge", "Technovation Girls"],
      rating: 4.9,
      projects: 5,
      lookingFor: "AI/ML Projects",
    },
    {
      id: 2,
      name: "Michael Johnson",
      avatar: "/placeholder-user.jpg",
      school: "Stanford University",
      major: "Electrical Engineering",
      skills: ["Arduino", "IoT", "C++", "Hardware Design"],
      competitions: ["Regeneron ISEF", "Conrad Challenge"],
      rating: 4.8,
      projects: 3,
      lookingFor: "Hardware Projects",
    },
    {
      id: 3,
      name: "Priya Sharma",
      avatar: "/placeholder-user.jpg",
      school: "MIT",
      major: "Business & Computer Science",
      skills: ["Business Strategy", "React", "Data Analysis", "Marketing"],
      competitions: ["Diamond Challenge", "DECA Competition"],
      rating: 4.7,
      projects: 4,
      lookingFor: "Business Innovation",
    },
  ]

  const competitions = [
    "Congressional App Challenge",
    "Technovation Girls",
    "Regeneron ISEF",
    "Conrad Challenge",
    "Diamond Challenge",
    "DECA Competition",
    "RoboCupJunior",
    "eCYBERMISSION",
  ]

  const categories = ["STEM", "Computer Science", "Business & Entrepreneurship", "Innovation & Design"]

  const filteredProjects = mockProjects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCompetition = selectedCompetition === "all" || project.competition === selectedCompetition
    const matchesCategory = selectedCategory === "all" || project.category === selectedCategory
    return matchesSearch && matchesCompetition && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <Trophy className="h-8 w-8 text-slate-600" />
              <div>
                <span className="text-2xl font-bold text-slate-800">ColabBoard</span>
                <p className="text-xs text-slate-500 -mt-1">built by Rikhin Kavuru</p>
              </div>
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/dashboard" className="text-slate-600 hover:text-slate-800">
              Dashboard
            </Link>
            <Link href="/explore" className="text-slate-600 hover:text-slate-800 font-medium">
              Explore
            </Link>
            <Link href="/chat" className="text-slate-600 hover:text-slate-800">
              Messages
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={mockUser.imageUrl || "/placeholder.svg"} alt={mockUser.firstName} />
              <AvatarFallback>{mockUser.firstName?.[0] || "U"}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Explore Projects & Students</h1>
          <p className="text-slate-600">Discover amazing competition projects and find your perfect teammates</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search projects, competitions, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedCompetition} onValueChange={setSelectedCompetition}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Competitions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Competitions</SelectItem>
                  {competitions.map((comp) => (
                    <SelectItem key={comp} value={comp}>
                      {comp}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="projects">Projects ({filteredProjects.length})</TabsTrigger>
            <TabsTrigger value="students">Students ({mockStudents.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary">{project.competition}</Badge>
                      <div className="flex items-center space-x-1">
                        <Zap className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-600">{project.matchScore}% match</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Project Leader */}
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={project.leader.avatar || "/placeholder.svg"} alt={project.leader.name} />
                        <AvatarFallback>{project.leader.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{project.leader.name}</p>
                        <div className="flex items-center space-x-2 text-xs text-slate-500">
                          <MapPin className="h-3 w-3" />
                          <span>{project.leader.school}</span>
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span>{project.leader.rating}</span>
                        </div>
                      </div>
                    </div>

                    {/* Project Details */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm text-slate-600">
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>
                            {project.teamSize}/{project.maxTeamSize} members
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{project.deadline}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-slate-600">
                        <TrendingUp className="h-4 w-4" />
                        <span>{project.applications} applications</span>
                      </div>
                    </div>

                    {/* Looking For */}
                    <div>
                      <p className="text-sm text-slate-600 mb-2">Looking for:</p>
                      <div className="flex flex-wrap gap-1">
                        {project.lookingFor.map((role) => (
                          <Badge key={role} variant="outline" className="text-xs">
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Tech Stack */}
                    <div>
                      <p className="text-sm text-slate-600 mb-2">Tech Stack:</p>
                      <div className="flex flex-wrap gap-1">
                        {project.techStack.slice(0, 3).map((tech) => (
                          <Badge key={tech} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                        {project.techStack.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{project.techStack.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <Button className="w-full">
                      <Target className="h-4 w-4 mr-2" />
                      Apply to Join
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {mockStudents.map((student) => (
                <Card key={student.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.name} />
                        <AvatarFallback>{student.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{student.name}</CardTitle>
                        <CardDescription>{student.major}</CardDescription>
                        <div className="flex items-center space-x-2 text-xs text-slate-500 mt-1">
                          <MapPin className="h-3 w-3" />
                          <span>{student.school}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Stats */}
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{student.rating} rating</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Trophy className="h-4 w-4 text-blue-600" />
                        <span>{student.projects} projects</span>
                      </div>
                    </div>

                    {/* Looking For */}
                    <div>
                      <p className="text-sm text-slate-600 mb-2">Looking for:</p>
                      <Badge variant="outline" className="text-xs">
                        {student.lookingFor}
                      </Badge>
                    </div>

                    {/* Skills */}
                    <div>
                      <p className="text-sm text-slate-600 mb-2">Skills:</p>
                      <div className="flex flex-wrap gap-1">
                        {student.skills.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {student.skills.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{student.skills.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Competitions */}
                    <div>
                      <p className="text-sm text-slate-600 mb-2">Competitions:</p>
                      <div className="flex flex-wrap gap-1">
                        {student.competitions.map((comp) => (
                          <Badge key={comp} variant="outline" className="text-xs">
                            {comp}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button className="w-full bg-transparent" variant="outline">
                      <Users className="h-4 w-4 mr-2" />
                      Connect
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
