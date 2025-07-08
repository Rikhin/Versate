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
import { MessageButton } from '@/components/messaging/MessageButton'
import { BackgroundGradient, FloatingShapes } from '@/components/scroll-animations'

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

  const competitions = useMemo(() => [
    "all",
    ...Array.from(new Set(isefProjects.map(p => p.competition || "ISEF")))
  ], [isefProjects]);

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Filter projects by search and filters
  const filteredProjects = isefProjects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesYear = selectedYear === "all" || new Date(project.created_at).getFullYear().toString() === selectedYear
    const matchesCountry = selectedCountry === "all" || project.country === selectedCountry
    const matchesState = selectedState === "all" || project.state === selectedState
    const matchesCity = selectedCity === "all" || project.city === selectedCity
    const matchesAward = selectedAward === "all" || project.awards === selectedAward
    const matchesCompetition = selectedCompetition === "all" || (project.competition || "ISEF") === selectedCompetition
    return matchesSearch && matchesYear && matchesCountry && matchesState && matchesCity && matchesAward && matchesCompetition
  })

  const categories = ["STEM", "Computer Science", "Business & Entrepreneurship", "Innovation & Design"]

  return (
    <div className="min-h-screen bg-helix-dark relative overflow-hidden">
      <BackgroundGradient startColor="from-helix-blue/20" endColor="to-helix-dark-blue/20" triggerStart="top center" triggerEnd="center center" />
      <FloatingShapes count={3} triggerStart="top center" triggerEnd="bottom center" />
      <div className="container mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-5xl font-black text-white mb-4">Explore Projects</h1>
          <p className="text-xl text-helix-text-light">Browse and join exciting student projects</p>
        </div>
        {/* Only show projects grid, no tabs for people/profiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loadingProjects ? (
            <div className="col-span-full text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-helix-gradient-start mx-auto mb-4"></div>
              <p className="text-helix-text-light text-lg">Loading projects...</p>
            </div>
          ) : projectsError ? (
            <div className="col-span-full text-center text-red-400 text-lg">{projectsError}</div>
          ) : filteredProjects.length === 0 ? (
            <div className="col-span-full text-center text-helix-text-light text-lg">No projects found.</div>
          ) : (
            filteredProjects.map((project) => (
              <Card key={project.id} className="glass border border-white/10 rounded-[20px] shadow-2xl hover:shadow-2xl hover:glow transition-all duration-300">
                <Link href={`/explore/projects/${project.id}`}>
                  <CardHeader>
                    <CardTitle className="text-xl font-black text-white">{project.title}</CardTitle>
                    <CardDescription className="text-helix-text-light text-lg">{project.category}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12 border-2 border-white/20">
                        <AvatarImage src={"/placeholder-user.jpg"} alt={project.authors?.[0] || "?"} />
                        <AvatarFallback className="bg-white/10 text-white font-bold">{project.authors?.[0] || "?"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-base font-bold text-white">{project.authors}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-base text-helix-text-light">
                        <div className="flex items-center space-x-2">
                          <Users className="h-5 w-5 text-helix-gradient-start" />
                          <span>ISEF Project</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-5 w-5 text-helix-gradient-start" />
                          <span>{new Date(project.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-base text-helix-text-light">
                        <TrendingUp className="h-5 w-5 text-helix-gradient-start" />
                        <span>{project.awards || "No awards"}</span>
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
