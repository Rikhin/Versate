"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Trophy, Clock, Users, MapPin, Star, MessageCircle } from "lucide-react"
import Link from "next/link"

// Add Clerk imports:

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")
  const [commitmentFilter, setCommitmentFilter] = useState("all")

  const projects = [
    {
      id: 1,
      title: "Quantum Computing Simulator",
      description: "Creating an educational quantum computing simulator for high school students",
      competition: "Regeneron ISEF",
      deadline: "2024-03-01",
      members: 2,
      maxMembers: 4,
      tags: ["Quantum", "Physics", "JavaScript"],
      needsRoles: ["Frontend Developer", "Physics Expert"],
      matchScore: 92,
      owner: {
        name: "Sarah Chen",
        avatar: "/placeholder.svg?height=32&width=32",
        school: "MIT",
      },
    },
    {
      id: 2,
      title: "Mental Health Support App",
      description: "Mobile app connecting students with peer support and resources",
      competition: "Technovation Girls",
      deadline: "2024-04-15",
      members: 3,
      maxMembers: 5,
      tags: ["Mobile", "Health", "UI/UX"],
      needsRoles: ["Mobile Developer"],
      matchScore: 87,
      owner: {
        name: "Alex Rodriguez",
        avatar: "/placeholder.svg?height=32&width=32",
        school: "Stanford",
      },
    },
    {
      id: 3,
      title: "Sustainable Energy Dashboard",
      description: "Real-time dashboard for tracking renewable energy usage on campus",
      competition: "Conrad Challenge",
      deadline: "2024-02-28",
      members: 1,
      maxMembers: 3,
      tags: ["Sustainability", "Data Viz", "IoT"],
      needsRoles: ["Backend Developer", "Data Scientist"],
      matchScore: 85,
      owner: {
        name: "Emma Wilson",
        avatar: "/placeholder.svg?height=32&width=32",
        school: "UC Berkeley",
      },
    },
  ]

  const people = [
    {
      id: 1,
      name: "Emma Thompson",
      avatar: "/placeholder.svg?height=40&width=40",
      school: "Harvard University",
      location: "Cambridge, MA",
      skills: ["React", "Node.js", "UI/UX"],
      interests: ["AI", "Healthcare"],
      matchScore: 94,
      online: true,
      bio: "CS student passionate about using technology to solve healthcare challenges",
      commitment: "Moderate",
    },
    {
      id: 2,
      name: "David Kim",
      avatar: "/placeholder.svg?height=40&width=40",
      school: "UC Berkeley",
      location: "Berkeley, CA",
      skills: ["Python", "Machine Learning", "Data Science"],
      interests: ["AI", "Education"],
      matchScore: 91,
      online: false,
      bio: "Data science enthusiast with experience in educational technology",
      commitment: "Intensive",
    },
    {
      id: 3,
      name: "Maria Garcia",
      avatar: "/placeholder.svg?height=40&width=40",
      school: "Stanford University",
      location: "Palo Alto, CA",
      skills: ["Business Strategy", "Marketing", "Research"],
      interests: ["Sustainability", "Social Impact"],
      matchScore: 89,
      online: true,
      bio: "Business student focused on sustainable solutions and social entrepreneurship",
      commitment: "Casual",
    },
    {
      id: 4,
      name: "James Park",
      avatar: "/placeholder.svg?height=40&width=40",
      school: "Carnegie Mellon",
      location: "Pittsburgh, PA",
      skills: ["Robotics", "C++", "Hardware"],
      interests: ["Robotics", "Engineering"],
      matchScore: 88,
      online: true,
      bio: "Robotics engineering student with competition experience in RoboCup",
      commitment: "Intensive",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Trophy className="h-8 w-8 text-slate-600" />
            <span className="text-2xl font-bold text-slate-800">ColabBoard</span>
          </Link>
          {/* Update the header: */}
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                Dashboard
              </Button>
            </Link>
            <Button variant="ghost" size="sm">
              <MessageCircle className="h-4 w-4 mr-2" />
              Messages
            </Button>
            <div className="h-10 w-10 bg-slate-200 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">JD</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Explore</h1>
          <p className="text-slate-600">Discover projects and connect with talented teammates</p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search projects, people, or skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="developer">Developer</SelectItem>
                    <SelectItem value="designer">Designer</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="researcher">Researcher</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="local">Local</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={commitmentFilter} onValueChange={setCommitmentFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Commitment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="intensive">Intensive</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="projects">Projects ({projects.length})</TabsTrigger>
            <TabsTrigger value="people">People ({people.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-4">
            {projects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                      <CardDescription className="mt-1">{project.description}</CardDescription>
                    </div>
                    <Badge className="ml-4">{project.matchScore}% match</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={project.owner.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{project.owner.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{project.owner.name}</span>
                      <span className="text-sm text-slate-600">• {project.owner.school}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-slate-600">
                      <div className="flex items-center">
                        <Trophy className="h-4 w-4 mr-1" />
                        {project.competition}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Due {project.deadline}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {project.members}/{project.maxMembers} members
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-slate-700">Needs:</span>
                        {project.needsRoles.map((role) => (
                          <Badge key={role} variant="outline" className="text-xs">
                            {role}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Message
                        </Button>
                        <Button size="sm">Join Project</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="people" className="space-y-4">
            {people.map((person) => (
              <Card key={person.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={person.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{person.name[0]}</AvatarFallback>
                      </Avatar>
                      {person.online && (
                        <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{person.name}</h3>
                          <p className="text-sm text-slate-600 flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {person.school} • {person.location}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {person.commitment}
                          </Badge>
                          <Badge className="flex items-center">
                            <Star className="h-3 w-3 mr-1" />
                            {person.matchScore}% match
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">{person.bio}</p>
                      <div className="space-y-2">
                        <div>
                          <span className="text-xs font-medium text-slate-700">Skills:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {person.skills.map((skill) => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-slate-700">Interests:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {person.interests.map((interest) => (
                              <Badge key={interest} variant="outline" className="text-xs">
                                {interest}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-4">
                        <Button size="sm">Connect</Button>
                        <Button size="sm" variant="outline">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Message
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
