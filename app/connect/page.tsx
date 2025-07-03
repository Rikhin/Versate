"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { loadAllMentors, MentorProfile } from "@/lib/csv-loader"
import Link from "next/link"
import { BackgroundGradient, FloatingShapes, TextFade } from "@/components/scroll-animations"
import { useUser } from "@clerk/nextjs"
import { Badge } from "@/components/ui/badge"
import { Users, ExternalLink, Search, Mail } from "lucide-react"
import { ProfileModal } from "@/components/connect/ProfileModal"
import { useAuth } from "@clerk/nextjs"
import { useEffect as useEffectEmails, useState as useStateEmails } from "react"
import Papa from 'papaparse';
import { useRouter } from "next/navigation"
import { competitions } from '@/lib/competitions-data'
import { CustomDropdown } from '@/components/connect/CustomDropdown'
import { MessageButton } from '@/components/messaging/MessageButton'
import { SignInButton, SignUpButton } from "@clerk/nextjs";

// Custom styles for filter boxes
const filterBoxClass = "h-10 md:h-11 text-sm md:text-base font-normal border border-gray-300 focus:border-blue-500 focus:bg-blue-50/30 hover:bg-gray-50 rounded-lg px-3 transition-colors duration-150 min-w-[120px] md:min-w-[160px] bg-white appearance-none"

