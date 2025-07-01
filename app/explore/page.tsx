"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Search, Users, Calendar, MapPin, Star, Target, Zap, TrendingUp, Filter } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"

// Add Profile type for students
interface Profile {
  id: string
  user_id: string
  first_name: string
  last_name: string
  email: string
  school: string
  grade_level: string
  bio: string
  skills: string[]
  roles: string[]
  experience_level: string
  time_commitment: string
  collaboration_style: string[]
  location: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCompetition, setSelectedCompetition] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [activeTab, setActiveTab] = useState("projects")
  const [showFilters, setShowFilters] = useState(true)

  // ISEF projects state
  const [isefProjects, setIsefProjects] = useState<any[]>([])
  const [loadingProjects, setLoadingProjects] = useState(false)
  const [projectsError, setProjectsError] = useState<string | null>(null)

  const [selectedYear, setSelectedYear] = useState("all")
  const [selectedCountry, setSelectedCountry] = useState("all")
  const [selectedState, setSelectedState] = useState("all")
  const [selectedCity, setSelectedCity] = useState("all")
  const [selectedAward, setSelectedAward] = useState("all")

  // Extract unique years, countries, states, cities, and awards from projects
  const years = useMemo(() => ["all", ...Array.from(new Set(isefProjects.map(p => new Date(p.created_at).getFullYear().toString()))).sort()], [isefProjects])
  const countries = useMemo(() => ["all", ...Array.from(new Set(isefProjects.map(p => p.country).filter(Boolean)))], [isefProjects])
  const states = useMemo(() => ["all", ...Array.from(new Set(isefProjects.map(p => p.state).filter(Boolean)))], [isefProjects])
  const cities = useMemo(() => ["all", ...Array.from(new Set(isefProjects.map(p => p.city).filter(Boolean)))], [isefProjects])
  const awards = useMemo(() => ["all", ...Array.from(new Set(isefProjects.map(p => p.awards).filter(Boolean)))], [isefProjects])

  // Add state for students
  const [students, setStudents] = useState<Profile[]>([])
  const [loadingStudents, setLoadingStudents] = useState(false)
  const [studentsError, setStudentsError] = useState<string | null>(null)

  useEffect(() => {
    if (activeTab === "projects" && isefProjects.length === 0 && !loadingProjects) {
      setLoadingProjects(true)
      setProjectsError(null)
      const supabase = createClient()
      supabase
        .from("projects")
        .select("id, title, authors, category, description, awards, created_at, country, state, city")
        .order("created_at", { ascending: false })
        .then(({ data, error }) => {
          if (error) setProjectsError(error.message)
          setIsefProjects(data || [])
          setLoadingProjects(false)
        })
    }
  }, [activeTab])

  // Fetch students (profiles) when students tab is active
  useEffect(() => {
    if (activeTab === "students" && students.length === 0 && !loadingStudents) {
      setLoadingStudents(true)
      setStudentsError(null)
      fetch("/api/profiles/search?limit=50")
        .then(res => res.json())
        .then(data => setStudents(data || []))
        .catch(err => setStudentsError("Failed to load students"))
        .finally(() => setLoadingStudents(false))
    }
  }, [activeTab])

  // Filter projects by search and filters
  const filteredProjects = isefProjects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesYear = selectedYear === "all" || new Date(project.created_at).getFullYear().toString() === selectedYear
    const matchesCountry = selectedCountry === "all" || project.country === selectedCountry
    const matchesState = selectedState === "all" || project.state === selectedState
    const matchesCity = selectedCity === "all" || project.city === selectedCity
    const matchesAward = selectedAward === "all" || project.awards === selectedAward
    return matchesSearch && matchesYear && matchesCountry && matchesState && matchesCity && matchesAward
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
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search projects by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => setShowFilters((v) => !v)}
              aria-label="Toggle filters"
            >
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
          {showFilters && (
            <div className="flex flex-wrap gap-2 items-center">
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="All Years" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>{year === "all" ? "All Years" : year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Countries" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>{country === "all" ? "All Countries" : country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All States" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state} value={state}>{state === "all" ? "All States" : state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Cities" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>{city === "all" ? "All Cities" : city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedAward} onValueChange={setSelectedAward}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Awards" />
                </SelectTrigger>
                <SelectContent>
                  {awards.map((award) => (
                    <SelectItem key={award} value={award}>{award === "all" ? "All Awards" : award}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
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
                  <Link key={project.id} href={`/explore/projects/${project.id}`} className="block group">
                    <Card className="hover:shadow-lg transition-shadow group-hover:border-blue-600">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                          <Badge variant="secondary">ISEF</Badge>
                      <div className="flex items-center space-x-1">
                        <Zap className="h-4 w-4 text-green-600" />
                      </div>
                    </div>
                        <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">{project.title}</CardTitle>
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
                  </Link>
              ))}
            </div>
            )}
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            {loadingStudents ? (
              <div className="text-center text-gray-500 py-12">Loading students...</div>
            ) : studentsError ? (
              <div className="text-center text-red-500 py-12">Error loading students: {studentsError}</div>
            ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {students.map((student: Profile) => (
                <Card key={student.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                          <AvatarImage src={student.avatar_url || "/placeholder.svg"} alt={student.first_name} />
                          <AvatarFallback>{student.first_name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                          <CardTitle className="text-lg">{student.first_name} {student.last_name}</CardTitle>
                          <CardDescription>{student.grade_level}</CardDescription>
                        <div className="flex items-center space-x-2 text-xs text-slate-500 mt-1">
                          <MapPin className="h-3 w-3" />
                          <span>{student.school}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
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
                        <p className="text-sm text-slate-600 mb-2">Looking for:</p>
                        <Badge variant="outline" className="text-xs">
                          {student.roles.join(", ")}
                          </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 mb-2">Bio:</p>
                        <p className="text-sm text-slate-600">{student.bio}</p>
                    </div>
                    <Button className="w-full bg-transparent" variant="outline">
                      <Users className="h-4 w-4 mr-2" />
                      Connect
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
