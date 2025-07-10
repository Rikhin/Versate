"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { loadAllMentors, MentorProfile } from "@/lib/csv-loader"
import { BackgroundGradient, FloatingShapes, TextFade } from "@/components/scroll-animations"
import { useAuth } from "@clerk/nextjs"
import { Badge } from "@/components/ui/badge"
import { Users, Mail } from "lucide-react"
import { ProfileModal } from "@/components/connect/ProfileModal"
import { useEffect as useEffectEmails, useState as useStateEmails } from "react"
import Papa from 'papaparse';
import { CustomDropdown } from '@/components/connect/CustomDropdown'
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import OnboardingScrollEnforcer from "@/components/onboarding/OnboardingScrollEnforcer";
import type { ProfileData } from '@/components/connect/ProfileModal';

// Add Student type at the top of the file

type Student = {
  first_name: string;
  last_name: string;
  email?: string;
  school?: string;
  grade_level?: string;
  skills?: string[];
  competitions?: string[];
  location?: string;
};

// Custom styles for filter boxes

export default function ConnectPage() {
  const [mentors, setMentors] = useState<MentorProfile[]>([])
  const [shuffledMentors, setShuffledMentors] = useState<MentorProfile[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [search, setSearch] = useState("")
  const [filterCompany, setFilterCompany] = useState("")
  const [filterJob, setFilterJob] = useState("")
  const [filterYears, setFilterYears] = useState("")
  const [filterState, setFilterState] = useState("")
  const [selectedProfile, setSelectedProfile] = useState<ProfileData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("mentor") // 'mentor', 'student', 'emails'
  const [sentEmails, setSentEmails] = useStateEmails([])
  const [loadingEmails, setLoadingEmails] = useStateEmails(false)
  const { isSignedIn } = useAuth()
  const [allStates, setAllStates] = useState<string[]>([])
  const [filterSkill, setFilterSkill] = useState("");
  const [filterCompetition, setFilterCompetition] = useState("");
  const [filterEmail, setFilterEmail] = useState("");
  const [loadingMentors, setLoadingMentors] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 27,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });

  // Shuffle function
  function shuffleArray<T>(array: T[]): T[] {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Load and shuffle mentors on mount only
  useEffect(() => {
    loadAndShuffleMentors();
    // eslint-disable-next-line
  }, []);

  const loadAndShuffleMentors = async () => {
    setLoadingMentors(true);
    try {
      const allMentors = await loadAllMentors();
      const shuffled = shuffleArray(allMentors);
      setShuffledMentors(shuffled);
      setMentors(shuffled);
      setPagination(p => ({
        ...p,
        total: shuffled.length,
        totalPages: Math.ceil(shuffled.length / p.limit),
        page: 1,
        hasNext: shuffled.length > p.limit,
        hasPrev: false
      }));
    } catch {
      setShuffledMentors([]);
      setMentors([]);
    } finally {
      setLoadingMentors(false);
    }
  };

  // Paginate mentors when page/filter/search changes
  const loadMentors = (pageNum = 1, searchTerm = search, filters: {
    state?: string;
    company?: string;
    jobTitle?: string;
    yearsExperience?: string;
    email?: string;
  } = {}) => {
    setLoadingMentors(true);
    try {
      let filteredMentors = shuffledMentors;
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filteredMentors = filteredMentors.filter(m => 
          m.name?.toLowerCase().includes(searchLower) ||
          m.company?.toLowerCase().includes(searchLower) ||
          m.jobTitle?.toLowerCase().includes(searchLower)
        );
      }
      if (filters.state) {
        filteredMentors = filteredMentors.filter(m => 
          m.state?.toLowerCase().includes(filters.state!.toLowerCase())
        );
      }
      if (filters.company) {
        filteredMentors = filteredMentors.filter(m => 
          m.company?.toLowerCase().includes(filters.company!.toLowerCase())
        );
      }
      if (filters.jobTitle) {
        filteredMentors = filteredMentors.filter(m => 
          m.jobTitle?.toLowerCase().includes(filters.jobTitle!.toLowerCase())
        );
      }
      if (filters.yearsExperience) {
        filteredMentors = filteredMentors.filter(m => 
          m.yearsExperience?.toLowerCase().includes(filters.yearsExperience!.toLowerCase())
        );
      }
      if (filters.email) {
        if (filters.email === "Yes") {
          filteredMentors = filteredMentors.filter(m => 
            m.email && m.email.trim() !== "" && m.email !== "N/A"
          );
        } else if (filters.email === "No") {
          filteredMentors = filteredMentors.filter(m => 
            !m.email || m.email.trim() === "" || m.email === "N/A"
          );
        }
      }
      const limit = 27;
      const startIndex = (pageNum - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedMentors = filteredMentors.slice(startIndex, endIndex);
      setMentors(paginatedMentors);
      setPagination({
        page: pageNum,
        limit: limit,
        total: filteredMentors.length,
        totalPages: Math.ceil(filteredMentors.length / limit),
        hasNext: endIndex < filteredMentors.length,
        hasPrev: pageNum > 1
      });
    } catch {
      setMentors([]);
    } finally {
      setLoadingMentors(false);
    }
  };

  // Update useEffect to use loadMentors with shuffledMentors
  useEffect(() => {
    if (activeTab === "mentor" && shuffledMentors.length > 0) {
      const filters = {
        state: filterState,
        company: filterCompany,
        jobTitle: filterJob,
        yearsExperience: filterYears,
        email: filterEmail
      };
      loadMentors(1, search, filters);
    }
    // eslint-disable-next-line
  }, [activeTab, search, filterState, filterCompany, filterJob, filterYears, filterEmail, shuffledMentors]);

  // Load students
  useEffect(() => {
    let cancelled = false;
    if (isSignedIn) {
      fetch("/api/profiles/search?limit=1000")
        .then(res => res.ok ? res.json() : [])
        .then(data => { if (!cancelled) setStudents(data) })
        .catch(() => setStudents([]));
    } else {
      setStudents([]);
    }
    return () => { cancelled = true; };
  }, [isSignedIn]);

  // Load sent emails
  useEffectEmails(() => {
    let cancelled = false;
    if (isSignedIn) {
      setLoadingEmails(true);
      fetch("/api/email/sent")
        .then(res => res.ok ? res.json() : [])
        .then(data => { if (!cancelled) setSentEmails(data) })
        .catch(() => setSentEmails([]))
        .finally(() => { if (!cancelled) setLoadingEmails(false) });
    } else {
      setSentEmails([]);
    }
    return () => { cancelled = true; };
  }, [isSignedIn]);

  // Load states
  useEffect(() => {
    fetch("/public/state_abbreviations.csv")
      .then(res => res.text())
      .then(csv => {
        Papa.parse(csv, {
          header: true,
          complete: (results) => {
            const states = results.data.map((row: unknown) => (row as { State: string }).State).filter(Boolean);
            setAllStates(states);
          }
        });
      })
      .catch(() => setAllStates([]));
  }, []);

  // Extract unique values for filters
  const companyGroups = Array.from(new Set(shuffledMentors.map(m => m.company).filter(Boolean))).sort();
  const jobGroups = Array.from(new Set(shuffledMentors.map(m => m.jobTitle).filter(Boolean))).sort();
  const yearGroups = Array.from(new Set(shuffledMentors.map(m => m.yearsExperience).filter(Boolean))).sort();

  // Filter students
  const filteredStudents = students.filter(s => {
    const sTerm = search.toLowerCase();
    const matchesSearch = !sTerm || 
      `${s.first_name} ${s.last_name}`.toLowerCase().includes(sTerm) ||
      (s.skills || []).some((skill: string) => skill.toLowerCase().includes(sTerm)) ||
      (s.competitions || []).some((comp: string) => comp.toLowerCase().includes(sTerm));
    
    const matchesSkill = !filterSkill || (s.skills || []).includes(filterSkill);
    const matchesCompetition = !filterCompetition || (s.competitions || []).includes(filterCompetition);
    
    return matchesSearch && matchesSkill && matchesCompetition;
  });

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
    const filters = {
      state: filterState,
      company: filterCompany,
      jobTitle: filterJob,
        yearsExperience: filterYears,
        email: filterEmail
    };
    loadMentors(newPage, search, filters);
    }
  };

  const handleProfileClick = (profile: ProfileData) => {
    setSelectedProfile(profile);
    setIsModalOpen(true);
  };

  const clearFilters = () => {
    setSearch("");
    setFilterCompany("");
    setFilterJob("");
    setFilterYears("");
    setFilterState("");
    setFilterEmail("");
    setFilterSkill("");
    setFilterCompetition("");
    setPagination({...pagination, page: 1});
    // Reload mentors with cleared filters
    loadAndShuffleMentors();
  }

  return (
    <OnboardingScrollEnforcer>
      <div className="w-full min-h-screen bg-helix-dark relative overflow-hidden">
        <BackgroundGradient startColor="from-helix-blue/20" endColor="to-helix-dark-blue/20" triggerStart="top center" triggerEnd="center center" />
        <FloatingShapes count={3} triggerStart="top center" triggerEnd="bottom center" />
        <div className="container mx-auto px-6 py-16">
          <div className="mb-16 text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end bg-clip-text text-transparent mb-4 drop-shadow-lg">Connect</h1>
            <h2 className="text-3xl md:text-4xl font-bold text-helix-gradient-start mb-4">Mentors & Students</h2>
            <p className="text-lg text-helix-text-light mb-8 max-w-2xl mx-auto">Browse and connect with real mentors and students from across the country. Use the filters to find the right expertise, background, or collaborators for your needs.</p>
                      </div>
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <Button 
              variant={activeTab === "mentor" ? "default" : "outline"} 
              onClick={() => setActiveTab("mentor")}
              className={activeTab === "mentor" ? "bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end text-white hover:shadow-xl glow" : "border-2 border-white/20 text-white hover:bg-white/10 rounded-full"}
            >
              Mentors
                            </Button>
            <Button 
              variant={activeTab === "student" ? "default" : "outline"} 
              onClick={() => setActiveTab("student")}
              className={activeTab === "student" ? "bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end text-white hover:shadow-xl glow" : "border-2 border-white/20 text-white hover:bg-white/10 rounded-full"}
            >
              Students
                            </Button>
            <Button 
              variant={activeTab === "emails" ? "default" : "outline"} 
              onClick={() => setActiveTab("emails")}
              className={activeTab === "emails" ? "bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end text-white hover:shadow-xl glow" : "border-2 border-white/20 text-white hover:bg-white/10 rounded-full"}
            >
              Emails
                          </Button>
                    </div>
          <div className="glass border border-white/10 rounded-[20px] shadow-xl px-8 py-6 flex flex-wrap items-center justify-center gap-4 mb-16">
            <div className="flex-1 relative flex items-center h-12 sm:h-14 md:h-16">
                        <Input
                          placeholder="Search by name, company, or job title..."
                          value={search}
                          onChange={e => setSearch(e.target.value)}
                className="pl-6 border-2 border-white/20 focus:border-helix-gradient-start bg-white/10 text-white placeholder-helix-text-light backdrop-blur-sm rounded-full text-lg md:text-xl h-12 sm:h-14 md:h-16"
                        />
                      </div>
            <div className="relative min-w-[140px] h-12 sm:h-14 md:h-16 flex items-center">
                        <CustomDropdown placeholder="State" options={allStates} value={filterState} onChange={setFilterState} />
                      </div>
            <div className="relative min-w-[140px] h-12 sm:h-14 md:h-16 flex items-center">
                            <CustomDropdown label="Company" placeholder="Company" options={companyGroups} value={filterCompany} onChange={(v: string) => { setFilterCompany(v); setPagination({...pagination, page: 1}); }} />
                          </div>
            <div className="relative min-w-[140px] h-12 sm:h-14 md:h-16 flex items-center">
                            <CustomDropdown label="Job Title" placeholder="Job Title" options={jobGroups} value={filterJob} onChange={(v: string) => { setFilterJob(v); setPagination({...pagination, page: 1}); }} />
                          </div>
            <div className="relative min-w-[140px] h-12 sm:h-14 md:h-16 flex items-center">
                            <CustomDropdown label="Experience" placeholder="Experience" options={yearGroups} value={filterYears} onChange={(v: string) => { setFilterYears(v); setPagination({...pagination, page: 1}); }} />
                          </div>
            <div className="relative min-w-[140px] h-12 sm:h-14 md:h-16 flex items-center">
                            <CustomDropdown label="Email" placeholder="Email Provided" options={["Yes", "No"]} value={filterEmail} onChange={(v: string) => { setFilterEmail(v); setPagination({...pagination, page: 1}); }} />
                          </div>
            <Button variant="outline" className="h-12 sm:h-14 md:h-16 border-2 border-white/20 text-white hover:bg-white/10 rounded-full font-bold text-lg" onClick={clearFilters}>Clear</Button>
                          </div>
          <TextFade triggerStart="top 80%" triggerEnd="center center" stagger={0.1}>
                  {activeTab === "mentor" && (
                    <div>
                      {loadingMentors ? (
                  <div className="text-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-helix-gradient-start mx-auto mb-4"></div>
                    <p className="text-helix-text-light text-lg">Loading mentors...</p>
                        </div>
                      ) : (
                        <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-12">
                            {mentors.map((m, i) => (
                        <div key={"mentor-"+i} className="focus:outline-none focus:ring-4 focus:ring-helix-gradient-start/30 rounded-[24px]">
                                <Card 
                            className="glass border border-white/10 shadow-xl hover:shadow-2xl hover:glow transition-all duration-300 cursor-pointer"
                                >
                            <CardHeader className="pb-8">
                              <div className="flex justify-between items-start mb-6">
                                <Badge className="border-2 bg-blue-400/20 text-blue-400 border-blue-400/30 px-4 py-2 text-sm font-bold uppercase tracking-widest">Mentor</Badge>
                                <div className="text-4xl"><Users /></div>
                                    </div>
                              <CardTitle className="text-xl font-semibold text-white mb-2">{m.name}</CardTitle>
                              <div className="text-base text-helix-text-light line-clamp-3 mb-2">{m.jobTitle}</div>
                              <div className="text-sm text-helix-text-light mb-2">{m.company}</div>
                                  </CardHeader>
                            <CardContent className="flex flex-col gap-4">
                              <div className="flex items-center justify-between mt-4">
                                <div className="text-sm text-helix-text-light">{m.state}</div>
                                <Button size="sm" className="bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end text-white hover:shadow-xl glow rounded-full font-bold" onClick={() => handleProfileClick({ ...m, type: 'mentor' })}>Connect</Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>
                            ))}
                          </div>
                          
                          {pagination.totalPages > 1 && (
                      <div className="flex justify-center items-center gap-4 mt-12">
                              <Button
                                variant="outline"
                                onClick={() => handlePageChange(pagination.page - 1)}
                                disabled={!pagination.hasPrev}
                          className="border-2 border-white/20 text-white hover:bg-white/10 rounded-full font-bold"
                              >
                                Previous
                              </Button>
                              
                        <span className="text-lg text-helix-text-light">
                                Page {pagination.page} of {pagination.totalPages}
                              </span>
                              
                              <Button
                                variant="outline"
                                onClick={() => handlePageChange(pagination.page + 1)}
                                disabled={!pagination.hasNext}
                          className="border-2 border-white/20 text-white hover:bg-white/10 rounded-full font-bold"
                              >
                                Next
                              </Button>
                            </div>
                          )}
                          
                          {mentors.length === 0 && !loadingMentors && (
                      <div className="text-center text-helix-text-light mt-16">
                        <div className="text-3xl md:text-5xl font-black mb-4">No mentors found</div>
                        <p className="text-lg md:text-xl mb-8">Try adjusting your search or filters</p>
                        <Button 
                          onClick={clearFilters}
                          className="bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end text-white hover:shadow-xl glow font-bold text-lg px-8 py-4 rounded-full"
                        >
                          Clear Filters
                        </Button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                  {activeTab === "student" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-12">
                      {filteredStudents.map((s, i) => (
                  <div key={"student-"+i} className="focus:outline-none focus:ring-4 focus:ring-helix-gradient-start/30 rounded-[24px]">
                    <Card className="glass border border-white/10 shadow-xl hover:shadow-2xl hover:glow transition-all duration-300 cursor-pointer"> 
                      <CardHeader className="pb-8">
                        <div className="flex justify-between items-start mb-6">
                          <Badge className="border-2 bg-green-400/20 text-green-400 border-green-400/30 px-4 py-2 text-sm font-bold uppercase tracking-widest">Student</Badge>
                          <div className="text-4xl"><Users /></div>
                              </div>
                        <CardTitle className="text-xl font-semibold text-white">{s.first_name} {s.last_name}</CardTitle>
                        <div className="text-base text-helix-text-light">{s.grade_level || "Student"}</div>
                        <div className="text-sm text-helix-text-light">{s.school}</div>
                            </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="flex flex-wrap gap-2 mt-4">
                                {(s.skills?.slice(0, 3) || []).map((skill: string) => (
                            <span key={skill} className="bg-white/10 border border-white/20 rounded-full px-3 py-1 text-sm text-helix-text-light">{skill}</span>
                                ))}
                                {s.skills && s.skills.length > 3 && (
                            <span className="bg-white/10 border border-white/20 rounded-full px-3 py-1 text-sm text-helix-text-light">+{s.skills.length - 3} more</span>
                                )}
                              </div>
                        <div className="text-sm text-helix-text-light">Location: <span className="font-medium text-white">{s.location}</span></div>
                              {s.competitions && s.competitions.length > 0 && (
                          <div className="text-sm text-helix-text-light">Competition: <span className="font-medium text-white">{s.competitions[0]}</span></div>
                              )}
                        <div className="flex items-center justify-between mt-4">
                                <div></div>
                          <Button size="sm" className="bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end text-white hover:shadow-xl glow rounded-full font-bold" onClick={() => handleProfileClick({
  name: `${s.first_name} ${s.last_name}`,
  email: s.email || '',
  type: 'student',
  school: s.school,
  grade: s.grade_level,
  interests: s.skills || [],
  state: s.location,
})}>Connect</Button>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      ))}
                    </div>
                  )}
                  {activeTab === "emails" && (
                    <div>
                      {loadingEmails ? (
                  <div className="text-center text-helix-text-light py-16">Loading sent emails...</div>
                      ) : sentEmails.length === 0 ? (
                  <div className="text-center text-helix-text-light py-16">No sent emails yet.</div>
                      ) : (
                  <div className="space-y-6">
                          {sentEmails.map((email) => {
  const e = email as { id: string; email_to: string; sent_at: string; subject: string; body: string };
  return (
    <div key={e.id} className="glass border border-white/10 rounded-[16px] p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-4">
        <Mail className="h-5 w-5 text-helix-gradient-start" />
        <span className="font-bold text-white">To:</span>
        <span className="text-helix-text-light">{e.email_to}</span>
        <span className="ml-auto text-sm text-helix-text-light">{new Date(e.sent_at).toLocaleString()}</span>
      </div>
      <div className="font-bold text-white mb-2">{e.subject}</div>
      <div className="text-helix-text-light text-base italic">
        {e.body && e.body.length > 50 ? e.body.substring(0, 50) + "..." : e.body}
      </div>
    </div>
  );
})}
                        </div>
                      )}
                    </div>
                  )}
            {mentors.length === 0 && filteredStudents.length === 0 && <div className="text-center text-helix-text-light mt-16">No mentors or students found.</div>}
                </TextFade>
        </div>
        <ProfileModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} profile={selectedProfile} />
        {isSignedIn && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn">
            <div className="glass border border-white/10 rounded-[24px] shadow-2xl p-8 max-w-sm w-full flex flex-col items-center gap-6 animate-fadeInUp">
              <h2 className="text-2xl font-bold text-white mb-2">Sign in or Sign up</h2>
              <p className="text-helix-text-light text-center mb-4">Sign in or create an account to access Connect and start collaborating with mentors and students.</p>
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
      </div>
    </OnboardingScrollEnforcer>
  )
} 