import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  Users,
  Target,
  MessageCircle,
  Trophy,
  Lightbulb,
  Search,
  Code,
  Briefcase,
  FlaskConical,
} from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  const competitionCategories = [
    {
      title: "STEM Competitions",
      description: "Science fairs, research competitions, and STEM challenges",
      icon: FlaskConical,
      color: "bg-blue-50 text-blue-600",
      examples: ["Science Fair", "Research Competition", "Engineering Challenge"],
    },
    {
      title: "Computer Science",
      description: "Hackathons, coding competitions, and tech challenges",
      icon: Code,
      color: "bg-green-50 text-green-600",
      examples: ["Hackathon", "Coding Contest", "App Development"],
    },
    {
      title: "Business & Entrepreneurship",
      description: "Business plan competitions and startup challenges",
      icon: Briefcase,
      color: "bg-purple-50 text-purple-600",
      examples: ["Business Plan", "Startup Pitch", "Case Competition"],
    },
    {
      title: "Innovation & Design",
      description: "Design thinking, innovation challenges, and creative contests",
      icon: Lightbulb,
      color: "bg-orange-50 text-orange-600",
      examples: ["Design Challenge", "Innovation Contest", "Creative Competition"],
    },
  ]

  const features = [
    {
      title: "Smart Discovery",
      description: "Find competitions that match your interests and skills",
      icon: Search,
    },
    {
      title: "Team Matching",
      description: "Get matched with compatible teammates based on skills and goals",
      icon: Users,
    },
    {
      title: "Real-time Collaboration",
      description: "Chat, share files, and coordinate with your team seamlessly",
      icon: MessageCircle,
    },
    {
      title: "Competition Tracking",
      description: "Keep track of deadlines, requirements, and progress",
      icon: Target,
    },
    {
      title: "Skill Development",
      description: "Learn from teammates and grow your competition skills",
      icon: Trophy,
    },
    {
      title: "Mentor Network",
      description: "Connect with experienced mentors and past winners",
      icon: Lightbulb,
    },
  ]

  const steps = [
    {
      step: "1",
      title: "Create Your Profile",
      description: "Tell us about your skills, interests, and competition goals",
    },
    {
      step: "2",
      title: "Discover & Match",
      description: "Find competitions and get matched with compatible teammates",
    },
    {
      step: "3",
      title: "Collaborate & Win",
      description: "Work together with your team to create winning submissions",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Trophy className="h-8 w-8 text-slate-600" />
            <span className="text-2xl font-bold text-slate-800">ColabBoard</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/sign-in">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="gradient-text">Win competitions</span>
            <br />
            <span className="text-slate-800">together</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Connect with talented students, form winning teams, and dominate academic competitions. From hackathons to
            science fairs, find your perfect teammates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up">
              <Button size="lg" className="text-lg px-8 py-3">
                Start Building Teams
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/explore">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 bg-transparent">
                Explore Competitions
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Competition Categories */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-800">Competition Categories</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {competitionCategories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center mb-4`}>
                    <category.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {category.examples.map((example, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {example}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-800">Everything you need to win</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-slate-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-800">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-800">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-slate-800 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-800">{step.title}</h3>
                <p className="text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-slate-800 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to win your next competition?</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already forming winning teams on ColabBoard.
          </p>
          <Link href="/sign-up">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-slate-900 text-slate-400">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Trophy className="h-6 w-6" />
            <span className="text-xl font-bold text-white">ColabBoard</span>
          </div>
          <p>&copy; 2024 ColabBoard. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
