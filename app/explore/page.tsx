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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Explore Projects</h1>
          <p className="text-slate-600">Browse and join exciting student projects</p>
        </div>
        {/* Only show projects grid, no tabs for people/profiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loadingProjects ? (
            <div className="col-span-full text-center text-gray-500">Loading projects...</div>
          ) : projectsError ? (
            <div className="col-span-full text-center text-red-500">{projectsError}</div>
          ) : filteredProjects.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">No projects found.</div>
          ) : (
            filteredProjects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <Link href={`/explore/projects/${project.id}`}>
                  <CardHeader>
                    <CardTitle className="text-lg font-bold">{project.title}</CardTitle>
                    <CardDescription>{project.category}</CardDescription>
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
                </Link>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
