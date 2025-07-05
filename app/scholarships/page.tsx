"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { loadAllScholarships, Scholarship } from "@/lib/csv-loader"
import { BackgroundGradient, FloatingShapes } from "@/components/scroll-animations"
import { Badge } from "@/components/ui/badge"
import { MapPin, DollarSign, GraduationCap, Search } from "lucide-react"
import OnboardingScrollEnforcer from "@/components/onboarding/OnboardingScrollEnforcer"

const filterBoxClass = "h-10 md:h-11 text-sm md:text-base font-normal border border-gray-300 focus:border-blue-500 focus:bg-blue-50/30 hover:bg-gray-50 rounded-lg px-3 transition-colors duration-150 min-w-[120px] md:min-w-[160px] bg-white appearance-none"

export default function ScholarshipsPage() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([])
  const [search, setSearch] = useState("")
  const [filterDegree, setFilterDegree] = useState("")
  const [filterLocation, setFilterLocation] = useState("")
  const [filterCost, setFilterCost] = useState("")

  useEffect(() => {
    loadAllScholarships().then(setScholarships)
  }, [])

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
      <div className="min-h-screen bg-white relative overflow-hidden">
        <BackgroundGradient startColor="from-gray-50/50" endColor="to-gray-100/50" triggerStart="top center" triggerEnd="center center" />
        <FloatingShapes count={3} triggerStart="top center" triggerEnd="bottom center" />
        <div className="relative z-10">
          {/* Header */}
          <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="container mx-auto px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <GraduationCap className="h-8 w-8 text-black" />
                  <div>
                    <span className="text-2xl font-black text-black">Versate</span>
                    <p className="text-sm text-gray-600">Scholarships & Grants</p>
                  </div>
                </div>
                <Button asChild variant="outline" className="border-2 border-black text-black hover:bg-black hover:text-white">
                  <a href="/dashboard">Back to Dashboard</a>
                </Button>
              </div>
            </div>
          </header>
          <div className="h-8 md:h-12" />

          {/* Title section */}
          <section className="text-center mb-8 md:mb-16">
            <h1 className="text-3xl md:text-6xl md:text-7xl font-black text-black mb-4 md:mb-8 leading-none">
              Explore<br /><span className="text-gray-400">Scholarships & Grants</span>
            </h1>
            <p className="text-base md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Browse and discover scholarships and grants for students around the world. Use the filters to find the right fit for your degree, location, and funding needs.
            </p>
          </section>

          {/* Filters & Search */}
          <section className="container mx-auto px-8 py-8">
            <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-4 md:gap-6 mb-6 items-center justify-center">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search scholarships..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 border-2 border-gray-300 focus:border-blue-500 h-10 md:h-11"
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
              <Button variant="outline" onClick={clearFilters} className="h-10 md:h-11">Clear</Button>
            </div>
          </section>

          {/* Scholarship Cards */}
          <section className="container mx-auto px-8 pb-16">
            {filtered.length === 0 ? (
              <div className="text-center text-gray-500 py-20">No scholarships found.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {filtered.map((scholarship, idx) => (
                  <Card key={idx} className="border-2 border-blue-200 shadow-lg hover:shadow-blue-300/40 hover:border-blue-400 ring-1 ring-blue-100/40 transition hover:scale-105 cursor-pointer bg-white">
                    <CardHeader>
                      <CardTitle className="text-lg font-bold line-clamp-2">{scholarship.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {scholarship.degrees && <Badge variant="secondary"><GraduationCap className="h-4 w-4 mr-1 inline" />{scholarship.degrees}</Badge>}
                        {scholarship.funds && <Badge variant="secondary"><DollarSign className="h-4 w-4 mr-1 inline" />{scholarship.funds}</Badge>}
                        {scholarship.location && <Badge variant="secondary"><MapPin className="h-4 w-4 mr-1 inline" />{scholarship.location.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</Badge>}
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