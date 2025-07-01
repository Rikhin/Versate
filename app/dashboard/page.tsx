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
import { SidebarProvider, Sidebar } from '@/components/ui/sidebar'
import { useRequireProfile } from "@/hooks/use-require-profile"

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
  const { loading, profile } = useRequireProfile()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  if (!profile) {
    return null; // Will redirect, don't render anything
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

  // Extract first name from full_name or fallback
  const firstName = profile.full_name?.split(' ')[0] || 'User'

  // Profile completion calculation
  const profileFields = [
    'full_name', 'bio', 'location', 'experience_level', 'skills', 'goals', 'interests', 'availability', 'preferred_collaboration', 'website', 'github', 'linkedin', 'twitter'
  ];
  const filledFields = profileFields.filter(key => profile[key as keyof Profile] && profile[key as keyof Profile] !== '').length;
  const profileCompletion = Math.min(100, Math.round((filledFields / profileFields.length) * 100));

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-white flex">
        {/* Sidebar - fixed on the left */}
        <div className="fixed top-0 left-0 h-full w-64 z-30 bg-white/90 border-r border-gray-200 shadow-md flex flex-col items-start px-6 py-8">
          <span className="text-lg font-semibold text-gray-900 whitespace-nowrap block mb-8">
            Welcome back, {firstName}! 👋
          </span>
        </div>
        {/* Main Content Container - full width, centered, with left margin for sidebar */}
        <div className="flex-1 ml-64">
          <div className="w-full max-w-7xl mx-auto mt-12 mb-12 px-4 md:px-8">
            <div className="bg-white/95 rounded-2xl shadow-2xl px-8 py-10 md:px-12 md:py-14 space-y-12 border border-gray-100">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                {stats.map((stat, index) => (
                  <div key={index} className="rounded-xl bg-white/90 shadow-sm flex flex-col items-center justify-center py-6 w-full">
                    <div className={`mb-2 flex items-center justify-center w-10 h-10 rounded-full ${stat.color} bg-gray-100`}>{<stat.icon className="h-6 w-6" />}</div>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-base text-gray-700 font-semibold mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                  {quickActions.map((action, index) => (
                    <Link key={index} href={action.href}>
                      <div className="rounded-xl bg-white/90 shadow-sm hover:shadow-lg hover:scale-[1.03] transition-all duration-200 flex flex-col items-center justify-center h-32 cursor-pointer border border-gray-100 w-full">
                        <div className="mb-2 flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-600">{<action.icon className="h-6 w-6" />}</div>
                        <div className="text-base font-semibold text-gray-900">{action.title}</div>
                        <div className="text-xs text-gray-500 mt-1 text-center">{action.description}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Profile Overview */}
              <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Profile Overview</h2>
                <div className="rounded-xl bg-white/90 shadow-sm p-8 flex flex-col md:flex-row gap-8 items-center border border-gray-100 w-full">
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg font-semibold text-gray-900">{profile.full_name || profile.user_id}</span>
                      {profile.experience_level && (
                        <span className="flex items-center gap-1 text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full font-medium">
                          <span className="inline-block w-2 h-2 bg-indigo-400 rounded-full"></span>
                          {profile.experience_level}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                      {profile.location && <><MapPin className="h-4 w-4" />{profile.location}</>}
                    </div>
                    <div className="text-gray-700 text-base mb-4">{profile.bio || <span className="italic text-gray-400">No bio added yet.</span>}</div>
                    {profile.skills && profile.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {profile.skills.map((skill: string, index: number) => (
                          <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-center gap-4 w-full max-w-xs">
                    <Link href="/profile" className="w-full">
                      <Button className="w-full bg-black hover:bg-gray-800 rounded-lg text-base font-semibold py-2">Edit Profile</Button>
                    </Link>
                    <div className="w-full">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-gray-500">Profile completion</span>
                        <span className="text-xs text-gray-700 font-semibold">{profileCompletion}%</span>
                      </div>
                      <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="absolute left-0 top-0 h-3 rounded-full bg-indigo-500 transition-all duration-500"
                          style={{ width: `${profileCompletion}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Recent Activity</h2>
                <div className="space-y-4 w-full">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="rounded-xl bg-white/90 shadow-sm p-4 flex items-center gap-4 border border-gray-100 w-full">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <activity.icon className="h-5 w-5 text-indigo-500" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{activity.title}</div>
                        <div className="text-sm text-gray-500">{activity.description}</div>
                      </div>
                      <span className="text-xs text-gray-400">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations (swap Projects and Competitions, add View All) */}
              <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Recommended for You</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                  {/* Competitions card first */}
                  <div className="rounded-xl bg-white/90 shadow-sm p-6 flex flex-col h-full border border-gray-100 w-full">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Trophy className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Hackathons</div>
                        <div className="text-sm text-gray-600">Perfect timing</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mb-4">
                      Several hackathons are starting soon. Ready to compete?
                    </div>
                    <Button variant="outline" className="w-full mb-2">
                      View Competitions
                    </Button>
                    <Link href="/competitions" className="w-full">
                      <Button variant="secondary" className="w-full mt-auto">View All</Button>
                    </Link>
                  </div>
                  {/* Projects card second */}
                  <div className="rounded-xl bg-white/90 shadow-sm p-6 border border-gray-100 w-full">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Code className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Web Development</div>
                        <div className="text-sm text-gray-600">Based on your skills</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mb-4">
                      Join teams working on web applications and improve your frontend skills.
                    </div>
                    <Button variant="outline" className="w-full">
                      Explore Projects
                    </Button>
                  </div>
                  {/* Team Building card remains last */}
                  <div className="rounded-xl bg-white/90 shadow-sm p-6 border border-gray-100 w-full">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Users className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Team Building</div>
                        <div className="text-sm text-gray-600">Network expansion</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mb-4">
                      Connect with other students who share your interests and goals.
                    </div>
                    <Button variant="outline" className="w-full">
                      Browse Profiles
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}