export default function ConnectPage() {
  const [mentors, setMentors] = useState<MentorProfile[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [filterCompany, setFilterCompany] = useState("")
  const [filterJob, setFilterJob] = useState("")
  const [filterYears, setFilterYears] = useState("")
  const [filterState, setFilterState] = useState("")
  const [selectedProfile, setSelectedProfile] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("mentor") // 'mentor', 'student', 'emails'
  const [sentEmails, setSentEmails] = useStateEmails([])
  const [loadingEmails, setLoadingEmails] = useStateEmails(false)
  const { isSignedIn, isLoaded } = useAuth()
  const [allStates, setAllStates] = useState<string[]>([])
  const [stateSearch, setStateSearch] = useState('')
  const [filterSkill, setFilterSkill] = useState("");
  const [filterCompetition, setFilterCompetition] = useState("");
  const [skillSearch, setSkillSearch] = useState("");
  const [competitionSearch, setCompetitionSearch] = useState("");
  const [emailModalStudent, setEmailModalStudent] = useState<any>(null)
  const router = useRouter()
  const [page, setPage] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadAllMentors().then(m => { if (!cancelled) setMentors(m) }).catch(() => setMentors([]));
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

  useEffect(() => {
    fetch('/state_abbreviations.csv')
      .then(res => res.text())
      .then(text => {
        const parsed = Papa.parse(text, { header: false });
        setAllStates(parsed.data.filter((row: any) => row[1]).map((row: any) => row[1].replace(/"/g, '')));
      });
  }, []);

  useEffectEmails(() => {
    if (activeTab === "emails" && isSignedIn) {
      setLoadingEmails(true)
      fetch("/api/email/sent")
        .then(res => res.json())
        .then(data => setSentEmails(data.emails || []))
        .finally(() => setLoadingEmails(false))
    }
  }, [activeTab, isSignedIn])

  useEffect(() => {
    if (isLoaded && !isSignedIn) setShowAuthModal(true);
    else setShowAuthModal(false);
  }, [isSignedIn, isLoaded]);

  // Grouped filter options
  const yearGroups = [
    { label: "All", value: "" },
    { label: "< 5 years", value: "<5" },
    { label: "5-10 years", value: "5-10" },
    { label: "10+ years", value: "10+" },
  ]
  const jobGroups = [
    { label: "All", value: "" },
    { label: "Research", value: "research" },
    { label: "Engineering", value: "engineer" },
    { label: "Data/Analytics", value: "data" },
    { label: "Professor/Teacher", value: "prof" },
    { label: "Other", value: "other" },
  ]
  const companyGroups = [
    { label: "All", value: "" },
    { label: "University", value: "university" },
    { label: "School", value: "school" },
    { label: "Company", value: "company" },
    { label: "Other", value: "other" },
  ]

  // Extract unique skills and competitions from students
  const allSkills = Array.from(new Set(students.flatMap(s => s.skills || []))).sort();
  const allCompetitions = Array.from(new Set(students.flatMap(s => s.competitions || []))).sort();

  // Filtering logic with grouping
  const filtered = mentors.filter(m => {
    const s = search.toLowerCase()
    // Years experience grouping
    let yearsGroup = "other"
    const y = parseInt(m.yearsExperience)
    if (!isNaN(y)) {
      if (y < 5) yearsGroup = "<5"
      else if (y < 10) yearsGroup = "5-10"
      else yearsGroup = "10+"
    }
    // Job title grouping
    let jobGroup = "other"
    const jt = m.jobTitle.toLowerCase()
    if (jt.includes("research")) jobGroup = "research"
    else if (jt.includes("engineer")) jobGroup = "engineer"
    else if (jt.includes("data")) jobGroup = "data"
    else if (jt.includes("prof") || jt.includes("teach")) jobGroup = "prof"
    // Company grouping
    let companyGroup = "other"
    const c = m.company.toLowerCase()
    if (c.includes("university")) companyGroup = "university"
    else if (c.includes("school")) companyGroup = "school"
    else if (c.match(/inc|llc|corp|company|technologies|solutions|systems/)) companyGroup = "company"

    return (
      (!s || m.name.toLowerCase().includes(s) || m.company.toLowerCase().includes(s) || m.jobTitle.toLowerCase().includes(s)) &&
      (!filterState || m.state === filterState) &&
      (!filterCompany || companyGroup === filterCompany) &&
      (!filterJob || jobGroup === filterJob) &&
      (!filterYears || yearsGroup === filterYears)
    )
  })

  // Student filter logic
  const filteredStudents = students.filter(s => {
    const sText = search.toLowerCase();
    const matchesSkill = !filterSkill || (s.skills && s.skills.includes(filterSkill));
    const matchesCompetition = !filterCompetition || (s.competitions && s.competitions.includes(filterCompetition));
    return (
      (!sText || `${s.first_name} ${s.last_name}`.toLowerCase().includes(sText) || s.school?.toLowerCase().includes(sText) || s.skills?.some((sk: string) => sk.toLowerCase().includes(sText))) &&
      (!filterState || s.location === filterState) &&
      matchesSkill && matchesCompetition
    );
  })

  // Unique states
  const states = Array.from(new Set(mentors.map(m => m.state).filter(Boolean)))

  const handleProfileClick = (profile: any, type: "mentor" | "student") => {
    const profileData = {
      name: type === "mentor" ? profile.name : `${profile.first_name} ${profile.last_name}`,
      email: profile.email,
      company: profile.company,
      jobTitle: profile.jobTitle,
      yearsExperience: profile.yearsExperience,
      state: profile.state || profile.location,
      linkedin: profile.linkedin,
      type,
      school: profile.school,
      grade: profile.grade_level,
      interests: profile.skills,
      userId: profile.id || profile.userId || undefined
    }
    setSelectedProfile(profileData)
    setIsModalOpen(true)
  }

  const clearFilters = () => {
    setSearch("");
    setFilterCompany("");
    setFilterJob("");
    setFilterYears("");
    setFilterState("");
    setFilterSkill("");
    setFilterCompetition("");
    setPage(0);
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <BackgroundGradient startColor="from-gray-50/50" endColor="to-gray-100/50" triggerStart="top center" triggerEnd="center center" />
      <FloatingShapes count={3} triggerStart="top center" triggerEnd="bottom center" />
      <div className="relative z-10">
        {isLoaded && (
          <>
            {/* Header */}
            <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
              <div className="container mx-auto px-8 py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Users className="h-8 w-8 text-black" />
                    <div>
                      <span className="text-2xl font-black text-black">Versa</span>
                      <p className="text-sm text-gray-600">Connect</p>
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
            {/* Main Content */}
            <div className="container mx-auto px-4 md:px-8 py-8 md:py-16">
              <TextFade triggerStart="top 80%" triggerEnd="center center" stagger={0.1}>
                {/* Header Section */}
                <div className="text-center mb-8 md:mb-16">
                  <h1 className="text-3xl md:text-6xl md:text-7xl font-black text-black mb-4 md:mb-8 leading-none">
                    Connect<br /><span className="text-gray-400">Mentors & Students</span>
                  </h1>
                  <p className="text-base md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                    Browse and connect with real mentors and students from across the country. Use the filters to find the right expertise, background, or collaborators for your needs.
                  </p>
                </div>
                {/* Tab Bar */}
                <div className="flex gap-2 mb-8 justify-center">
                  <Button variant={activeTab === "mentor" ? "default" : "outline"} onClick={() => setActiveTab("mentor")}>Mentors</Button>
                  <Button variant={activeTab === "student" ? "default" : "outline"} onClick={() => setActiveTab("student")}>Students</Button>
                  <Button variant={activeTab === "emails" ? "default" : "outline"} onClick={() => setActiveTab("emails")}>Emails</Button>
                </div>
                {/* Info Bubble for Emails Tab */}
                {activeTab === "emails" && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center gap-3">
                    <Mail className="h-6 w-6 text-blue-400" />
                    <span className="text-blue-900 text-sm">
                      Only emails you send from ColabBoard are shown here.<br />Replies from mentors will appear in your regular Gmail inbox.
                    </span>
                  </div>
                )}
                {/* Search and Filters */}
                {activeTab !== "emails" && (
                  <div className="flex flex-col md:flex-row gap-4 items-center md:items-center">
                    <div className="flex-1 relative flex items-center h-10">
                      <Input
                        placeholder="Search by name, company, or job title..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className={`pl-4 ${filterBoxClass} placeholder-gray-400 h-10`}
                        style={{ minHeight: 40 }}
                      />
                    </div>
                    {/* State Filter */}
                    <div className="relative min-w-[120px] h-10 flex items-center">
                      <CustomDropdown placeholder="State" options={allStates} value={filterState} onChange={setFilterState} />
                    </div>
                    {/* Mentor Filters */}
                    {activeTab === "mentor" && (
                      <>
                        <div className="relative min-w-[120px] h-10 flex items-center">
                          <CustomDropdown label="Company" placeholder="Company" options={companyGroups} value={filterCompany} onChange={(v: string) => { setFilterCompany(v); setPage(0); }} />
                        </div>
                        <div className="relative min-w-[120px] h-10 flex items-center">
                          <CustomDropdown label="Job Title" placeholder="Job Title" options={jobGroups} value={filterJob} onChange={(v: string) => { setFilterJob(v); setPage(0); }} />
                        </div>
                        <div className="relative min-w-[120px] h-10 flex items-center">
                          <CustomDropdown label="Experience" placeholder="Experience" options={yearGroups} value={filterYears} onChange={(v: string) => { setFilterYears(v); setPage(0); }} />
                        </div>
                      </>
                    )}
                    {/* Student Filters */}
                    {activeTab === "student" && (
                      <>
                        <div className="relative min-w-[120px] h-10 flex items-center">
                          <CustomDropdown placeholder="Skill" options={allSkills.filter((sk: string) => sk.toLowerCase().includes(skillSearch.toLowerCase()))} value={filterSkill} onChange={(v: string) => { setFilterSkill(v); setPage(0); }} />
                        </div>
                        <div className="relative min-w-[120px] h-10 flex items-center">
                          <CustomDropdown placeholder="Competition" options={competitions.map(c => c.name).filter((name: string) => name.toLowerCase().includes(competitionSearch.toLowerCase()))} value={filterCompetition} onChange={(v: string) => { setFilterCompetition(v); setPage(0); }} />
                        </div>
                      </>
                    )}
                    <Button variant="outline" className="h-10" onClick={clearFilters}>Clear</Button>
                  </div>
                )}
                {/* Tab Content */}
                {activeTab === "mentor" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mt-10">
                    {filtered.map((m, i) => (
                      <div key={"mentor-"+i} className="focus:outline-none focus:ring-4 focus:ring-black/30 rounded-xl">
                        <Card 
                          className="border-2 border-blue-200 shadow-lg hover:shadow-blue-300/40 hover:border-blue-400 ring-1 ring-blue-100/40 transition hover:scale-105 cursor-pointer bg-white"
                        >
                          <CardHeader className="pb-6">
                            <div className="flex justify-between items-start mb-4">
                              <Badge className="border-2 bg-blue-100 text-blue-800 border-blue-300 px-4 py-2 text-sm font-bold uppercase tracking-widest">Mentor</Badge>
                              <div className="text-3xl"><Users /></div>
                            </div>
                            <CardTitle className="text-xl font-bold text-gray-900 mb-1">{m.name}</CardTitle>
                            <div className="text-sm text-gray-600 mb-2">{m.jobTitle}</div>
                            <div className="text-sm text-gray-500 mb-2">{m.company}</div>
                          </CardHeader>
                          <CardContent className="flex flex-col gap-2">
                            <div className="flex items-center justify-between mt-2">
                              <div className="text-xs text-gray-500">{m.state}</div>
                              <Button size="sm" className="ml-auto" onClick={() => handleProfileClick(m, 'mentor')}>Connect</Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </div>
                )}
                {activeTab === "student" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mt-10">
                    {filteredStudents.map((s, i) => (
                      <div key={"student-"+i} className="focus:outline-none focus:ring-4 focus:ring-black/30 rounded-xl">
                        <Card className="border-2 border-green-200 shadow-lg hover:shadow-green-300/40 hover:border-green-400 ring-1 ring-green-100/40 transition hover:scale-105 cursor-pointer bg-white"> 
                          <CardHeader className="pb-6">
                            <div className="flex justify-between items-start mb-4">
                              <Badge className="border-2 bg-green-100 text-green-800 border-green-300 px-4 py-2 text-sm font-bold uppercase tracking-widest">Student</Badge>
                              <div className="text-3xl"><Users /></div>
                            </div>
                            <CardTitle className="text-2xl font-black text-black">{s.first_name} {s.last_name}</CardTitle>
                            <div className="text-lg text-gray-600">{s.grade_level || "Student"}</div>
                            <div className="text-md text-gray-500">{s.school}</div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex flex-wrap gap-1 mt-2">
                              {s.skills && s.skills.slice(0, 3).map((skill: string) => (
                                <span key={skill} className="bg-gray-200 rounded px-2 py-1 text-xs text-gray-700">{skill}</span>
                              ))}
                              {s.skills && s.skills.length > 3 && (
                                <span className="bg-gray-200 rounded px-2 py-1 text-xs text-gray-700">+{s.skills.length - 3} more</span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500">Location: <span className="font-medium text-gray-700">{s.location}</span></div>
                            {s.competitions && s.competitions.length > 0 && (
                              <div className="text-xs text-gray-500">Competition: <span className="font-medium text-gray-700">{s.competitions[0]}</span></div>
                            )}
                            <div className="flex items-center justify-between mt-2">
                              <div></div>
                              <Button size="sm" className="ml-auto" onClick={() => handleProfileClick(s, 'student')}>Connect</Button>
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
                      <div className="text-center text-gray-500 py-8">Loading sent emails...</div>
                    ) : sentEmails.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">No sent emails yet.</div>
                    ) : (
                      <div className="space-y-4">
                        {sentEmails.map((email: any) => (
                          <div key={email.id} className="border rounded-lg p-4 bg-white shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                              <Mail className="h-4 w-4 text-blue-400" />
                              <span className="font-semibold text-gray-800">To:</span>
                              <span className="text-gray-700">{email.email_to}</span>
                              <span className="ml-auto text-xs text-gray-400">{new Date(email.sent_at).toLocaleString()}</span>
                            </div>
                            <div className="font-bold text-gray-900 mb-1">{email.subject}</div>
                            <div className="text-gray-700 whitespace-pre-line text-sm">{email.body}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {filtered.length === 0 && filteredStudents.length === 0 && <div className="text-center text-gray-500 mt-10">No mentors or students found.</div>}
              </TextFade>
            </div>
          </>
        )}
      </div>
      <ProfileModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} profile={selectedProfile} />
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full flex flex-col items-center gap-6 animate-fadeInUp">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Sign in or Sign up</h2>
            <p className="text-gray-500 text-center mb-4">Sign in or create an account to access Connect and start collaborating with mentors and students.</p>
            <div className="flex w-full gap-2">
              <SignInButton mode="modal">
                <button className="flex-1 py-2 rounded-lg border border-black text-black font-semibold bg-white hover:bg-gray-100 transition">Sign In</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="flex-1 py-2 rounded-lg bg-black text-white font-semibold hover:bg-gray-900 transition">Sign Up</button>
              </SignUpButton>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 