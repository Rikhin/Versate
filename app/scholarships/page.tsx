"use client";
import { useEffect, useState, useMemo } from "react";
import { loadAllScholarships, Scholarship } from "@/lib/csv-loader";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BackgroundGradient } from "@/components/scroll-animations/background-gradient";
import { FloatingShapes } from "@/components/scroll-animations/floating-shapes";

const fundGroups = [
  { label: "Full", test: (f: string) => /full/i.test(f) },
  { label: "Partial", test: (f: string) => /partial/i.test(f) },
  { label: "Small", test: (f: string) => /\$?\d{1,4}/.test(f) },
  { label: "Unknown", test: (f: string) => !f || f === "N/A" },
];

function groupFund(fund: string) {
  for (const group of fundGroups) {
    if (group.test(fund)) return group.label;
  }
  return "Other";
}

export default function ScholarshipsPage() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [degree, setDegree] = useState("");
  const [fund, setFund] = useState("");

  useEffect(() => {
    loadAllScholarships().then(setScholarships);
  }, []);

  // Smart filter options
  const locations = useMemo(() => Array.from(new Set(scholarships.map(s => s.location).filter(Boolean))), [scholarships]);
  const degrees = useMemo(() => Array.from(new Set(scholarships.map(s => s.degrees).filter(Boolean))), [scholarships]);
  const fundOptions = ["", ...fundGroups.map(g => g.label), "Other"];

  const filtered = scholarships.filter((s) => {
    const fundGroup = groupFund(s.funds);
    return (
      (!search || s.title.toLowerCase().includes(search.toLowerCase())) &&
      (!location || s.location === location) &&
      (!degree || s.degrees === degree) &&
      (!fund || fundGroup === fund)
    );
  });

  return (
    <div className="min-h-screen bg-helix-dark relative overflow-hidden">
      <BackgroundGradient startColor="from-helix-blue/20" endColor="to-helix-dark-blue/20" triggerStart="top center" triggerEnd="center center" />
      <FloatingShapes count={3} triggerStart="top center" triggerEnd="bottom center" />
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <section className="py-20 md:py-32 pt-24">
          <div className="text-center mb-16 md:mb-20">
            <div className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight">
              Find Your <span className="gradient-text-helix">Scholarship</span>
            </div>
            <p className="text-xl md:text-2xl text-helix-text-light max-w-4xl mx-auto leading-relaxed">
              Discover scholarships for students around the world. Use the filters to find the right fit for your goals, interests, and background.
            </p>
          </div>
          <div className="mb-12 md:mb-16 space-y-6">
            <div className="flex flex-col md:flex-row gap-4 w-full">
              <Input
                placeholder="Search scholarships..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-6 h-12 sm:h-14 md:h-16 text-lg md:text-xl border-2 border-white/20 focus:border-helix-gradient-start outline-none w-full bg-white/10 text-white placeholder-helix-text-light backdrop-blur-sm rounded-full"
              />
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="h-12 sm:h-14 md:h-16 text-lg md:text-xl border-2 border-white/20 focus:border-helix-gradient-start min-w-[140px] sm:min-w-[160px] md:min-w-[220px] w-full sm:w-auto bg-white/10 text-white backdrop-blur-sm rounded-full">
                  <SelectValue placeholder="Location..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Locations</SelectItem>
                  {locations.map(loc => <SelectItem key={loc} value={loc}>{loc}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={degree} onValueChange={setDegree}>
                <SelectTrigger className="h-12 sm:h-14 md:h-16 text-lg md:text-xl border-2 border-white/20 focus:border-helix-gradient-start min-w-[140px] sm:min-w-[160px] md:min-w-[220px] w-full sm:w-auto bg-white/10 text-white backdrop-blur-sm rounded-full">
                  <SelectValue placeholder="Degree..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Degrees</SelectItem>
                  {degrees.map(deg => <SelectItem key={deg} value={deg}>{deg}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={fund} onValueChange={setFund}>
                <SelectTrigger className="h-12 sm:h-14 md:h-16 text-lg md:text-xl border-2 border-white/20 focus:border-helix-gradient-start min-w-[140px] sm:min-w-[160px] md:min-w-[220px] w-full sm:w-auto bg-white/10 text-white backdrop-blur-sm rounded-full">
                  <SelectValue placeholder="Funds..." />
                </SelectTrigger>
                <SelectContent>
                  {fundOptions.map(f => <SelectItem key={f} value={f}>{f || "All Funds"}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filtered.length === 0 && (
              <div className="col-span-full text-center text-white/70 py-12">No scholarships found.</div>
            )}
            {filtered.map((s, i) => (
              <Card key={i} className="glass border border-white/10 shadow-xl hover:shadow-2xl hover:glow transition-all duration-300 cursor-pointer">
                <CardHeader className="pb-8">
                  <CardTitle className="text-xl font-bold text-white mb-1">{s.title}</CardTitle>
                  <div className="text-white/80 text-sm mb-2">{s.location} {s.degrees && <>| {s.degrees}</>}</div>
                  <div className="text-white/70 text-sm mb-2">Funds: {s.funds}</div>
                </CardHeader>
                <CardContent>
                  {/* Remove or fallback for description if not present */}
                  {/* <div className="text-white/70 text-xs mb-2">{s.description}</div> */}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
} 