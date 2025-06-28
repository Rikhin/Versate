import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Users, MessageSquare, Target, Star, ArrowRight, Code, Award, Zap } from "lucide-react"
import Link from "next/link"
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs"

export default function LandingPage() {
  const { isSignedIn } = useUser()

  const featuredProjects = [
    {
      title: "AI-Powered Study Assistant",
      competition: "Congressional App Challenge",
      category: "Computer Science",
      teamSize: 3,
      maxTeamSize: 5,
      techStack: ["React", "Python", "AI"],
      leader: {
        name: "Sarah Chen",
        avatar: "/placeholder-user.jpg",
        school: "Stanford University",
      },
      matchScore: 94,
    },
    {
      title: "Sustainable Energy Monitor",
      competition: "Regeneron ISEF",
      category: "STEM",
      teamSize: 2,
      maxTeamSize: 4,
      techStack: ["Arduino", "IoT", "Data Science"],
      leader: {
        name: "Alex Rivera",
        avatar: "/placeholder-user.jpg",
        school: "MIT",
      },
      matchScore: 89,
    },
    {
      title: "Mental Health Chatbot",
      competition: "Technovation Girls",
      category: "Innovation",
      teamSize: 4,
      maxTeamSize: 6,
      techStack: ["Flutter", "NLP", "Psychology"],
      leader: {
        name: "Priya Sharma",
        avatar: "/placeholder-user.jpg",
        school: "Harvard University",
      },
      matchScore: 91,
    },
  ]

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

  const stats = [
    { label: "Active Projects", value: "500+", icon: Trophy },
    { label: "Students Connected", value: "2,000+", icon: Users },
    { label: "Successful Teams", value: "150+", icon: Award },
    { label: "Competitions Supported", value: "25+", icon: Target },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Trophy className="h-8 w-8 text-slate-600" />
            <div>
              <span className="text-2xl font-bold text-slate-800">ColabBoard</span>
              <p className="text-xs text-slate-500 -mt-1">built by Rikhin Kavuru</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-slate-600 hover:text-slate-800">
              Features
            </a>
            <a href="#competitions" className="text-slate-600 hover:text-slate-800">
              Competitions
            </a>
            <a href="#projects" className="text-slate-600 hover:text-slate-800">
              Projects
            </a>
          </nav>
          <div className="flex items-center space-x-4">
            {isSignedIn ? (
              <>
                <Link href="/dashboard">
                  <Button>Dashboard</Button>
                </Link>
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <>
                <SignInButton mode="modal">
                  <Button variant="outline">Sign In</Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button>Sign Up</Button>
                </SignUpButton>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-800 mb-6">
            Find Your Perfect
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {" "}
              Competition Team
            </span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Connect with talented students, join exciting projects, and compete in prestigious academic competitions.
            Build your portfolio while making lasting connections.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isSignedIn ? (
              <Link href="/dashboard">
                <Button size="lg" className="text-lg px-8 py-3">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <>
                <SignUpButton mode="modal">
                  <Button size="lg" className="text-lg px-8 py-3">
                    Start Building Teams
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </SignUpButton>
                <Link href="/explore">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-3 bg-transparent">
                    Explore Projects
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">
                <stat.icon className="h-12 w-12 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-slate-800 mb-2">{stat.value}</div>
              <div className="text-slate-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Everything You Need to Succeed</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Our platform provides all the tools and connections you need to excel in academic competitions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Smart Team Matching</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Our AI-powered algorithm matches you with teammates based on skills, interests, and competition goals.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Real-time Collaboration</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Built-in chat, file sharing, and project management tools to keep your team organized and productive.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Trophy className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Competition Support</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Access resources, deadlines, and guidelines for 25+ prestigious academic competitions.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Code className="h-6 w-6 text-yellow-600" />
                </div>
                <CardTitle>Skill Development</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Learn from peers, share knowledge, and develop technical and soft skills through collaborative projects.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Target className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle>Project Management</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Track progress, set milestones, and manage deadlines with integrated project management tools.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Star className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle>Portfolio Building</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Showcase your projects, achievements, and skills to build an impressive academic and professional
                portfolio.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured Projects */}
      <section id="projects" className="container mx-auto px-4 py-16 bg-white/50">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Featured Projects</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Discover exciting projects looking for talented team members
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProjects.map((project, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary">{project.competition}</Badge>
                  <div className="flex items-center space-x-1">
                    <Zap className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-600">{project.matchScore}% match</span>
                  </div>
                </div>
                <CardTitle className="text-lg">{project.title}</CardTitle>
                <CardDescription>
                  Looking for talented teammates to join this {project.category} project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={project.leader.avatar || "/placeholder.svg"} alt={project.leader.name} />
                    <AvatarFallback>{project.leader.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{project.leader.name}</p>
                    <p className="text-xs text-slate-500">{project.leader.school}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-slate-600">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>
                      {project.teamSize}/{project.maxTeamSize} members
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-slate-600 mb-2">Tech Stack:</p>
                  <div className="flex flex-wrap gap-1">
                    {project.techStack.map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button className="w-full">
                  <Target className="h-4 w-4 mr-2" />
                  Apply to Join
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/explore">
            <Button size="lg" variant="outline">
              View All Projects
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Competitions Section */}
      <section id="competitions" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Supported Competitions</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            We support teams participating in prestigious academic competitions worldwide
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {competitions.map((competition, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <Trophy className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-800">{competition}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Build Your Dream Team?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of students who are already collaborating on amazing projects and winning competitions
              together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/explore">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-slate-800 bg-transparent"
                >
                  Explore Projects
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Trophy className="h-6 w-6 text-slate-600" />
              <div>
                <span className="text-lg font-bold text-slate-800">ColabBoard</span>
                <p className="text-xs text-slate-500 -mt-1">built by Rikhin Kavuru</p>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-sm text-slate-600">
              <a href="#" className="hover:text-slate-800">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-slate-800">
                Terms of Service
              </a>
              <a href="#" className="hover:text-slate-800">
                Contact
              </a>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-slate-500">
            <p>&copy; 2024 ColabBoard. All rights reserved. Empowering students to achieve excellence together.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
