"use client";
import { useEffect, useState } from "react";
import { loadAllSummerPrograms, SummerProgram } from "@/lib/csv-loader";

export default function SummerProgramsPage() {
  const [programs, setPrograms] = useState<SummerProgram[]>([]);
  const [search, setSearch] = useState("");
  const [cost, setCost] = useState("");
  const [acceptance, setAcceptance] = useState("");
  const [lowIncome, setLowIncome] = useState("");

  useEffect(() => {
    loadAllSummerPrograms().then(setPrograms);
  }, []);

  const filtered = programs.filter((p) => {
    return (
      (!search || p.title.toLowerCase().includes(search.toLowerCase())) &&
      (!cost || (p.cost && p.cost.toLowerCase().includes(cost.toLowerCase()))) &&
      (!acceptance || (p.acceptanceRate && p.acceptanceRate.toLowerCase().includes(acceptance.toLowerCase()))) &&
      (!lowIncome || (p.targeted && p.targeted.toLowerCase().includes(lowIncome.toLowerCase())))
    );
  });

  // Get unique filter values
  const costs = Array.from(new Set(programs.map((p) => p.cost).filter(Boolean)));
  const acceptances = Array.from(new Set(programs.map((p) => p.acceptanceRate).filter(Boolean)));
  const lowIncomes = Array.from(new Set(programs.map((p) => p.targeted).filter(Boolean)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#181c2a]/80 to-[#232946]/80 py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#7b61ff] to-[#5ad1ff] bg-clip-text text-transparent">Explore Summer Programs</h1>
        <p className="text-lg text-white/80 mb-8">Browse and discover top summer programs for high school students. Use the filters to find the right fit for your goals, interests, and background.</p>
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            className="flex-1 rounded-lg px-4 py-2 border border-white/20 bg-white/10 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Search summer program..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="rounded-lg px-4 py-2 border border-white/20 bg-white/10 text-white focus:outline-none"
            value={cost}
            onChange={e => setCost(e.target.value)}
          >
            <option value="">Cost</option>
            {costs.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            className="rounded-lg px-4 py-2 border border-white/20 bg-white/10 text-white focus:outline-none"
            value={acceptance}
            onChange={e => setAcceptance(e.target.value)}
          >
            <option value="">Acceptance Rate</option>
            {acceptances.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <select
            className="rounded-lg px-4 py-2 border border-white/20 bg-white/10 text-white focus:outline-none"
            value={lowIncome}
            onChange={e => setLowIncome(e.target.value)}
          >
            <option value="">Low-Income/Fir-Gen</option>
            {lowIncomes.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.length === 0 && (
            <div className="col-span-full text-center text-white/70 py-12">No summer programs found.</div>
          )}
          {filtered.map((p, i) => (
            <div key={i} className="rounded-2xl bg-gradient-to-br from-[#0f0c29]/80 to-[#302b63]/80 border border-white/10 p-6 shadow-lg flex flex-col gap-2">
              <h2 className="text-xl font-bold text-white mb-1">{p.title}</h2>
              <div className="text-white/80 text-sm mb-2">{p.location} {p.cost && <>| {p.cost}</>}</div>
              <div className="text-white/70 text-sm mb-2">Acceptance Rate: {p.acceptanceRate}</div>
              <div className="text-white/70 text-sm mb-2">Low-Income/First-Gen: {p.targeted}</div>
              <div className="text-white/70 text-xs mb-2">{p.description}</div>
              {p.officialUrl && <a href={p.officialUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline text-xs">Official Program Page</a>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 