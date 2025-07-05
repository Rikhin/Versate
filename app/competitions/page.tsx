"use client"

import { useState, useMemo, useEffect } from "react"
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
  ExternalLink,
  UserCheck
} from "lucide-react"
import Link from "next/link"
import { BackgroundGradient, FloatingShapes, TextFade } from "@/components/scroll-animations"
import { competitions } from "@/lib/competitions-data"
import { SignInButton, SignUpButton, useUser } from "@clerk/nextjs"
import OnboardingScrollEnforcer from "@/components/onboarding/OnboardingScrollEnforcer"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

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
  teamRequired: boolean
}

interface CompetitionInterest {
  competitionId: string
  interest: 'competing' | 'looking_for_partner' | 'looking_for_mentor'
}

const categories = [
  { id: "all", name: "All Categories", icon: "🏆" },
  { id: "Technology", name: "Technology", icon: "💻" },
  { id: "STEM", name: "STEM", icon: "🔬" },
  { id: "Business", name: "Business", icon: "💼" },
  { id: "Robotics", name: "Robotics", icon: "🤖" }
]

export default function CompetitionsPage() {
  const { isSignedIn, isLoaded } = useUser()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCompetitions, setSelectedCompetitions] = useState<{ [key: string]: CompetitionInterest[] }>({})

  // Prevent hydration mismatch by not rendering until loaded
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  const filteredCompetitions = useMemo(() => {
    return competitions.filter(competition => {
      const matchesSearch = competition.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           competition.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           competition.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      
      return matchesSearch
    })
  }, [searchQuery])

  const handleCompetitionToggle = (competitionId: string, interest: 'competing' | 'looking_for_partner' | 'looking_for_mentor', checked: boolean) => {
    setSelectedCompetitions(prev => {
      const current = prev[competitionId] || []
      let updated
      
      if (checked) {
        updated = [...current, { competitionId, interest }]
      } else {
        updated = current.filter(c => !(c.competitionId === competitionId && c.interest === interest))
      }
      
      return {
        ...prev,
        [competitionId]: updated
      }
    })
  }

  const isChecked = (competitionId: string, interest: string) => {
    return selectedCompetitions[competitionId]?.some(c => c.interest === interest) || false
  }

  const getSelectedCount = (competitionId: string) => {
    return selectedCompetitions[competitionId]?.length || 0
  }

  const saveSelections = async () => {
    try {
      const competitionsArray = Object.values(selectedCompetitions).flat()
      
      const response = await fetch("/api/profiles/competitions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          competitions: competitionsArray,
        }),
      })

      if (response.ok) {
        alert("Competition interests saved successfully!")
      } else {
        throw new Error("Failed to save competition interests")
      }
    } catch (error) {
      console.error("Error saving competition interests:", error)
      alert("Failed to save competition interests. Please try again.")
    }
  }

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
    <OnboardingScrollEnforcer>
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
                    <span className="text-2xl font-black text-black">Versate</span>
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
          <div className="container mx-auto px-4 md:px-8 py-8 md:py-16">
            <TextFade triggerStart="top 80%" triggerEnd="center center" stagger={0.1}>
              {/* Header Section */}
              <div className="text-center mb-8 md:mb-16">
                <h1 className="text-2xl sm:text-3xl md:text-6xl md:text-7xl font-black text-black mb-4 md:mb-8 leading-none">
                  Academic<br /><span className="text-gray-400">Competitions</span>
                </h1>
                <p className="text-sm sm:text-base md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Discover prestigious competitions and opportunities to showcase your skills and win amazing prizes
                </p>
              </div>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto mb-8">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Search competitions by name, category, or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 text-base border-2 border-gray-200 focus:border-indigo-400 rounded-xl"
                  />
                </div>
              </div>

              {/* Competition Results */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {filteredCompetitions.map((competition) => (
                  <Card key={competition.id} className="hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{competition.icon}</span>
                          <CardTitle className="text-lg font-semibold">{competition.name}</CardTitle>
                        </div>
                        {getSelectedCount(competition.id) > 0 && (
                          <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
                            {getSelectedCount(competition.id)} selected
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{competition.category}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-700 line-clamp-3">{competition.description}</p>
                      
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-gray-900">What are you interested in?</Label>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`${competition.id}-competing`}
                              checked={isChecked(competition.id, 'competing')}
                              onCheckedChange={(checked) => 
                                handleCompetitionToggle(competition.id, 'competing', checked as boolean)
                              }
                              className="border-2 border-gray-200 data-[state=checked]:border-indigo-500"
                            />
                            <Label 
                              htmlFor={`${competition.id}-competing`} 
                              className="text-sm font-normal cursor-pointer flex items-center space-x-1"
                            >
                              <Target className="h-4 w-4" />
                              <span>Competing</span>
                            </Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`${competition.id}-partner`}
                              checked={isChecked(competition.id, 'looking_for_partner')}
                              onCheckedChange={(checked) => 
                                handleCompetitionToggle(competition.id, 'looking_for_partner', checked as boolean)
                              }
                              className="border-2 border-gray-200 data-[state=checked]:border-indigo-500"
                            />
                            <Label 
                              htmlFor={`${competition.id}-partner`} 
                              className="text-sm font-normal cursor-pointer flex items-center space-x-1"
                            >
                              <Users className="h-4 w-4" />
                              <span>Need Partner</span>
                            </Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`${competition.id}-mentor`}
                              checked={isChecked(competition.id, 'looking_for_mentor')}
                              onCheckedChange={(checked) => 
                                handleCompetitionToggle(competition.id, 'looking_for_mentor', checked as boolean)
                              }
                              className="border-2 border-gray-200 data-[state=checked]:border-indigo-500"
                            />
                            <Label 
                              htmlFor={`${competition.id}-mentor`} 
                              className="text-sm font-normal cursor-pointer flex items-center space-x-1"
                            >
                              <UserCheck className="h-4 w-4" />
                              <span>Need Mentor</span>
                            </Label>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-gray-100">
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Deadline: {formatDeadline(competition.deadline)}</span>
                          <span>{competition.participants}/{competition.maxParticipants} participants</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Save Button */}
              <div className="text-center">
                <Button 
                  onClick={saveSelections}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl text-base font-medium"
                >
                  Save Competition Interests
                </Button>
              </div>

              {/* No Results */}
              {filteredCompetitions.length === 0 && searchQuery && (
                <div className="text-center py-12">
                  <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No competitions found</h3>
                  <p className="text-gray-600">Try adjusting your search terms or browse all competitions</p>
                </div>
              )}
            </TextFade>
          </div>
        </div>
      </div>
    </OnboardingScrollEnforcer>
  )
}
