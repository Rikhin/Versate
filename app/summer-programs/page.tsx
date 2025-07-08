"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { loadAllSummerPrograms, SummerProgram } from "@/lib/csv-loader"
import Link from "next/link"
import { BackgroundGradient, FloatingShapes } from "@/components/scroll-animations"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Search, Calendar, DollarSign, MapPin, CheckCircle, AlertCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { SignInButton, SignUpButton, useUser, SignIn, SignUp } from "@clerk/nextjs"
import OnboardingScrollEnforcer from "@/components/onboarding/OnboardingScrollEnforcer"


const filterBoxClass = "h-12 sm:h-14 md:h-16 text-lg md:text-xl font-normal border-2 border-white/20 focus:border-helix-gradient-start focus:bg-white/10 hover:bg-white/10 rounded-full px-6 transition-colors duration-150 min-w-[140px] sm:min-w-[160px] md:min-w-[200px] bg-white/10 text-white backdrop-blur-sm appearance-none"

// Helper functions for filter grouping
function groupCost(cost: string) {
  if (!cost || cost.toLowerCase().includes('free')) return 'Free';
  const num = parseInt(cost.replace(/[^\d]/g, ''));
  if (isNaN(num)) return 'Other';
  if (num < 1000) return '<$1000';
  if (num <= 5000) return '$1000-$5000';
  return '$5000<';
}
function groupAcceptance(rate: string) {
  if (!rate) return 'Unknown';
  const num = parseFloat(rate.replace(/[^\d.]/g, ''));
  if (isNaN(num)) return 'Unknown';
  if (num < 5) return '<5%';
  if (num < 10) return '5%-10%';
  if (num < 30) return '10%-30%';
  if (num < 50) return '30%-50%';
  return '50%<';
}
function groupDeadline(deadline: string) {
  if (!deadline) return 'Unknown';
  const monthMatch = deadline.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i);
  return monthMatch ? monthMatch[0] : 'Other';
}

