"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  Filter,
  MapPin,
  School,
  Calendar,
  MessageSquare,
  UserCheck,
  TrendingUp,
  ArrowUpDown
} from "lucide-react"
import Link from "next/link"
import { BackgroundGradient, FloatingShapes, TextFade } from "@/components/scroll-animations"
import { MessageButton } from "@/components/messaging/MessageButton"
import { useUser } from "@clerk/nextjs"

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

export default function ProfilesPage() {
  const { user } = useUser()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedExperience, setSelectedExperience] = useState("all")
  const [selectedRole, setSelectedRole] = useState("all")
  const [sortBy, setSortBy] = useState("recent")

  useEffect(() => {
    fetchProfiles()
  }, [])

  const fetchProfiles = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/profiles/search?limit=50")
      if (response.ok) {
        const data = await response.json()
        setProfiles(data)
      }
    } catch (error) {
      console.error("Error fetching profiles:", error)
    } finally {
      setLoading(false)
    }
  }

  // Filter and sort profiles
  const filteredProfiles = useMemo(() => {
    let filtered = profiles.filter((profile) => {
      const matchesSearch = 
        `${profile.first_name} ${profile.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.school?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.skills?.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
        profile.bio?.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesExperience = selectedExperience === "all" || profile.experience_level === selectedExperience
      const matchesRole = selectedRole === "all" || profile.roles?.includes(selectedRole)
      
      return matchesSearch && matchesExperience && matchesRole
    })

    // Sort profiles
    switch (sortBy) {
      case "name":
        filtered.sort((a, b) => `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`))
        break
      case "recent":
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
      case "experience":
        const experienceOrder = { "Beginner": 1, "Intermediate": 2, "Advanced": 3, "Expert": 4 }
        filtered.sort((a, b) => (experienceOrder[a.experience_level as keyof typeof experienceOrder] || 0) - (experienceOrder[b.experience_level as keyof typeof experienceOrder] || 0))
        break
    }

    return filtered
  }, [profiles, searchQuery, selectedExperience, selectedRole, sortBy])

  // Extract unique values for filters
  const experienceLevels = useMemo(() => ["all", ...Array.from(new Set(profiles.map(p => p.experience_level).filter(Boolean)))], [profiles])
  const allRoles = useMemo(() => ["all", ...Array.from(new Set(profiles.flatMap(p => p.roles || [])))], [profiles])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <BackgroundGradient 
        startColor="from-blue-50/50" 
        endColor="to-purple-50/50" 
        triggerStart="top center"
        triggerEnd="bottom center"
      />
      <FloatingShapes 
        count={8} 
        triggerStart="top center"
        triggerEnd="bottom center"
      />
      
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8">
          <TextFade triggerStart="top 80%" triggerEnd="center center" stagger={0.1}>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-800 mb-2">Find Your Perfect Teammate</h1>
              <p className="text-slate-600">Connect with talented students and build amazing teams together</p>
            </div>

            {/* Search and Filters */}
            <div className="mb-8 space-y-4">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Search by name, school, skills, or bio..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <ArrowUpDown className="h-4 w-4 text-slate-400" />
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="experience">Experience</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 items-center">
                <Select value={selectedExperience} onValueChange={setSelectedExperience}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Experience Level" />
                  </SelectTrigger>
                  <SelectContent>
                    {experienceLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level === "all" ? "All Levels" : level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    {allRoles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role === "all" ? "All Roles" : role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Profiles Grid */}
            {loading ? (
              <div className="text-center py-12">
                <div className="text-gray-500">Loading profiles...</div>
              </div>
            ) : filteredProfiles.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500">
                  {searchQuery || selectedExperience !== "all" || selectedRole !== "all" 
                    ? "No profiles match your search criteria." 
                    : "No profiles found."}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProfiles.map((profile) => (
                  <Card key={profile.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={profile.avatar_url || "/placeholder-user.jpg"} alt={`${profile.first_name} ${profile.last_name}`} />
                          <AvatarFallback>{profile.first_name[0]}{profile.last_name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{profile.first_name} {profile.last_name}</CardTitle>
                          <CardDescription>{profile.grade_level || "Student"}</CardDescription>
                          <div className="flex items-center space-x-2 text-xs text-slate-500 mt-1">
                            <School className="h-3 w-3" />
                            <span>{profile.school || "School not specified"}</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span>{profile.experience_level || "Beginner"}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Trophy className="h-4 w-4 text-blue-600" />
                          <span>{profile.time_commitment || "Flexible"}</span>
                        </div>
                      </div>
                      
                      {profile.bio && (
                        <div>
                          <p className="text-sm text-slate-600 line-clamp-3">{profile.bio}</p>
                        </div>
                      )}
                      
                      {profile.roles && profile.roles.length > 0 && (
                        <div>
                          <p className="text-sm text-slate-600 mb-2">Looking for:</p>
                          <Badge variant="outline" className="text-xs">
                            {profile.roles.join(", ")}
                          </Badge>
                        </div>
                      )}
                      
                      {profile.skills && profile.skills.length > 0 && (
                        <div>
                          <p className="text-sm text-slate-600 mb-2">Skills:</p>
                          <div className="flex flex-wrap gap-1">
                            {profile.skills.slice(0, 3).map((skill) => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {profile.skills.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{profile.skills.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex space-x-2">
                        {user && user.id !== profile.user_id && (
                          <MessageButton
                            recipientId={profile.user_id}
                            recipientName={`${profile.first_name} ${profile.last_name}`}
                            className="flex-1"
                          />
                        )}
                        <Button asChild variant="outline" size="sm" className="flex-1">
                          <Link href={`/profiles/${profile.user_id}`}>
                            <UserCheck className="h-4 w-4 mr-2" />
                            View Profile
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TextFade>
        </div>
      </div>
    </div>
  )
}

export type { Profile }
