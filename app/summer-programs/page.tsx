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

const filterBoxClass = "h-10 md:h-11 text-sm md:text-base font-normal border border-gray-300 focus:border-blue-500 focus:bg-blue-50/30 hover:bg-gray-50 rounded-lg px-3 transition-colors duration-150 min-w-[120px] md:min-w-[160px] bg-white appearance-none"

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
  const [programs, setPrograms] = useState<SummerProgram[]>([])
  const [search, setSearch] = useState("")
  const [filterCost, setFilterCost] = useState("")
  const [filterAcceptance, setFilterAcceptance] = useState("")
  const [filterDeadline, setFilterDeadline] = useState("")
  const [filterTargeted, setFilterTargeted] = useState("")
  const [selectedProgram, setSelectedProgram] = useState<SummerProgram|null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    loadAllSummerPrograms().then(setPrograms)
  }, [])

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
    <div className="min-h-screen bg-white relative overflow-hidden">
      <BackgroundGradient startColor="from-gray-50/50" endColor="to-gray-100/50" triggerStart="top center" triggerEnd="center center" />
      <FloatingShapes count={3} triggerStart="top center" triggerEnd="bottom center" />
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Calendar className="h-8 w-8 text-black" />
                <div>
                  <span className="text-2xl font-black text-black">Versa</span>
                  <p className="text-sm text-gray-600">Summer Programs</p>
                </div>
              </div>
              <Link href="/dashboard">
                <Button variant="outline" className="border-2 border-black text-black hover:bg-black hover:text-white">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </header>
        <div className="h-8 md:h-12" />

        {/* Title section */}
        <section className="text-center mb-8 md:mb-16">
          <h1 className="text-3xl md:text-6xl md:text-7xl font-black text-black mb-4 md:mb-8 leading-none">
            Explore<br /><span className="text-gray-400">Summer Programs</span>
          </h1>
          <p className="text-base md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Browse and discover top summer programs for high school students. Use the filters to find the right fit for your goals, interests, and background.
          </p>
        </section>

        {/* Filters & Search */}
        <section className="container mx-auto px-8 py-8">
          <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-4 md:gap-6 mb-6 items-center justify-center">
            <Input
              type="text"
              placeholder="Search summer programs..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full md:w-80 border-2 border-gray-300 focus:border-blue-500 h-10 md:h-11"
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
            <Button variant="outline" onClick={clearFilters} className="h-10 md:h-11">Clear</Button>
          </div>
        </section>

        {/* Program Cards */}
        <section className="container mx-auto px-8 pb-16">
          {filtered.length === 0 ? (
            <div className="text-center text-gray-500 py-20">No summer programs found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {filtered.map((program, idx) => (
                <Card key={idx} className="border-2 border-red-200 shadow-lg hover:shadow-red-300/40 hover:border-red-400 ring-1 ring-red-100/40 transition hover:scale-105 cursor-pointer bg-white" onClick={() => { setSelectedProgram(program); setIsModalOpen(true); }}>
                  <CardHeader>
                    <CardTitle className="text-lg font-bold line-clamp-2">{program.title || program.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-700 line-clamp-3 mb-2">{program.description}</div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {program.cost && <Badge variant="secondary"><DollarSign className="h-4 w-4 mr-1 inline" />{program.cost}</Badge>}
                      {program.acceptanceRate && <Badge variant="secondary">Acceptance: {program.acceptanceRate}</Badge>}
                      {program.applicationDeadline && <Badge variant="secondary"><Calendar className="h-4 w-4 mr-1 inline" />{program.applicationDeadline}</Badge>}
                      {program.targeted && <Badge variant="secondary">Targeted: {program.targeted}</Badge>}
                    </div>
                    {program.sessions && <div className="text-xs text-gray-500 mb-1">{program.sessions}</div>}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Modal for expanded program details */}
        <Dialog open={isModalOpen} onOpenChange={() => setIsModalOpen(false)}>
          <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {selectedProgram && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    {selectedProgram.title || selectedProgram.name}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-2">
                  <div className="text-base text-gray-800 whitespace-pre-line">{selectedProgram.description}</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedProgram.cost && <Badge variant="secondary"><DollarSign className="h-4 w-4 mr-1 inline" />{selectedProgram.cost}</Badge>}
                    {selectedProgram.acceptanceRate && <Badge variant="secondary">Acceptance: {selectedProgram.acceptanceRate}</Badge>}
                    {selectedProgram.applicationDeadline && <Badge variant="secondary"><Calendar className="h-4 w-4 mr-1 inline" />{selectedProgram.applicationDeadline}</Badge>}
                    {selectedProgram.targeted && <Badge variant="secondary">Targeted: {selectedProgram.targeted}</Badge>}
                  </div>
                  {selectedProgram.sessions && <div className="text-sm text-gray-600">Sessions: {selectedProgram.sessions}</div>}
                  {selectedProgram.officialUrl && (
                    <Button variant="outline" onClick={() => window.open(selectedProgram.officialUrl, "_blank")} className="flex items-center gap-2 mt-2">
                      <ExternalLink className="h-4 w-4" />
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
  )
} 