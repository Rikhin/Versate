"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const exampleQueries = [
  "Students interested in robotics in California",
  "Mentors with experience in AI",
  "Competitions for high schoolers in Texas",
  "Teammates who know React",
  "People looking for hackathons this month",
  "Founders offering open-source developer tools",
  "People currently based in Europe",
  "Researchers in quantum computing",
  "Who works at a VC firm?",
  "People working on AI lead generation"
];

const savedSearches: string[] = [
  // Add more saved searches here as needed
];

export default function AISearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (q?: string) => {
    setLoading(true);
    setError("");
    setResults([]);
    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q || query }),
      });
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      setResults(data.results || []);
    } catch (e: any) {
      setError(e.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f6f6fb]">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 bg-[#f3f0ff] border-r border-gray-200 flex-col justify-between py-8 px-6 min-h-screen">
        <div>
          <div className="mb-8 flex items-center gap-2">
            <span className="font-bold text-xl text-indigo-700">ColabBoard</span>
          </div>
          <nav className="space-y-2 mb-8">
            <Link href="/ai-search" className="block py-2 px-3 rounded-lg font-medium text-indigo-700 bg-indigo-100">Search</Link>
          </nav>
          {/* Saved Searches Section */}
          <div className="mb-8">
            <div className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-widest">Saved Searches</div>
            <div className="flex flex-col gap-2">
              {savedSearches.map((search, i) => (
                <button
                  key={i}
                  className="w-full text-left py-2 px-3 rounded-lg bg-white hover:bg-indigo-50 text-sm text-gray-700 border border-indigo-50 transition"
                  onClick={() => { setQuery(search); handleSearch(search); }}
                  disabled={loading}
                  style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-8">
            <div className="text-xs text-gray-500 mb-1">Plan usage <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-0.5 rounded">Free</span></div>
            <div className="text-xs text-gray-500">Searches: <span className="font-semibold">Unlimited</span></div>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-8">
          <Avatar className="h-8 w-8"><AvatarFallback>RK</AvatarFallback></Avatar>
          <span className="text-sm font-medium text-gray-700">Rikhin Kavuru</span>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center py-12 sm:py-24 px-2 sm:px-4">
        <div className="w-full max-w-lg sm:max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 text-gray-900 leading-tight" style={{lineHeight: '1.18'}}>
            <span className="inline-block">Discover Endless</span><br/>
            <span className="inline-block bg-gradient-to-r from-blue-600 via-green-500 to-purple-600 bg-clip-text text-transparent font-semibold" style={{fontSize: '1.1em', lineHeight: '1.1'}}>Opportunities</span>
          </h1>
          <p className="text-center text-base sm:text-lg mb-8 sm:mb-12" style={{color: '#111', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto', lineHeight: '1.6'}}>Search for people, competitions, mentors, or teammates using natural language.</p>
          <Card className="p-0 flex flex-col gap-0 shadow-none bg-white rounded-full border-2 border-indigo-100" style={{ boxShadow: '0 4px 32px 0 rgba(80, 112, 255, 0.07)', borderRadius: '2.5rem', minHeight: '180px', justifyContent: 'center', alignItems: 'center', marginBottom: '2.5rem', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto' }}>
            <div className="flex flex-col items-center w-full px-4 sm:px-10 py-6 sm:py-10 gap-4 sm:gap-6">
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full">
                <Input
                  className="flex-1 text-base sm:text-lg px-4 sm:px-6 py-3 sm:py-4 border-0 focus:ring-2 focus:ring-indigo-200 rounded-full bg-white shadow-none"
                  placeholder="Search for people, competitions, mentors..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") handleSearch(); }}
                  disabled={loading}
                  style={{ borderRadius: '2rem' }}
                />
                <Button
                  className="w-full sm:w-auto mt-3 sm:mt-0 ml-0 sm:ml-2 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-none"
                  onClick={() => handleSearch()}
                  disabled={loading || !query.trim()}
                  style={{ borderRadius: '2rem' }}
                >
                  {loading ? "Searching..." : "Search"}
                </Button>
              </div>
              {/* Marquee-style horizontally scrolling example queries */}
              <div className="relative overflow-x-auto w-full">
                <div className="flex gap-3 animate-marquee whitespace-nowrap" style={{ animation: 'marquee 30s linear infinite' }}>
                  {exampleQueries.concat(exampleQueries).map((ex, i) => (
                    <button
                      key={i}
                      className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-xs sm:text-sm font-medium hover:bg-indigo-100 border border-indigo-100 mx-1 shadow-none"
                      onClick={() => { setQuery(ex); handleSearch(ex); }}
                      disabled={loading}
                      style={{ borderRadius: '2rem' }}
                    >
                      {ex}
                    </button>
                  ))}
                </div>
                <style>{`
                  @keyframes marquee {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(-50%); }
                  }
                `}</style>
              </div>
            </div>
          </Card>
          {/* Results */}
          <div className="mt-10 sm:mt-14" style={{maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto'}}>
            {error && <div className="text-red-500 text-center mb-4">{error}</div>}
            {results.length > 0 && (
              <div className="space-y-6 sm:space-y-8">
                {results.map((result, i) => (
                  <Card key={i} className="p-4 sm:p-6 flex flex-col gap-2 rounded-2xl border border-indigo-50 bg-white shadow-sm">
                    <div className="font-semibold text-base sm:text-lg text-gray-900">{result.title || result.name || result.competition || "Result"}</div>
                    <div className="text-gray-700 text-xs sm:text-sm">{result.description || result.bio || result.details || JSON.stringify(result)}</div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 