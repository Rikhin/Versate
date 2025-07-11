"use client";
import { useEffect, useState, useMemo } from "react";
import { loadAllSummerPrograms, SummerProgram } from "@/lib/csv-loader";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BackgroundGradient } from "@/components/scroll-animations/background-gradient";
import { FloatingShapes } from "@/components/scroll-animations/floating-shapes";

function groupCost(cost: string) {
  if (!cost || /free/i.test(cost)) return "Free";
  const num = parseInt(cost.replace(/[^\d]/g, ""));
  if (!isNaN(num)) {
    if (num < 500) return "<$500";
    if (num < 2000) return "$500–$2000";
    return ">$2000";
  }
  return "Unknown";
}
function groupAcceptance(rate: string) {
  if (!rate) return "Unknown";
  const num = parseFloat(rate.replace(/[^\d.]/g, ""));
  if (!isNaN(num)) {
    if (num < 10) return "<10%";
    if (num < 30) return "10–30%";
    if (num < 60) return "30–60%";
    return ">60%";
  }
  return "Unknown";
}
function groupLowIncome(val: string) {
  if (!val) return "Unknown";
  if (/yes|target/i.test(val)) return "Yes";
  if (/no/i.test(val)) return "No";
  return "Unknown";
}

export default function SummerProgramsPage() {
  const [programs, setPrograms] = useState<SummerProgram[]>([]);
  const [search, setSearch] = useState("");
  const [cost, setCost] = useState("");
  const [acceptance, setAcceptance] = useState("");
  const [lowIncome, setLowIncome] = useState("");

  useEffect(() => {
    loadAllSummerPrograms().then(setPrograms);
  }, []);

  // Smart filter options
  const costOptions = ["", "Free", "<$500", "$500–$2000", ">$2000", "Unknown"];
  const acceptanceOptions = ["", "<10%", "10–30%", "30–60%", ">60%", "Unknown"];
  const lowIncomeOptions = ["", "Yes", "No", "Unknown"];

  const filtered = programs.filter((p) => {
    const costGroup = groupCost(p.cost);
    const acceptanceGroup = groupAcceptance(p.acceptanceRate);
    const lowIncomeGroup = groupLowIncome(p.targeted);
    return (
      (!search || p.title.toLowerCase().includes(search.toLowerCase())) &&
      (!cost || costGroup === cost) &&
      (!acceptance || acceptanceGroup === acceptance) &&
      (!lowIncome || lowIncomeGroup === lowIncome)
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
              Find Your <span className="gradient-text-helix">Summer Program</span>
            </div>
            <p className="text-xl md:text-2xl text-helix-text-light max-w-4xl mx-auto leading-relaxed">
              Browse and discover top summer programs for high school students. Use the filters to find the right fit for your goals, interests, and background.
            </p>
          </div>
          <div className="mb-12 md:mb-16 space-y-6">
            <div className="flex flex-col md:flex-row gap-4 w-full">
              <Input
                placeholder="Search summer program..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-6 h-12 sm:h-14 md:h-16 text-lg md:text-xl border-2 border-white/20 focus:border-helix-gradient-start outline-none w-full bg-white/10 text-white placeholder-helix-text-light backdrop-blur-sm rounded-full"
              />
              <Select value={cost} onValueChange={setCost}>
                <SelectTrigger className="h-12 sm:h-14 md:h-16 text-lg md:text-xl border-2 border-white/20 focus:border-helix-gradient-start min-w-[140px] sm:min-w-[160px] md:min-w-[220px] w-full sm:w-auto bg-white/10 text-white backdrop-blur-sm rounded-full">
                  <SelectValue placeholder="Cost..." />
                </SelectTrigger>
                <SelectContent>
                  {costOptions.map(c => <SelectItem key={c} value={c}>{c || "All Costs"}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={acceptance} onValueChange={setAcceptance}>
                <SelectTrigger className="h-12 sm:h-14 md:h-16 text-lg md:text-xl border-2 border-white/20 focus:border-helix-gradient-start min-w-[140px] sm:min-w-[160px] md:min-w-[220px] w-full sm:w-auto bg-white/10 text-white backdrop-blur-sm rounded-full">
                  <SelectValue placeholder="Acceptance Rate..." />
                </SelectTrigger>
                <SelectContent>
                  {acceptanceOptions.map(a => <SelectItem key={a} value={a}>{a || "All Acceptance Rates"}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={lowIncome} onValueChange={setLowIncome}>
                <SelectTrigger className="h-12 sm:h-14 md:h-16 text-lg md:text-xl border-2 border-white/20 focus:border-helix-gradient-start min-w-[140px] sm:min-w-[160px] md:min-w-[220px] w-full sm:w-auto bg-white/10 text-white backdrop-blur-sm rounded-full">
                  <SelectValue placeholder="Low-Income/First-Gen..." />
                </SelectTrigger>
                <SelectContent>
                  {lowIncomeOptions.map(l => <SelectItem key={l} value={l}>{l || "All"}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filtered.length === 0 && (
              <div className="col-span-full text-center text-white/70 py-12">No summer programs found.</div>
            )}
            {filtered.map((p, i) => (
              <Card key={i} className="glass border border-white/10 shadow-xl hover:shadow-2xl hover:glow transition-all duration-300 cursor-pointer">
                <CardHeader className="pb-8">
                  <CardTitle className="text-xl font-bold text-white mb-1">{p.title}</CardTitle>
                  <div className="text-white/80 text-sm mb-2">{p.location} {p.cost && <>| {p.cost}</>}</div>
                  <div className="text-white/70 text-sm mb-2">Acceptance Rate: {p.acceptanceRate}</div>
                  <div className="text-white/70 text-sm mb-2">Low-Income/First-Gen: {p.targeted}</div>
                </CardHeader>
                <CardContent>
                  <div className="text-white/70 text-xs mb-2">{p.description}</div>
                  {p.officialUrl && <a href={p.officialUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline text-xs">Official Program Page</a>}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
} 