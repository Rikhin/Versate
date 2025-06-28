"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Trophy,
  Users,
  MessageSquare,
  Search,
  Plus,
  Calendar,
  Clock,
  Star,
  TrendingUp,
  Target,
  Zap,
} from "lucide-react"
import Link from "next/link"

// Mock user data - replace with your auth solution later
const mockUser = {
  firstName: "John",
  username: "john_doe",
  imageUrl: "/placeholder-user.jpg",
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")

  const mockProjects = [
    {
      id: 1,
      title: "AI-Powered Study Assistant",
      competition: "Congressional App Challenge",
      category: "Computer Science",
      deadline: "2024-03-15",
      progress: 65,
      teamSize: 3,
      maxTeamSize: 5,
      status: "In Progress",
      techStack: ["React", "Python", "Machine Learning"],
      members: [
        { name: "You", avatar: "/placeholder-user.jpg" },
        { name: "Sarah Chen", avatar: "/placeholder-user.jpg" },
        { name: "Mike Johnson", avatar: "/placeholder-user.jpg" },
      ],
    },
    {
      id: 2,
      title: "Sustainable Energy Monitor",
      competition: "Regeneron ISEF",
      category: "STEM",
      deadline: "2024-04-20",
      progress: 30,
      teamSize: 2,
      maxTeamSize: 4,
      status: "Looking for Members",
      techStack: ["Arduino", "IoT", "Data Analysis"],
      members: [
        { name: "You", avatar: "/placeholder-user.jpg" },
        { name: "Alex Rivera", avatar: "/placeholder-user.jpg" },
      ],
    },
  ]

  const mockRecommendations = [
    {
      id: 3,
      title: "Blockchain Voting System",
      competition: "Diamond Challenge",
      category: "Innovation & Design",
      match: 92,
      lookingFor: ["Developer", "Designer"],
      techStack: ["Blockchain", "React", "Node.js"],
    },
    {
      id: 4,
      title: "Mental Health Chatbot",
      competition: "Technovation Girls",
      category: "Computer Science",
      match: 87,
      lookingFor: ["AI Researcher", "UX Designer"],
      techStack: ["Python", "NLP", "Flutter"],
    },
  ]

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
            <Link href="/dashboard" className="text-slate-600 hover:text-slate-800 font-medium">
              Dashboard
            </Link>
            <Link href="/explore" className="text-slate-600 hover:text-slate-800">
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
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Welcome back, {mockUser.firstName || mockUser.username || "there"}!
          </h1>
          <p className="text-slate-600">Here's what's happening with your projects and team collaborations.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Active Projects</p>
                  <p className="text-2xl font-bold text-slate-800">2</p>
                </div>
                <Trophy className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Team Members</p>
                  <p className="text-2xl font-bold text-slate-800">5</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Messages</p>
                  <p className="text-2xl font-bold text-slate-800">12</p>
                </div>
                <MessageSquare className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Match Score</p>
                  <p className="text-2xl font-bold text-slate-800">94%</p>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="projects">My Projects</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Recent Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Sarah Chen joined your AI Study Assistant project</p>
                      <p className="text-xs text-slate-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Completed milestone: Data Collection Phase</p>
                      <p className="text-xs text-slate-500">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">New message from Mike Johnson</p>
                      <p className="text-xs text-slate-500">2 days ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Deadlines */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Upcoming Deadlines</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <p className="font-medium text-red-800">AI Study Assistant</p>
                      <p className="text-sm text-red-600">Congressional App Challenge</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-red-800">Mar 15</p>
                      <p className="text-xs text-red-600">23 days left</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <p className="font-medium text-yellow-800">Energy Monitor</p>
                      <p className="text-sm text-yellow-600">Regeneron ISEF</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-yellow-800">Apr 20</p>
                      <p className="text-xs text-yellow-600">59 days left</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-800">My Projects</h2>
              <Link href="/projects/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockProjects.map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                        <CardDescription>{project.competition}</CardDescription>
                      </div>
                      <Badge variant={project.status === "In Progress" ? "default" : "secondary"}>
                        {project.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>
                          {project.teamSize}/{project.maxTeamSize} members
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{project.deadline}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {project.techStack.map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-slate-600">Team:</span>
                      <div className="flex -space-x-2">
                        {project.members.map((member, index) => (
                          <Avatar key={index} className="h-6 w-6 border-2 border-white">
                            <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                            <AvatarFallback className="text-xs">{member.name[0]}</AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-800">Recommended Projects</h2>
              <Link href="/explore">
                <Button variant="outline">
                  <Search className="h-4 w-4 mr-2" />
                  Explore More
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockRecommendations.map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                        <CardDescription>{project.competition}</CardDescription>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Zap className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-600">{project.match}% match</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-slate-600 mb-2">Looking for:</p>
                      <div className="flex flex-wrap gap-1">
                        {project.lookingFor.map((role) => (
                          <Badge key={role} variant="secondary">
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-slate-600 mb-2">Tech Stack:</p>
                      <div className="flex flex-wrap gap-1">
                        {project.techStack.map((tech) => (
                          <Badge key={tech} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
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
        </Tabs>
      </div>
    </div>
  )
}