export default function SummerProgramsPage() {
  const { isSignedIn, isLoaded } = useUser()
  const [programs, setPrograms] = useState<SummerProgram[]>([])
  const [search, setSearch] = useState("")
  const [filterCost, setFilterCost] = useState("")
  const [filterAcceptance, setFilterAcceptance] = useState("")
  const [filterDeadline, setFilterDeadline] = useState("")
  const [filterTargeted, setFilterTargeted] = useState("")
  const [selectedProgram, setSelectedProgram] = useState<SummerProgram|null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

  // Prevent hydration mismatch by not rendering until loaded
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-helix-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-helix-gradient-start mx-auto mb-4"></div>
          <p className="text-helix-text-light">Loading...</p>
        </div>
      </div>
    )
  }

  useEffect(() => {
    loadAllSummerPrograms().then(setPrograms)
  }, [])

  useEffect(() => {
    if (isLoaded && !isSignedIn) setShowAuthModal(true)
  }, [isLoaded, isSignedIn])

  // Extract unique filter values
  const allCosts = Array.from(new Set(programs.map(p => p.cost).filter(Boolean))).sort()
  const allAcceptance = Array.from(new Set(programs.map(p => p.acceptanceRate).filter(Boolean))).sort()
  const allDeadlineMonths = Array.from(new Set(programs.map(p => groupDeadline(p.applicationDeadline)).filter(Boolean))).sort((a, b) => {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return months.indexOf(a) - months.indexOf(b);
  });
  const allTargeted = Array.from(new Set(programs.map(p => p.targeted).filter(Boolean))).sort()

  // Grouped filter options for cost and acceptance
  const costGroups = ["Free", "<$1000", "$1000-$5000", "$5000<"];
  const acceptanceGroups = ["<5%", "5%-10%", "10%-30%", "30%-50%", "50%<"];

  // Filtering logic
  const filtered = programs.filter(p => {
    const s = search.toLowerCase()
    const costGroup = groupCost(p.cost)
    const acceptanceGroup = groupAcceptance(p.acceptanceRate)
    const deadlineGroup = groupDeadline(p.applicationDeadline)
    return (
      (!s || p.title.toLowerCase().includes(s) || p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s)) &&
      (!filterCost || costGroup === filterCost) &&
      (!filterAcceptance || acceptanceGroup === filterAcceptance) &&
      (!filterDeadline || deadlineGroup === filterDeadline) &&
      (!filterTargeted || p.targeted === filterTargeted)
    )
  })

  const clearFilters = () => {
    setSearch("");
    setFilterCost("");
    setFilterAcceptance("");
    setFilterDeadline("");
    setFilterTargeted("");
  }

  return (
    <OnboardingScrollEnforcer>
        {showAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn">
            <div className="glass border border-white/10 rounded-[24px] shadow-2xl p-8 max-w-sm w-full flex flex-col items-center gap-6 animate-fadeInUp">
              <h2 className="text-2xl font-bold text-white mb-2">Sign in or Sign up</h2>
              <p className="text-helix-text-light text-center mb-4">Sign in or create an account to access Summer Programs and start exploring opportunities.</p>
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
                Explore<br /><span className="gradient-text-helix">Summer Programs</span>
              </h1>
              <p className="text-xl md:text-2xl text-helix-text-light max-w-4xl mx-auto leading-relaxed">
                Browse and discover top summer programs for high school students. Use the filters to find the right fit for your goals, interests, and background.
              </p>
            </section>

            {/* Filters & Search */}
            <section className="py-12">
              <div className="w-full flex flex-col md:flex-row gap-4 md:gap-6 mb-8 items-center justify-center">
                <Input
                  type="text"
                  placeholder="Search summer programs..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full md:w-80 border-2 border-white/20 focus:border-helix-gradient-start h-12 sm:h-14 md:h-16 bg-white/10 text-white placeholder-helix-text-light backdrop-blur-sm rounded-full text-lg md:text-xl"
                />
                <select className={filterBoxClass} value={filterCost} onChange={e => setFilterCost(e.target.value)}>
                  <option value="">Cost</option>
                  {costGroups.map((c, i) => <option key={i} value={c}>{c}</option>)}
                </select>
                <select className={filterBoxClass} value={filterAcceptance} onChange={e => setFilterAcceptance(e.target.value)}>
                  <option value="">Acceptance Rate</option>
                  {acceptanceGroups.map((a, i) => <option key={i} value={a}>{a}</option>)}
                </select>
                <select className={filterBoxClass} value={filterDeadline} onChange={e => setFilterDeadline(e.target.value)}>
                  <option value="">Deadline Month</option>
                  {allDeadlineMonths.map((m, i) => <option key={i} value={m}>{m}</option>)}
                </select>
                <select className={filterBoxClass} value={filterTargeted} onChange={e => setFilterTargeted(e.target.value)}>
                  <option value="">Low-Income/First-Gen Focused</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                  <option value="Unknown">Unknown</option>
                </select>
                <Button variant="outline" onClick={clearFilters} className="h-12 sm:h-14 md:h-16 border-2 border-white/20 text-white hover:bg-white/10 rounded-full font-bold text-lg">Clear</Button>
              </div>
            </section>

            {/* Program Cards */}
            <section className="pb-20">
              {filtered.length === 0 ? (
                <div className="text-center text-helix-text-light py-20">
                  <div className="text-3xl md:text-5xl font-black mb-4">No summer programs found.</div>
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
                  {filtered.map((program, idx) => (
                    <Card key={idx} className="glass border border-white/10 shadow-xl hover:shadow-2xl hover:glow transition-all duration-300 cursor-pointer" onClick={() => { setSelectedProgram(program); setIsModalOpen(true); }}>
                      <CardHeader className="pb-6">
                        <CardTitle className="text-lg font-bold line-clamp-2 text-white">{program.title || program.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm text-helix-text-light line-clamp-3 mb-4">{program.description}</div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {program.cost && <Badge variant="outline" className="border-2 border-white/20 text-helix-text-light"><DollarSign className="h-4 w-4 mr-1 inline" />{program.cost}</Badge>}
                          {program.acceptanceRate && <Badge variant="outline" className="border-2 border-white/20 text-helix-text-light">Acceptance: {program.acceptanceRate}</Badge>}
                          {program.applicationDeadline && <Badge variant="outline" className="border-2 border-white/20 text-helix-text-light"><Calendar className="h-4 w-4 mr-1 inline" />{program.applicationDeadline}</Badge>}
                          {program.targeted && <Badge variant="outline" className="border-2 border-white/20 text-helix-text-light">Targeted: {program.targeted}</Badge>}
                        </div>
                        {program.sessions && <div className="text-xs text-helix-text-light mb-2">{program.sessions}</div>}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>

            {/* Modal for expanded program details */}
            <Dialog open={isModalOpen} onOpenChange={() => setIsModalOpen(false)}>
              <DialogContent className="glass border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {selectedProgram && (
                  <>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-white text-2xl font-bold">
                        {selectedProgram.title || selectedProgram.name}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 mt-4">
                      <div className="text-lg text-helix-text-light whitespace-pre-line">{selectedProgram.description}</div>
                      <div className="flex flex-wrap gap-3">
                        {selectedProgram.cost && <Badge variant="outline" className="border-2 border-white/20 text-helix-text-light"><DollarSign className="h-4 w-4 mr-1 inline" />{selectedProgram.cost}</Badge>}
                        {selectedProgram.acceptanceRate && <Badge variant="outline" className="border-2 border-white/20 text-helix-text-light">Acceptance: {selectedProgram.acceptanceRate}</Badge>}
                        {selectedProgram.applicationDeadline && <Badge variant="outline" className="border-2 border-white/20 text-helix-text-light"><Calendar className="h-4 w-4 mr-1 inline" />{selectedProgram.applicationDeadline}</Badge>}
                        {selectedProgram.targeted && <Badge variant="outline" className="border-2 border-white/20 text-helix-text-light">Targeted: {selectedProgram.targeted}</Badge>}
                      </div>
                      {selectedProgram.sessions && <div className="text-base text-helix-text-light">Sessions: {selectedProgram.sessions}</div>}
                      {selectedProgram.officialUrl && (
                        <Button variant="outline" onClick={() => window.open(selectedProgram.officialUrl, "_blank")} className="flex items-center gap-3 mt-4 border-2 border-white/20 text-white hover:bg-white/10 rounded-full font-bold">
                          <ExternalLink className="h-5 w-5" />
                          Visit Official Website
                        </Button>
                      )}
                    </div>
                  </>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
    </OnboardingScrollEnforcer>
  )
} 