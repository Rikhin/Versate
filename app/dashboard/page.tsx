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
      <div className="min-h-screen bg-helix-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-helix-gradient-start mx-auto mb-4"></div>
          <p className="text-helix-text-light">Loading...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return null; // Will redirect, don't render anything
  }

  const stats = [
    { label: "Projects Joined", value: "", icon: FolderOpen, color: "text-blue-400" },
    { label: "Teams Created", value: "", icon: Users, color: "text-green-400" },
    { label: "Competitions", value: "", icon: Trophy, color: "text-purple-400" },
  ]

  const recentActivity: Array<{
    type: string;
    title: string;
    description: string;
    time: string;
    icon: any;
  }> = []

  const quickActions = [
    {
      title: "Explore Projects",
      description: "Find your next team",
      icon: Target,
      href: "/explore",
      color: "bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end text-white hover:shadow-xl glow",
    },
    {
      title: "View Profiles",
      description: "Connect with students",
      icon: UserCheck,
      href: "/connect",
      color: "border-2 border-white/20 text-white hover:bg-white/10",
    },
    {
      title: "Competitions",
      description: "Browse opportunities",
      icon: Award,
      href: "/competitions",
      color: "border-2 border-white/20 text-white hover:bg-white/10",
    },
    {
      title: "My Profile",
      description: "Edit your profile",
      icon: Settings,
      href: "/profile",
      color: "border-2 border-white/20 text-white hover:bg-white/10",
    },
  ]

  // Extract first name from full_name or fallback
  const firstName = profile.full_name?.split(' ')[0] || 'User'

  // Profile completion calculation - using actual database fields
  const profileFields = [
    'first_name', 'last_name', 'email', 'school', 'grade_level', 'bio', 'skills', 'roles', 'experience_level', 'time_commitment', 'collaboration_style', 'location'
  ];
  const filledFields = profileFields.filter(key => {
    const value = profile[key as keyof Profile];
    if (Array.isArray(value)) {
      return value && value.length > 0;
    }
    return value && value !== '';
  }).length;
  const profileCompletion = Math.min(100, Math.round((filledFields / profileFields.length) * 100));

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-helix-dark relative overflow-hidden">
        <BackgroundGradient startColor="from-helix-blue/20" endColor="to-helix-dark-blue/20" triggerStart="top center" triggerEnd="center center" />
        <FloatingShapes count={3} triggerStart="top center" triggerEnd="bottom center" />
        {/* Sidebar - fixed on the left, hidden on mobile */}
        <div className="hidden md:flex fixed top-0 left-0 h-full w-64 z-30 glass border-r border-white/10 shadow-md flex-col items-start px-6 py-8">
          <span className="text-xl font-bold text-white whitespace-nowrap block mb-8">
            Welcome back, {firstName}! 👋
          </span>
        </div>
        {/* Main Content Container - full width, centered, with left margin for sidebar on desktop */}
        <div className="flex-1 ml-0 md:ml-64">
          <div className="w-full max-w-7xl mx-auto mt-8 mb-8 px-6 lg:px-8">
            <div className="glass border border-white/10 rounded-[24px] shadow-2xl px-8 py-10 md:px-12 md:py-14 space-y-12 md:space-y-16">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 w-full">
                {stats.map((stat, index) => (
                  <div key={index} className="glass border border-white/10 rounded-[16px] shadow-xl flex flex-col items-center justify-center py-8 w-full hover:glow transition-all duration-300">
                    <div className={`mb-4 flex items-center justify-center w-12 h-12 rounded-full bg-white/10 border border-white/20 ${stat.color}`}>{<stat.icon className="h-7 w-7" />}</div>
                    <div className="text-2xl sm:text-3xl font-black text-white">{stat.value}</div>
                    <div className="text-base sm:text-lg text-helix-text-light font-bold mt-2">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="space-y-6">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 w-full">
                  {quickActions.map((action, index) => (
                    <Link key={index} href={action.href} className="w-full">
                      <div className="glass border border-white/10 rounded-[16px] shadow-xl hover:shadow-2xl hover:glow transition-all duration-300 flex flex-col items-center justify-center h-32 sm:h-36 cursor-pointer w-full">
                        <div className="mb-4 flex items-center justify-center w-12 h-12 rounded-full bg-white/10 border border-white/20 text-helix-gradient-start">{<action.icon className="h-7 w-7" />}</div>
                        <div className="text-lg font-bold text-white">{action.title}</div>
                        <div className="text-sm text-helix-text-light mt-2 text-center">{action.description}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Profile Overview */}
              <div className="space-y-6">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-6">Profile Overview</h2>
                <div className="glass border border-white/10 rounded-[16px] shadow-xl p-8 flex flex-col md:flex-row gap-8 items-center w-full">
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-xl sm:text-2xl font-bold text-white">{(profile.full_name && profile.full_name.split(' ')[0]) || profile.first_name || "Your Name"}</span>
                      {profile.experience_level && (
                        <span className="flex items-center gap-2 text-sm bg-white/10 border border-white/20 text-helix-gradient-start px-4 py-2 rounded-full font-bold">
                          <span className="inline-block w-3 h-3 bg-helix-gradient-start rounded-full"></span>
                          {profile.experience_level}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-helix-text-light text-sm mb-4">
                      {profile.location && <><MapPin className="h-5 w-5" />{profile.location}</>}
                    </div>
                    <div className="text-helix-text-light text-base mb-6">{profile.bio || <span className="italic text-helix-text-light">No bio added yet.</span>}</div>
                    {profile.skills && profile.skills.length > 0 && (
                      <div className="flex flex-wrap gap-3 mt-4">
                        {profile.skills.map((skill: string, index: number) => (
                          <span key={index} className="bg-white/10 border border-white/20 text-helix-text-light px-4 py-2 rounded-full text-sm font-bold">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-center gap-6 w-full max-w-xs">
                    <Link href="/profile" className="w-full">
                      <Button className="w-full bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end text-white hover:shadow-xl glow rounded-full text-lg font-bold py-4">Edit Profile</Button>
                    </Link>
                    <div className="w-full">
                      <div className="flex justify-between mb-3">
                        <span className="text-sm text-helix-text-light">Profile completion</span>
                        <span className="text-sm text-white font-bold">{profileCompletion}%</span>
                      </div>
                      <div className="relative h-4 bg-white/10 rounded-full overflow-hidden border border-white/20">
                        <div
                          className="absolute left-0 top-0 h-4 rounded-full bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end transition-all duration-500"
                          style={{ width: `${profileCompletion}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="space-y-6">
                <h2 className="text-2xl md:text-3xl font-black text-white mb-6">Recent Activity</h2>
                <div className="space-y-4 w-full">
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity, index) => (
                      <div key={index} className="glass border border-white/10 rounded-[16px] shadow-xl p-6 flex items-center gap-6 w-full">
                        <div className="p-3 bg-white/10 border border-white/20 rounded-[12px]">
                          <activity.icon className="h-6 w-6 text-helix-gradient-start" />
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-white text-lg">{activity.title}</div>
                          <div className="text-base text-helix-text-light">{activity.description}</div>
                        </div>
                        <span className="text-sm text-helix-text-light">{activity.time}</span>
                      </div>
                    ))
                  ) : (
                    <div className="glass border border-white/10 rounded-[16px] shadow-xl p-12 flex items-center justify-center w-full">
                      <div className="text-center text-helix-text-light">
                        <div className="text-xl font-bold mb-4">No recent activity</div>
                        <div className="text-base">Start exploring projects and connecting with teams to see your activity here.</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Recommendations (swap Projects and Competitions, add View All) */}
              <div className="space-y-6">
                <h2 className="text-2xl md:text-3xl font-black text-white mb-6">Recommended for You</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                  {/* Competitions card first */}
                  <div className="glass border border-white/10 rounded-[16px] shadow-xl p-8 flex flex-col h-full w-full hover:glow transition-all duration-300">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="p-3 bg-green-400/20 border border-green-400/30 rounded-[12px]">
                        <Trophy className="h-6 w-6 text-green-400" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-lg">Hackathons</div>
                        <div className="text-base text-helix-text-light">Perfect timing</div>
                      </div>
                    </div>
                    <div className="text-base text-helix-text-light mb-6">
                      Several hackathons are starting soon. Ready to compete?
                    </div>
                    <Button variant="outline" className="w-full mb-4 border-2 border-white/20 text-white hover:bg-white/10 rounded-full font-bold">
                      View Competitions
                    </Button>
                    <Link href="/competitions" className="w-full">
                      <Button className="w-full mt-auto bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end text-white hover:shadow-xl glow rounded-full font-bold">View All</Button>
                    </Link>
                  </div>
                  {/* Projects card second */}
                  <div className="glass border border-white/10 rounded-[16px] shadow-xl p-8 w-full hover:glow transition-all duration-300">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="p-3 bg-blue-400/20 border border-blue-400/30 rounded-[12px]">
                        <Code className="h-6 w-6 text-blue-400" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-lg">Web Development</div>
                        <div className="text-base text-helix-text-light">Based on your skills</div>
                      </div>
                    </div>
                    <div className="text-base text-helix-text-light mb-6">
                      Join teams working on web applications and improve your frontend skills.
                    </div>
                    <Button variant="outline" className="w-full border-2 border-white/20 text-white hover:bg-white/10 rounded-full font-bold">
                      Explore Projects
                    </Button>
                  </div>
                  {/* Team Building card remains last */}
                  <div className="glass border border-white/10 rounded-[16px] shadow-xl p-8 w-full hover:glow transition-all duration-300">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="p-3 bg-purple-400/20 border border-purple-400/30 rounded-[12px]">
                        <Users className="h-6 w-6 text-purple-400" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-lg">Team Building</div>
                        <div className="text-base text-helix-text-light">Network expansion</div>
                      </div>
                    </div>
                    <div className="text-base text-helix-text-light mb-6">
                      Connect with other students who share your interests and goals.
                    </div>
                    <Button variant="outline" className="w-full border-2 border-white/20 text-white hover:bg-white/10 rounded-full font-bold">
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
