import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Users, MessageCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Trophy className="h-8 w-8 text-slate-600" />
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-slate-800">ColabBoard</span>
              <span className="text-xs text-slate-500">built by Rikhin Kavuru</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-slate-800 mb-6">
            Find Your Perfect <span className="text-blue-600">Competition Team</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Connect with talented students, form winning teams, and dominate academic competitions together. Your next
            victory starts here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="text-lg px-8 py-3">
                Start Building Teams
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/explore">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 bg-transparent">
                Explore Projects
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Why Choose ColabBoard?</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Built specifically for student competitors, with features designed to help you find the right teammates and
            win together.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Smart Matching</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Our algorithm matches you with teammates based on skills, interests, and competition goals for optimal
                team chemistry.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <MessageCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Team Communication</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Built-in chat and collaboration tools keep your team connected and organized throughout the competition
                process.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Trophy className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
              <CardTitle>Competition Focus</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Designed specifically for academic competitions with features tailored to help teams succeed and win
                together.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-slate-800 mb-2">500+</div>
              <div className="text-slate-600">Active Students</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-800 mb-2">150+</div>
              <div className="text-slate-600">Teams Formed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-800 mb-2">50+</div>
              <div className="text-slate-600">Competitions Won</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-800 mb-2">25+</div>
              <div className="text-slate-600">Universities</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">How It Works</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Getting started is simple. Follow these steps to find your perfect competition team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Create Your Profile</h3>
            <p className="text-slate-600">
              Tell us about your skills, interests, and competition experience to help us find the perfect matches.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-green-600">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Find Your Team</h3>
            <p className="text-slate-600">
              Browse projects, connect with teammates, or create your own competition project to attract collaborators.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-yellow-600">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Win Together</h3>
            <p className="text-slate-600">
              Collaborate using our built-in tools, stay organized, and dominate your competition as a unified team.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Win Your Next Competition?</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Join hundreds of students who are already using ColabBoard to form winning teams and achieve their
            competition goals.
          </p>
          <Link href="/dashboard">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Trophy className="h-6 w-6 text-slate-600" />
              <div className="flex flex-col">
                <span className="text-lg font-bold text-slate-800">ColabBoard</span>
                <span className="text-xs text-slate-500">built by Rikhin Kavuru</span>
              </div>
            </div>
            <div className="flex space-x-6 text-sm text-slate-600">
              <Link href="/dashboard" className="hover:text-slate-800">
                Dashboard
              </Link>
              <Link href="/explore" className="hover:text-slate-800">
                Explore
              </Link>
              <Link href="/chat" className="hover:text-slate-800">
                Chat
              </Link>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-slate-500">
            <p>&copy; 2024 ColabBoard. Built for student competitors, by student competitors.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
