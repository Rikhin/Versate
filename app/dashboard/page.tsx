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
  first_name: string
  last_name: string
  school: string
  grade_level: string
  skills: string[]
  roles: string[]
  experience_level: string
  bio: string
  location: string
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
        const response = await fetch("/api/profiles/check")
        if (response.ok) {
          const data = await response.json()
          if (data.profile) {
            setProfile(data.profile)
          } else {
            redirect("/onboarding")
          }
        } else {
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
      title: "Settings",
      description: "Manage your account",
      icon: Settings,
      href: "/settings",
      color: "border-2 border-black text-black hover:bg-black hover:text-white",
    },
  ]

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
                    <AvatarImage src={user?.imageUrl} alt={profile.first_name} />
                    <AvatarFallback className="bg-black text-white font-bold">
                      {profile.first_name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block">
                    <p className="font-bold text-black">{profile.first_name} {profile.last_name}</p>
                    <p className="text-sm text-gray-600">{profile.school}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-8 py-16">
          <TextFade triggerStart="top 80%" triggerEnd="center center" stagger={0.1}>
            {/* Welcome Section */}
            <div className="mb-16">
              <h1 className="text-6xl md:text-7xl font-black text-black mb-8 leading-none">
                Welcome back,
                <br />
                <span className="text-gray-400">{profile.first_name}</span>
              </h1>
              <p className="text-2xl text-gray-600 max-w-3xl leading-relaxed">
                Ready to build something amazing? Here's what's happening in your world.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              {stats.map((stat, index) => (
                <Card key={index} className="border-0 shadow-none bg-transparent">
                  <CardContent className="p-6 text-center">
                    <stat.icon className={`h-8 w-8 mx-auto mb-4 ${stat.color}`} />
                    <div className="text-3xl font-black text-black mb-2">{stat.value}</div>
                    <div className="text-sm text-gray-600 uppercase tracking-widest">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mb-16">
              <div className="text-center mb-12">
                <div className="text-4xl font-black text-black mb-4">Quick Actions</div>
                <p className="text-xl text-gray-600">Get started with these common tasks</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickActions.map((action, index) => (
                  <Link key={index} href={action.href}>
                    <Card className="border-0 shadow-none bg-transparent hover:scale-105 transition-transform cursor-pointer">
                      <CardContent className="p-8 text-center">
                        <action.icon className="h-12 w-12 text-black mx-auto mb-4" />
                        <CardTitle className="text-xl font-black text-black mb-2">{action.title}</CardTitle>
                        <CardDescription className="text-gray-600">{action.description}</CardDescription>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            {/* Profile Overview & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Profile Overview */}
              <div>
                <div className="text-center mb-8">
                  <div className="text-3xl font-black text-black mb-4">Your Profile</div>
                </div>
                <Card className="border-0 shadow-none bg-transparent">
                  <CardContent className="p-8 space-y-6">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={user?.imageUrl} alt={profile.first_name} />
                        <AvatarFallback className="bg-black text-white font-bold text-xl">
                          {profile.first_name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-2xl font-black text-black">{profile.first_name} {profile.last_name}</h3>
                        <p className="text-gray-600">{profile.school} • {profile.grade_level}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{profile.location}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-black mb-3">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {profile.skills?.slice(0, 5).map((skill: string) => (
                          <Badge key={skill} variant="outline" className="border-2 border-gray-300 text-gray-700 px-3 py-1 text-sm font-bold">
                            {skill}
                          </Badge>
                        ))}
                        {profile.skills?.length > 5 && (
                          <Badge variant="outline" className="border-2 border-gray-300 text-gray-700 px-3 py-1 text-sm font-bold">
                            +{profile.skills.length - 5} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-black mb-3">Preferred Roles</h4>
                      <div className="flex flex-wrap gap-2">
                        {profile.roles?.map((role: string) => (
                          <Badge key={role} variant="outline" className="border-2 border-black text-black px-3 py-1 text-sm font-bold">
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-black mb-3">Experience Level</h4>
                      <Badge variant="outline" className="border-2 border-black text-black px-4 py-2 text-sm font-bold">
                        {profile.experience_level}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div>
                <div className="text-center mb-8">
                  <div className="text-3xl font-black text-black mb-4">Recent Activity</div>
                </div>
                <Card className="border-0 shadow-none bg-transparent">
                  <CardContent className="p-8 space-y-6">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex-shrink-0">
                          <activity.icon className="h-6 w-6 text-black" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-black">{activity.title}</h4>
                          <p className="text-gray-600 text-sm">{activity.description}</p>
                          <p className="text-gray-500 text-xs mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                    <div className="text-center pt-4">
                      <Button variant="outline" className="border-2 border-black text-black hover:bg-black hover:text-white">
                        View All Activity
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TextFade>
        </div>
      </div>
    </div>
  )
}
