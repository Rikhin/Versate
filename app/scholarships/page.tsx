"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { loadAllScholarships, Scholarship } from "@/lib/csv-loader"
import { BackgroundGradient, FloatingShapes } from "@/components/scroll-animations"
import { Badge } from "@/components/ui/badge"
import { MapPin, DollarSign, GraduationCap, Search } from "lucide-react"

import { SignInButton, SignUpButton, useUser, SignIn, SignUp } from "@clerk/nextjs"
import Link from "next/link"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import OnboardingScrollEnforcer from "@/components/onboarding/OnboardingScrollEnforcer"

const filterBoxClass = "h-12 sm:h-14 md:h-16 text-lg md:text-xl font-normal border-2 border-white/20 focus:border-helix-gradient-start focus:bg-white/10 hover:bg-white/10 rounded-full px-6 transition-colors duration-150 min-w-[140px] sm:min-w-[160px] md:min-w-[200px] bg-white/10 text-white backdrop-blur-sm appearance-none"

export default function ScholarshipsPage() {
  const { isSignedIn, isLoaded } = useUser()
  const [scholarships, setScholarships] = useState<Scholarship[]>([])
  const [search, setSearch] = useState("")
  const [filterDegree, setFilterDegree] = useState("")
  const [filterLocation, setFilterLocation] = useState("")
  const [filterCost, setFilterCost] = useState("")
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    loadAllScholarships().then(setScholarships)
  }, [])

  useEffect(() => {
    if (isLoaded && !isSignedIn) setShowAuthModal(true)
  }, [isLoaded, isSignedIn])

  // Extract unique filter values
  const allDegrees = Array.from(new Set(scholarships.flatMap(s => s.degrees.split(",").map(d => d.trim())).filter(Boolean))).sort()
  const allLocations = Array.from(new Set(scholarships.map(s => s.location).filter(Boolean))).sort()

  // Cost filter options
  const costOptions = [
    { label: "All Costs", value: "" },
    { label: "Fully Funded", value: "fully" },
    { label: "Partially Funded", value: "partial" },
    { label: "Less than $5k", value: "under5k" },
    { label: "$5k - $10k", value: "5k-10k" },
    { label: "$10k - $25k", value: "10k-25k" },
    { label: "Over $25k", value: "over25k" },
    { label: "Variable Amount", value: "variable" },
  ]

  // Helper function to categorize funding amount
  const categorizeFunding = (funds: string): string => {
    const fundsLower = funds.toLowerCase()
    
    if (fundsLower.includes('fully funded') || fundsLower.includes('full funding') || fundsLower.includes('100%')) {
      return 'fully'
    }
    if (fundsLower.includes('partial') || fundsLower.includes('partially')) {
      return 'partial'
    }
    if (fundsLower.includes('variable') || fundsLower.includes('varies') || fundsLower.includes('up to')) {
      return 'variable'
    }
    
    // Extract numbers and categorize
    const numbers = funds.match(/\$?(\d+(?:,\d+)*(?:\.\d+)?)/g)
    if (numbers) {
      const amounts = numbers.map(n => parseFloat(n.replace(/[$,]/g, '')))
      const maxAmount = Math.max(...amounts)
      
      if (maxAmount < 5000) return 'under5k'
      if (maxAmount < 10000) return '5k-10k'
      if (maxAmount < 25000) return '10k-25k'
      return 'over25k'
    }
    
    return 'variable'
  }

  // Filtering logic
  const filtered = scholarships.filter(s => {
    const sTerm = search.toLowerCase()
    const matchesSearch =
      !sTerm ||
      s.title.toLowerCase().includes(sTerm) ||
      s.degrees.toLowerCase().includes(sTerm) ||
      s.funds.toLowerCase().includes(sTerm) ||
      s.location.toLowerCase().includes(sTerm)
    
    const matchesDegree = !filterDegree || s.degrees.split(",").map(d => d.trim()).includes(filterDegree)
    const matchesLocation = !filterLocation || s.location === filterLocation
    
    // Filter out "fully funded" and "not funded" from degree options
    const degreeOptions = s.degrees.split(",").map(d => d.trim()).filter(d => 
      !d.toLowerCase().includes('fully funded') && 
      !d.toLowerCase().includes('not funded')
    )
    const matchesDegreeFilter = !filterDegree || degreeOptions.includes(filterDegree)
    
    const matchesCost = !filterCost || categorizeFunding(s.funds) === filterCost
    
    return matchesSearch && matchesDegreeFilter && matchesLocation && matchesCost
  })

  const clearFilters = () => {
    setSearch("")
    setFilterDegree("")
    setFilterLocation("")
    setFilterCost("")
  }

  // Filter degree options to exclude funding-related terms
  const filteredDegrees = allDegrees.filter(degree => 
    !degree.toLowerCase().includes('fully funded') && 
    !degree.toLowerCase().includes('not funded')
  )

  return (
    <OnboardingScrollEnforcer>
        {showAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn">
            <div className="glass border border-white/10 rounded-[24px] shadow-2xl p-8 max-w-sm w-full flex flex-col items-center gap-6 animate-fadeInUp">
              <h2 className="text-2xl font-bold text-white mb-2">Sign in or Sign up</h2>
              <p className="text-helix-text-light text-center mb-4">Sign in or create an account to access Scholarships and start exploring opportunities.</p>
              <div className="flex w-full gap-3">
                <SignInButton mode="modal">
                  <button className="flex-1 py-3 rounded-full border border-white/20 text-white font-bold bg-white/10 hover:bg-white/20 transition">Sign In</button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="flex-1 py-3 rounded-full bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end text-white font-bold hover:shadow-xl glow transition">Sign Up</button>
                </SignUpButton>
              </div>
            </div>
          </div>
        )}
      <div className="min-h-screen bg-helix-dark relative overflow-hidden">
          <BackgroundGradient startColor="from-helix-blue/20" endColor="to-helix-dark-blue/20" triggerStart="top center" triggerEnd="center center" />
          <FloatingShapes count={3} triggerStart="top center" triggerEnd="bottom center" />
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">

            {/* Title section */}
            <section className="text-center mb-16 md:mb-20 pt-24">
              <h1 className="text-5xl md:text-7xl md:text-8xl font-black text-white mb-8 md:mb-12 leading-none">
                Explore<br /><span className="gradient-text-helix">Scholarships & Grants</span>
              </h1>
              <p className="text-xl md:text-2xl text-helix-text-light max-w-4xl mx-auto leading-relaxed">
                Browse and discover scholarships and grants for students around the world. Use the filters to find the right fit for your degree, location, and funding needs.
              </p>
            </section>

            {/* Filters & Search */}
            <section className="py-12">
              <div className="w-full flex flex-col md:flex-row gap-4 md:gap-6 mb-8 items-center justify-center">
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-helix-text-light" />
                  <Input
                    type="text"
                    placeholder="Search scholarships..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-12 border-2 border-white/20 focus:border-helix-gradient-start h-12 sm:h-14 md:h-16 bg-white/10 text-white placeholder-helix-text-light backdrop-blur-sm rounded-full text-lg md:text-xl"
                  />
                </div>
                <select className={filterBoxClass} value={filterDegree} onChange={e => setFilterDegree(e.target.value)}>
                  <option value="">Degree</option>
                  {filteredDegrees.map((d, i) => <option key={i} value={d}>{d}</option>)}
                </select>
                <select className={filterBoxClass} value={filterLocation} onChange={e => setFilterLocation(e.target.value)}>
                  <option value="">Location</option>
                  {allLocations.map((l, i) => <option key={i} value={l}>{l.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>)}
                </select>
                <select className={filterBoxClass} value={filterCost} onChange={e => setFilterCost(e.target.value)}>
                  {costOptions.map((option, i) => (
                    <option key={i} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <Button variant="outline" onClick={clearFilters} className="h-12 sm:h-14 md:h-16 border-2 border-white/20 text-white hover:bg-white/10 rounded-full font-bold text-lg">Clear</Button>
              </div>
            </section>

            {/* Scholarship Cards */}
            <section className="pb-20">
              {filtered.length === 0 ? (
                <div className="text-center text-helix-text-light py-20">
                  <div className="text-3xl md:text-5xl font-black mb-4">No scholarships found.</div>
                  <p className="text-lg md:text-xl mb-8">Try adjusting your search or filters</p>
                  <Button 
                    onClick={clearFilters}
                    className="bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end text-white hover:shadow-xl glow font-bold text-lg px-8 py-4 rounded-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                  {filtered.map((scholarship, idx) => (
                    <Card key={idx} className="glass border border-white/10 shadow-xl hover:shadow-2xl hover:glow transition-all duration-300 cursor-pointer">
                      <CardHeader className="pb-6">
                        <CardTitle className="text-lg font-bold line-clamp-2 text-white">{scholarship.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {scholarship.degrees && <Badge variant="outline" className="border-2 border-white/20 text-helix-text-light"><GraduationCap className="h-4 w-4 mr-1 inline" />{scholarship.degrees}</Badge>}
                          {scholarship.funds && <Badge variant="outline" className="border-2 border-white/20 text-helix-text-light"><DollarSign className="h-4 w-4 mr-1 inline" />{scholarship.funds}</Badge>}
                          {scholarship.location && <Badge variant="outline" className="border-2 border-white/20 text-helix-text-light"><MapPin className="h-4 w-4 mr-1 inline" />{scholarship.location.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</Badge>}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
    </OnboardingScrollEnforcer>
  )
} 