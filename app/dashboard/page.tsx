"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, MessageCircle, Users, Search, Trophy, Clock, MapPin, Star } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("projects")

  // Mock user data - replace with your auth system later
  const user = {
    firstName: "John",
    username: "john_doe",
  }

  // Mock data - in real app, this would come from your database
  const myProjects = [
    {
      id: 1,
      title: "AI-Powered Study Assistant",
      description: "Building an AI chatbot to help students with homework and study planning",
      competition: "Congressional App Challenge",
      deadline: "2024-01-15",
      members: 3,
      maxMembers: 4,
      tags: ["AI", "React", "Python"],
      needsRoles: ["Backend Developer"],
      matchScore: 95,
    },
    {
      id: 2,
      title: "Sustainable Campus Initiative",
      description: "Developing a comprehensive plan to reduce campus carbon footprint",
      competition: "Diamond Challenge",
      deadline: "2024-02-01",
      members: 2,
      maxMembers: 5,
      tags: ["Sustainability", "Business", "Research"],
      needsRoles: ["Marketing", "Data Analyst"],
      matchScore: 88,
    },
  ]

  const discoverProjects = [
    {
      id: 3,
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
      id: 4,
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
  ]

  const suggestedMatches = [
    {
      id: 1,
      name: "Emma Thompson",
      avatar: "/placeholder.svg?height=40&width=40",
      school: "Harvard University",
      skills: ["React", "Node.js", "UI/UX"],
      interests: ["AI", "Healthcare"],
      matchScore: 94,
      online: true,
      bio: "CS student passionate about using technology to solve healthcare challenges",
    },
    {
      id: 2,
      name: "David Kim",
      avatar: "/placeholder.svg?height=40&width=40",
      school: "UC Berkeley",
      skills: ["Python", "Machine Learning", "Data Science"],
      interests: ["AI", "Education"],
      matchScore: 91,
      online: false,
      bio: "Data science enthusiast with experience in educational technology",
    },
    {
      id: 3,
      name: "Maria Garcia",
      avatar: "/placeholder.svg?height=40&width=40",
      school: "Stanford University",
      skills: ["Business Strategy", "Marketing", "Research"],
      interests: ["Sustainability", "Social Impact"],
      matchScore: 89,
      online: true,
      bio: "Business student focused on sustainable solutions and social entrepreneurship",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Trophy className="h-8 w-8 text-slate-600" />
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-slate-800">ColabBoard</span>
              <span className="text-xs text-slate-500">built by Rikhin Kavuru</span>
            </div>
          </Link>
          {/* Update the header to use UserButton: */}
          <div className="flex items-center space-x-4">
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
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Welcome back, {user?.firstName || user?.username || "there"}! 👋
          </h1>
          <p className="text-slate-600">Ready to win your next competition?</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link href="/projects/new">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Plus className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                <h3 className="font-semibold">Create Project</h3>
                <p className="text-sm text-slate-600">Start a new competition project</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/explore">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Search className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                <h3 className="font-semibold">Find Teammates</h3>
                <p className="text-sm text-slate-600">Discover compatible partners</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/chat">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <MessageCircle className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                <h3 className="font-semibold">Messages</h3>
                <p className="text-sm text-slate-600">Chat with your teams</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="projects">My Projects</TabsTrigger>
            <TabsTrigger value="discover">Discover</TabsTrigger>
            <TabsTrigger value="matches">Suggested Matches</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Your Projects</h2>
              <Link href="/projects/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
                </Button>
              </Link>
            </div>
            <div className="grid gap-4">
              {myProjects.map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                        <CardDescription className="mt-1">{project.description}</CardDescription>
                      </div>
                      <Badge variant="outline" className="ml-4">
                        {project.matchScore}% match
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
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
                      {project.needsRoles.length > 0 && (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-slate-700">Needs:</span>
                          {project.needsRoles.map((role) => (
                            <Badge key={role} variant="outline" className="text-xs">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="discover" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Discover Projects</h2>
              <Link href="/explore">
                <Button variant="outline">View All</Button>
              </Link>
            </div>
            <div className="grid gap-4">
              {discoverProjects.map((project) => (
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
                        <Button size="sm">Join Project</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="matches" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Suggested Matches</h2>
              <Link href="/explore?tab=people">
                <Button variant="outline">View All</Button>
              </Link>
            </div>
            <div className="grid gap-4">
              {suggestedMatches.map((match) => (
                <Card key={match.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={match.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{match.name[0]}</AvatarFallback>
                        </Avatar>
                        {match.online && (
                          <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="font-semibold">{match.name}</h3>
                            <p className="text-sm text-slate-600 flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {match.school}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className="flex items-center">
                              <Star className="h-3 w-3 mr-1" />
                              {match.matchScore}% match
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 mb-3">{match.bio}</p>
                        <div className="space-y-2">
                          <div>
                            <span className="text-xs font-medium text-slate-700">Skills:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {match.skills.map((skill) => (
                                <Badge key={skill} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-slate-700">Interests:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {match.interests.map((interest) => (
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
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
