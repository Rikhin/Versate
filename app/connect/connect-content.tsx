'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loadAllMentors, MentorProfile } from "@/lib/csv-loader";
import { BackgroundGradient } from "@/components/scroll-animations/background-gradient";
import { FloatingShapes } from "@/components/scroll-animations/floating-shapes";
import { useAuth } from "@clerk/nextjs";
import { Badge } from "@/components/ui/badge";
import { Users, ExternalLink, Search, Mail } from "lucide-react";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { ProfileModal } from "@/components/connect/ProfileModal";
import { CustomDropdown } from "@/components/connect/CustomDropdown";

type ActiveTab = "mentor" | "student" | "emails";

interface Email {
  id: string;
  to: string;
  subject: string;
  body: string;
  sentAt: string;
}

export default function NewConnectPage() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  
  // State
  const [activeTab, setActiveTab] = useState<ActiveTab>("mentor");
  const [mentors, setMentors] = useState<MentorProfile[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [emails, setEmails] = useState<Email[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Filter states
  const [filterCompany, setFilterCompany] = useState("");
  const [filterJob, setFilterJob] = useState("");
  const [filterState, setFilterState] = useState("");
  const [filterYears, setFilterYears] = useState("");
  const [filterEmail, setFilterEmail] = useState("");
  
  // Load data on mount
  useEffect(() => {
    if (isSignedIn) {
      loadData();
    }
  }, [isSignedIn]);
  
  const loadData = async () => {
    try {
      setIsLoading(true);
      // Load mentors
      const mentorsData = await loadAllMentors();
      setMentors(mentorsData);
      
      // TODO: Load students and emails from API
      setStudents([]);
      setEmails([]);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleProfileClick = (profile: any) => {
    setSelectedProfile(profile);
    setIsModalOpen(true);
  };
  
  const clearFilters = () => {
    setSearch("");
    setFilterCompany("");
    setFilterJob("");
    setFilterState("");
    setFilterYears("");
    setFilterEmail("");
  };
  
  // Render sign-in prompt if not signed in
  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#1a1a2e] flex items-center justify-center p-4">
        <BackgroundGradient startColor="from-helix-blue/20" endColor="to-helix-dark-blue/20" />
        <FloatingShapes />
        <div className="relative z-10 w-full max-w-md mx-auto">
          <div className="glass border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end">
                Welcome to Connect
              </h1>
              <p className="text-helix-text-light">
                Sign in to connect with mentors and peers, collaborate on projects, and grow together.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <SignInButton mode="modal">
                <button className="w-full py-3 px-6 rounded-full bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end text-white font-bold hover:shadow-xl transition-all duration-300">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="w-full py-3 px-6 rounded-full border border-white/20 text-white font-bold hover:bg-white/10 transition-all duration-300">
                  Create Account
                </button>
              </SignUpButton>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Render main content if signed in
  return (
    <div className="w-full min-h-screen bg-helix-dark relative overflow-hidden">
      <BackgroundGradient startColor="from-helix-blue/20" endColor="to-helix-dark-blue/20" triggerStart="top center" triggerEnd="center center" />
      <FloatingShapes triggerStart="top center" triggerEnd="bottom center" />
      
      <div className="container mx-auto px-4 sm:px-6 py-16 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end bg-clip-text text-transparent mb-4">
            Connect
          </h1>
          <p className="text-xl text-helix-text-light max-w-3xl mx-auto">
            Find and connect with mentors, students, and collaborators to grow together.
          </p>
        </div>
        
        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Button
            variant={activeTab === "mentor" ? "default" : "outline"}
            onClick={() => setActiveTab("mentor")}
            className={`rounded-full px-6 py-2 ${
              activeTab === "mentor" 
                ? "bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end text-white" 
                : "border-white/20 text-white hover:bg-white/10"
            }`}
          >
            Mentors
          </Button>
          <Button
            variant={activeTab === "student" ? "default" : "outline"}
            onClick={() => setActiveTab("student")}
            className={`rounded-full px-6 py-2 ${
              activeTab === "student" 
                ? "bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end text-white" 
                : "border-white/20 text-white hover:bg-white/10"
            }`}
          >
            Students
          </Button>
          <Button
            variant={activeTab === "emails" ? "default" : "outline"}
            onClick={() => setActiveTab("emails")}
            className={`rounded-full px-6 py-2 ${
              activeTab === "emails" 
                ? "bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end text-white" 
                : "border-white/20 text-white hover:bg-white/10"
            }`}
          >
            Messages
          </Button>
        </div>
        
        {/* Content */}
        <div className="glass border border-white/10 rounded-xl p-6 mb-12">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-helix-gradient-start"></div>
            </div>
          ) : (
            <div>
              {activeTab === "mentor" && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Mentors</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mentors.map((mentor, index) => (
                      <Card 
                        key={`mentor-${index}`}
                        className="border-white/10 hover:border-helix-gradient-start/50 transition-all cursor-pointer"
                        onClick={() => handleProfileClick(mentor)}
                      >
                        <CardHeader>
                          <CardTitle className="text-white">
                            {mentor.name}
                          </CardTitle>
                          <p className="text-helix-text-light">{mentor.jobTitle}</p>
                        </CardHeader>
                        <CardContent>
                          {/* Remove skills mapping since MentorProfile does not have skills */}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
              
              {activeTab === "student" && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Students</h2>
                  <div className="text-center text-helix-text-light py-12">
                    <Users className="h-12 w-12 mx-auto mb-4 text-helix-gradient-start" />
                    <p>No students found. Check back later!</p>
                  </div>
                </div>
              )}
              
              {activeTab === "emails" && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Messages</h2>
                  <div className="text-center text-helix-text-light py-12">
                    <Mail className="h-12 w-12 mx-auto mb-4 text-helix-gradient-start" />
                    <p>No messages yet. Start a conversation!</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Profile Modal */}
      <ProfileModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        profile={selectedProfile} 
      />
    </div>
  );
} 