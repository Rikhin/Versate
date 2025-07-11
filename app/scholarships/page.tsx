"use client";
import { useEffect, useState } from "react";
import { loadAllScholarships, Scholarship } from "@/lib/csv-loader";

export default function ScholarshipsPage() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [degree, setDegree] = useState("");

  useEffect(() => {
    loadAllScholarships().then(setScholarships);
  }, []);

  const filtered = scholarships.filter((s) => {
    return (
      (!search || s.title.toLowerCase().includes(search.toLowerCase())) &&
      (!location || s.location.toLowerCase().includes(location.toLowerCase())) &&
      (!degree || s.degrees.toLowerCase().includes(degree.toLowerCase()))
    );
  });

  // Get unique locations and degrees for filters
  const locations = Array.from(new Set(scholarships.map((s) => s.location).filter(Boolean)));
  const degrees = Array.from(new Set(scholarships.map((s) => s.degrees).filter(Boolean)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#181c2a]/80 to-[#232946]/80 py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#7b61ff] to-[#5ad1ff] bg-clip-text text-transparent">Explore Scholarships</h1>
        <p className="text-lg text-white/80 mb-8">Browse and discover scholarships for students around the world. Use the filters to find the right fit for your goals, interests, and background.</p>
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            className="flex-1 rounded-lg px-4 py-2 border border-white/20 bg-white/10 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Search scholarships..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="rounded-lg px-4 py-2 border border-white/20 bg-white/10 text-white focus:outline-none"
            value={location}
            onChange={e => setLocation(e.target.value)}
          >
            <option value="">All Locations</option>
            {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
          </select>
          <select
            className="rounded-lg px-4 py-2 border border-white/20 bg-white/10 text-white focus:outline-none"
            value={degree}
            onChange={e => setDegree(e.target.value)}
          >
            <option value="">All Degrees</option>
            {degrees.map(deg => <option key={deg} value={deg}>{deg}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.length === 0 && (
            <div className="col-span-full text-center text-white/70 py-12">No scholarships found.</div>
          )}
          {filtered.map((s, i) => (
            <div key={i} className="rounded-2xl bg-gradient-to-br from-[#0f0c29]/80 to-[#302b63]/80 border border-white/10 p-6 shadow-lg flex flex-col gap-2">
              <h2 className="text-xl font-bold text-white mb-1">{s.title}</h2>
              <div className="text-white/80 text-sm mb-2">{s.location} {s.degrees && <>| {s.degrees}</>}</div>
              <div className="text-white/70 text-sm mb-2">Funds: {s.funds}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 