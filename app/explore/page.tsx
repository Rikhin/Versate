"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Search, Users, Calendar, MapPin, Star, Target, Zap, TrendingUp } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase"
import { fakeProfiles, Profile } from "../profiles/page"

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCompetition, setSelectedCompetition] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [activeTab, setActiveTab] = useState("projects")

  // ISEF projects state
  const [isefProjects, setIsefProjects] = useState<any[]>([])
  const [loadingProjects, setLoadingProjects] = useState(false)
  const [projectsError, setProjectsError] = useState<string | null>(null)

  useEffect(() => {
    if (activeTab === "projects" && isefProjects.length === 0 && !loadingProjects) {
      setLoadingProjects(true)
      setProjectsError(null)
      const supabase = createClient()
      supabase
        .from("projects")
        .select("id, title, authors, category, description, awards, created_at")
        .order("created_at", { ascending: false })
        .then(({ data, error }) => {
          if (error) setProjectsError(error.message)
          setIsefProjects(data || [])
          setLoadingProjects(false)
        })
    }
  }, [activeTab])

  // Filter students from fakeProfiles
  const students = fakeProfiles

  // Filter ISEF projects by search/category/competition
  const filteredProjects = isefProjects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCompetition = selectedCompetition === "all" || project.competition === selectedCompetition
    const matchesCategory = selectedCategory === "all" || project.category === selectedCategory
    return matchesSearch && matchesCompetition && matchesCategory
  })

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
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
            <TabsTrigger value="students">Students ({students.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-6">
            {loadingProjects ? (
              <div className="text-center text-gray-500 py-12">Loading ISEF projects...</div>
            ) : projectsError ? (
              <div className="text-center text-red-500 py-12">Error loading projects: {projectsError}</div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <Card key={project.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="secondary">ISEF</Badge>
                        <div className="flex items-center space-x-1">
                          <Zap className="h-4 w-4 text-green-600" />
                        </div>
                      </div>
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={"/placeholder-user.jpg"} alt={project.authors?.[0] || "?"} />
                          <AvatarFallback>{project.authors?.[0] || "?"}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{project.authors}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm text-slate-600">
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>ISEF Project</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(project.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-slate-600">
                          <TrendingUp className="h-4 w-4" />
                          <span>{project.awards || "No awards"}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {students.map((student: Profile) => (
                <Card key={student.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.firstName} />
                        <AvatarFallback>{student.firstName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{student.firstName} {student.lastName}</CardTitle>
                        <CardDescription>{student.gradeLevel}</CardDescription>
                        <div className="flex items-center space-x-2 text-xs text-slate-500 mt-1">
                          <MapPin className="h-3 w-3" />
                          <span>{student.school}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{student.matchScore} match</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Trophy className="h-4 w-4 text-blue-600" />
                        <span>{student.projectsCompleted} projects</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-2">Looking for:</p>
                      <Badge variant="outline" className="text-xs">
                        {student.roles.join(", ")}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-2">Skills:</p>
                      <div className="flex flex-wrap gap-1">
                        {student.skills.slice(0, 3).map((skill: string) => (
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
                    <div>
                      <p className="text-sm text-slate-600 mb-2">Competitions:</p>
                      <div className="flex flex-wrap gap-1">
                        {student.competitions.map((comp: string) => (
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
