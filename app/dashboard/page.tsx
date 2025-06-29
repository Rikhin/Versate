"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Trophy, 
  Users, 
  Target, 
  Star, 
  ArrowRight, 
  Code, 
  Award, 
  Zap,
  Calendar,
  MapPin,
  BookOpen,
  Settings,
  BarChart3,
  FolderOpen,
  UserCheck,
  TrendingUp
} from "lucide-react"
import Link from "next/link"
import { BackgroundGradient, FloatingShapes, TextFade } from "@/components/scroll-animations"

interface Profile {
  id: string
  user_id: string
  full_name: string
  bio: string
  location: string
  website: string
  github: string
  linkedin: string
  twitter: string
  experience_level: string
  interests: string[]
  skills: string[]
  goals: string[]
  availability: string
  preferred_collaboration: string
  created_at: string
  updated_at: string
}

export default function DashboardPage() {
  const { user, isLoaded } = useUser()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoaded) return

    if (!user) {
      redirect("/sign-in")
    }

    // Fetch user profile
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/profiles/${user.id}`)
        if (response.ok) {
          const data = await response.json()
          setProfile(data)
        } else if (response.status === 404) {
          // No profile found, redirect to onboarding
          redirect("/onboarding")
        } else {
          console.error("Error fetching profile:", response.statusText)
          redirect("/onboarding")
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
        redirect("/onboarding")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user, isLoaded])

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const stats = [
    { label: "Projects Joined", value: "3", icon: FolderOpen, color: "text-blue-600" },
    { label: "Teams Created", value: "1", icon: Users, color: "text-green-600" },
    { label: "Competitions", value: "2", icon: Trophy, color: "text-purple-600" },
    { label: "Match Score", value: "94%", icon: Star, color: "text-yellow-600" },
  ]

  const recentActivity = [
    {
      type: "project",
      title: "AI-Powered Study Assistant",
      description: "Joined as Developer",
      time: "2 hours ago",
      icon: Code,
    },
    {
      type: "competition",
      title: "Congressional App Challenge",
      description: "Application submitted",
      time: "1 day ago",
      icon: Trophy,
    },
    {
      type: "team",
      title: "Sustainable Energy Monitor",
      description: "Team invitation accepted",
      time: "3 days ago",
      icon: Users,
    },
  ]

  const quickActions = [
    {
      title: "Explore Projects",
      description: "Find your next team",
      icon: Target,
      href: "/explore",
      color: "bg-black hover:bg-gray-800",
    },
    {
      title: "View Profiles",
      description: "Connect with students",
      icon: UserCheck,
      href: "/profiles",
      color: "border-2 border-black text-black hover:bg-black hover:text-white",
    },
    {
      title: "Competitions",
      description: "Browse opportunities",
      icon: Award,
      href: "/competitions",
      color: "border-2 border-black text-black hover:bg-black hover:text-white",
    },
    {
      title: "My Profile",
      description: "Edit your profile",
      icon: Settings,
      href: "/profile",
      color: "border-2 border-black text-black hover:bg-black hover:text-white",
    },
  ]

  // Extract first name from full_name or use user's first name
  const firstName = profile.full_name?.split(' ')[0] || user?.firstName || 'User'

  return (
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
                  <span className="text-2xl font-black text-black">ColabBoard</span>
                  <p className="text-sm text-gray-600">Dashboard</p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.imageUrl} alt={profile.full_name} />
                    <AvatarFallback className="bg-black text-white font-bold">
                      {firstName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block">
                    <p className="font-bold text-black">{profile.full_name || user?.fullName}</p>
                    <p className="text-sm text-gray-600">{profile.location || 'Location not set'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <TextFade 
              className="text-4xl font-bold text-gray-900 mb-2"
              triggerStart="top center"
            >
              Welcome back, {firstName}! 👋
            </TextFade>
            <TextFade 
              className="text-lg text-gray-600"
              triggerStart="top center"
            >
              Ready to build something amazing? Here's what's happening in your world.
            </TextFade>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                    </div>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <TextFade 
              className="text-2xl font-bold text-gray-900 mb-6"
              triggerStart="top center"
            >
              Quick Actions
            </TextFade>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href}>
                  <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-lg ${action.color} transition-colors`}>
                          <action.icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{action.title}</h3>
                          <p className="text-sm text-gray-600">{action.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Profile Overview */}
          <div className="mb-8">
            <TextFade 
              className="text-2xl font-bold text-gray-900 mb-6"
              triggerStart="top center"
            >
              Profile Overview
            </TextFade>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{profile.full_name || user?.fullName}</h3>
                    <p className="text-gray-600 mb-4">{profile.bio || 'No bio added yet. Add one to help others get to know you!'}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {profile.location && (
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{profile.location}</span>
                        </div>
                      )}
                      {profile.experience_level && (
                        <div className="flex items-center space-x-2">
                          <BookOpen className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{profile.experience_level}</span>
                        </div>
                      )}
                    </div>

                    {profile.skills && profile.skills.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {profile.skills.slice(0, 5).map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {profile.skills.length > 5 && (
                            <Badge variant="outline" className="text-xs">
                              +{profile.skills.length - 5} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col space-y-4">
                    <Link href="/profile">
                      <Button className="w-full bg-black hover:bg-gray-800">
                        Edit Profile
                      </Button>
                    </Link>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Profile completion</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-black h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${Math.min(100, (Object.keys(profile).filter(key => 
                              profile[key as keyof Profile] && 
                              profile[key as keyof Profile] !== '' && 
                              key !== 'id' && 
                              key !== 'user_id' && 
                              key !== 'created_at' && 
                              key !== 'updated_at'
                            ).length / 10) * 100)}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="mb-8">
            <TextFade 
              className="text-2xl font-bold text-gray-900 mb-6"
              triggerStart="top center"
            >
              Recent Activity
            </TextFade>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <Card key={index} className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <activity.icon className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{activity.title}</h3>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                      </div>
                      <span className="text-sm text-gray-500">{activity.time}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <TextFade 
              className="text-2xl font-bold text-gray-900 mb-6"
              triggerStart="top center"
            >
              Recommended for You
            </TextFade>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Code className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Web Development</h3>
                      <p className="text-sm text-gray-600">Based on your skills</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Join teams working on web applications and improve your frontend skills.
                  </p>
                  <Button variant="outline" className="w-full">
                    Explore Projects
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Trophy className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Hackathons</h3>
                      <p className="text-sm text-gray-600">Perfect timing</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Several hackathons are starting soon. Ready to compete?
                  </p>
                  <Button variant="outline" className="w-full">
                    View Competitions
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Users className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Team Building</h3>
                      <p className="text-sm text-gray-600">Network expansion</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Connect with other students who share your interests and goals.
                  </p>
                  <Button variant="outline" className="w-full">
                    Browse Profiles
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
