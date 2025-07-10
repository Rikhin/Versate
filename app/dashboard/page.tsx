"use client"

import { useMemo, Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { useRequireProfile } from "@/hooks/use-require-profile"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { DashboardCard } from "@/components/dashboard/dashboard-card"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  Trophy, 
  Users, 
  Target, 
  ArrowRight, 
  FolderOpen, 
  UserCheck,
  Calendar,
  Code,
  MessageSquare,
  MapPin
} from "lucide-react"
import Link from "next/link"

function ErrorFallback({ error, resetErrorBoundary }: { error: unknown; resetErrorBoundary: () => void }) {
  return (
    <div role="alert" className="p-6 bg-red-50 rounded-lg">
      <h2 className="text-lg font-semibold text-red-800">Something went wrong</h2>
      <pre className="text-red-700">{error instanceof Error ? error.message : String(error)}</pre>
      <Button 
        onClick={resetErrorBoundary}
        className="mt-4 bg-red-600 hover:bg-red-700"
      >
        Try again
      </Button>
    </div>
  )
}

export default function DashboardPage() {
  const { loading, profile } = useRequireProfile()

  const stats = [
    {
      title: "Total Projects",
      value: "12",
      icon: FolderOpen,
      trend: { value: "+12%", type: "increase" as const }
    },
    {
      title: "Team Members",
      value: "8",
      icon: Users,
      trend: { value: "+2", type: "increase" as const }
    },
    {
      title: "Tasks Completed",
      value: "42",
      icon: Target,
      trend: { value: "+5", type: "increase" as const }
    },
    {
      title: "Connections",
      value: "24",
      icon: UserCheck,
      trend: { value: "+3", type: "increase" as const }
    }
  ]

  const quickActions = [
    {
      title: "New Project",
      description: "Start a new project",
      icon: FolderOpen,
      href: "/projects/new"
    },
    {
      title: "Find Team",
      description: "Connect with others",
      icon: Users,
      href: "/connect"
    },
    {
      title: "Competitions",
      description: "Browse opportunities",
      icon: Trophy,
      href: "/competitions"
    },
    {
      title: "Messages",
      description: "Check your inbox",
      icon: MessageSquare,
      href: "/messages"
    }
  ]

  const profileCompletion = useMemo(() => {
    if (!profile) return 0;
    
    const profileFields = [
      profile.full_name,
      profile.bio,
      profile.location,
      profile.interests,
      profile.skills,
      profile.experience_level,
      profile.availability,
      profile.preferred_collaboration
    ];
    
    const filledFields = profileFields.filter(field => {
      if (Array.isArray(field)) return field.length > 0;
      return Boolean(field);
    }).length;
    
    return Math.min(100, Math.round((filledFields / profileFields.length) * 100));
  }, [profile]);

  if (loading || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
    >
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-pulse flex flex-col items-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      }>
        <DashboardLayout>
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, <span className="text-helix-gradient-start">{profile.full_name?.split(' ')[0] || 'User'}</span>!
            </h1>
            <p className="text-gray-500 dark:text-gray-400">Here&apos;s what&apos;s happening with your account today.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <StatsCard
                key={index}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                trend={stat.trend}
              />
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
              <Link href="/explore" className="text-sm font-medium text-helix-gradient-start hover:underline">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href} className="group">
                  <div className="h-full p-6 rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-200 group-hover:shadow-md bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg mb-4 bg-helix-gradient-start/10 dark:bg-helix-gradient-start/20">
                      <action.icon className="h-6 w-6 text-helix-gradient-start" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{action.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{action.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <DashboardCard 
                title="Recent Activity"
                description="Your latest actions and updates"
                headerAction={
                  <Link href="/activity" className="text-sm font-medium text-helix-gradient-start hover:underline">
                    View all
                  </Link>
                }
              >
                <div className="space-y-4">
                  {[1, 2, 3].map((_, index) => (
                    <div key={index} className="flex items-start p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <div className="flex-shrink-0 p-2 rounded-lg bg-helix-gradient-start/10 dark:bg-helix-gradient-start/20 mr-4">
                        <MessageSquare className="h-5 w-5 text-helix-gradient-start" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          New message from Team Alpha
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          &quot;Let&apos;s discuss the project requirements tomorrow at 2 PM&quot;
                        </p>
                        <p className="text-xs text-gray-400 mt-2">2 hours ago</p>
                      </div>
                    </div>
                  ))}
                  <div className="text-center py-4">
                    <Button variant="ghost" size="sm" className="text-helix-gradient-start">
                      View all activity
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </DashboardCard>
            </div>

            {/* Profile Overview */}
            <div className="space-y-6">
              <DashboardCard title="Profile Overview">
                <div className="flex flex-col items-center">
                  <Avatar className="h-20 w-20 mb-4">
                    <AvatarImage src="" alt={profile.full_name || 'User'} />
                    <AvatarFallback className="bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end text-white text-xl">
                      {profile.full_name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{profile.full_name || 'User'}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {profile.location || 'Location not set'}
                  </p>
                  
                  <div className="w-full mt-6 space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-500 dark:text-gray-400">Profile Completion</span>
                        <span className="font-medium">{profileCompletion}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end h-2 rounded-full" 
                          style={{ width: `${profileCompletion}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-4 justify-center">
                      {(profile.interests || []).slice(0, 5).map((interest: string, index: number) => (
                        <Badge 
                          key={index} 
                          variant="secondary" 
                          className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                          {interest}
                        </Badge>
                      ))}
                    </div>
                    
                    <Button variant="outline" className="w-full mt-4">
                      Edit Profile
                    </Button>
                  </div>
                </div>
              </DashboardCard>
              
              <DashboardCard title="Upcoming">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 p-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mr-3">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Team Meeting</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Tomorrow, 2:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mr-3">
                      <Code className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Project Deadline</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">In 3 days</p>
                    </div>
                  </div>
                </div>
              </DashboardCard>
            </div>
          </div>
        </DashboardLayout>
      </Suspense>
    </ErrorBoundary>
  )
}
