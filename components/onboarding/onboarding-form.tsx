"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { User, Code, Trophy, Target, ArrowRight, ArrowLeft, Loader2, AlertCircle, MapPin, School, Calendar, Star } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { BackgroundGradient, FloatingShapes, TextFade } from "@/components/scroll-animations";
import Papa from 'papaparse';
import { competitions } from '@/lib/competitions-data';
import { RecommendedTeammatesModal } from "@/components/recommended-teammates-modal";

interface CompetitionInterest {
  competitionId: string;
  interest: 'competing' | 'looking_for_partner' | 'looking_for_mentor';
}

interface OnboardingFormData {
  firstName: string;
  lastName: string;
  email: string;
  school: string;
  gradeLevel: string;
  bio: string;
  skills: string[];
  roles: string[];
  experienceLevel: string;
  timeCommitment: string;
  collaborationStyle: string[];
  location: string;
  competitions: CompetitionInterest[];
  otherCompetitionName?: string;
  otherCompeting?: boolean;
  otherNeedPartner?: boolean;
  otherNeedMentor?: boolean;
  profileImageUrl?: string;
  state: string;
}

function CityDropdown({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  const [cities, setCities] = useState<{ city: string, state_id: string }[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/uscities.csv')
      .then(res => res.text())
      .then(text => {
        const parsed = Papa.parse(text, { header: true });
        setCities(parsed.data.map((row: any) => ({ city: row.city, state_id: row.state_id })).filter((row: any) => row.city && row.state_id));
        setLoading(false);
      });
  }, []);

  const filtered = cities.filter(({ city, state_id }) =>
    `${city}, ${state_id}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative">
      <Input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Type city, ST..."
        aria-label="Type city, ST (e.g., San Jose, CA)"
        className="h-12 text-base border-2 border-gray-200 focus:border-indigo-400 rounded-xl px-4 mb-2"
      />
      <span className="sr-only">Type city, ST (e.g., San Jose, CA)</span>
      <div className="max-h-40 overflow-y-auto border rounded-xl bg-white shadow-md">
        {loading ? (
          <div className="p-2 text-gray-500">Loading cities...</div>
        ) : filtered.length === 0 ? (
          <div className="p-2 text-gray-500">No results</div>
        ) : (
          filtered.slice(0, 10).map(({ city, state_id }) => {
            const label = `${city}, ${state_id}`;
            return (
              <div
                key={label}
                className={`p-2 cursor-pointer hover:bg-indigo-100 ${label === value ? 'bg-indigo-200 font-bold' : ''}`}
                onClick={() => { onChange(label); setSearch(label); }}
              >
                {label}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function StateDropdown({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  const [states, setStates] = useState<{ abbr: string, name: string }[]>([]);
  const [search, setSearch] = useState('');
  useEffect(() => {
    fetch('/state_abbreviations.csv')
      .then(res => res.text())
      .then(text => {
        const parsed = Papa.parse(text, { header: false });
        setStates(parsed.data.filter((row: any) => row[0] && row[1]).map((row: any) => ({ abbr: row[0].replace(/"/g, ''), name: row[1].replace(/"/g, '') })));
      });
  }, []);
  const filtered = states.filter(({ abbr, name }) =>
    abbr.toLowerCase().includes(search.toLowerCase()) || name.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="relative">
      <Input
        value={search || value}
        onChange={e => setSearch(e.target.value)}
        placeholder="Type state or abbreviation..."
        aria-label="Type state or abbreviation (e.g., CA or California)"
        className="h-12 text-base border-2 border-gray-200 focus:border-indigo-400 rounded-xl px-4 mb-2"
      />
      <span className="sr-only">Type state or abbreviation (e.g., CA or California)</span>
      <div className="max-h-40 overflow-y-auto border rounded-xl bg-white shadow-md">
        {filtered.length === 0 ? (
          <div className="p-2 text-gray-500">No results</div>
        ) : (
          filtered.map(({ abbr, name }) => (
            <div
              key={abbr}
              className={`p-2 cursor-pointer hover:bg-indigo-100 ${name === value ? 'bg-indigo-200 font-bold' : ''}`}
              onClick={() => { onChange(name); setSearch(name); }}
            >
              {name} ({abbr})
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export function OnboardingForm() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const [imagePreview, setImagePreview] = useState<string>(user?.imageUrl || "");
  const [recommended, setRecommended] = useState<any[]>([]);
  const [showRecommended, setShowRecommended] = useState(false);

  // Wait for user to load or if user is null
  if (!isLoaded || !user) return <div>Loading...</div>;

  const [formData, setFormData] = useState<OnboardingFormData>({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.emailAddresses?.[0]?.emailAddress || "",
    school: "",
    gradeLevel: "",
    bio: "",
    skills: [],
    roles: [],
    experienceLevel: "",
    timeCommitment: "",
    collaborationStyle: [],
    location: "",
    competitions: [],
    state: "",
  });

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const skillOptions = [
    "JavaScript", "Python", "React", "Node.js", "TypeScript", "Java", "C++", "Swift",
    "Machine Learning", "AI", "Data Science", "UI/UX Design", "Graphic Design",
    "Project Management", "Business Strategy", "Marketing", "Research", "Writing",
    "Mobile Development", "Web Development", "Database Design", "DevOps",
    "Cybersecurity", "Blockchain", "IoT", "Robotics"
  ];

  const roleOptions = [
    "Developer", "Designer", "Project Manager", "Researcher", "Business Analyst",
    "Data Scientist", "UI/UX Designer", "Marketing Specialist", "Content Creator",
    "Team Lead", "Mentor", "Student"
  ];

  const collaborationStyleOptions = [
    "Leadership", "Collaborative", "Independent", "Mentoring", "Learning-focused",
    "Results-driven", "Creative", "Analytical", "Communication-focused"
  ];

  const toggleArrayItem = (array: string[], item: string, setter: (value: string[]) => void) => {
    if (array.includes(item)) {
      setter(array.filter((i) => i !== item));
    } else {
      setter([...array, item]);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.firstName && formData.lastName && formData.email && formData.school && formData.state;
      case 2:
        return formData.skills.length > 0 && formData.roles.length > 0;
      case 3:
        return formData.timeCommitment && formData.collaborationStyle.length > 0;
      case 4: {
        // At least one competition or a valid 'Other' selection
        const hasCompetition = formData.competitions.length > 0;
        const hasOther = formData.otherCompetitionName && (
          formData.otherCompeting || formData.otherNeedPartner || formData.otherNeedMentor
        );
        return hasCompetition || hasOther;
      }
      case 5:
        return formData.bio.trim().length > 0;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!isStepValid()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // Prepare competitions array, including 'Other' if filled
      let competitions = [...formData.competitions];
      if (
        formData.otherCompetitionName &&
        (formData.otherCompeting || formData.otherNeedPartner || formData.otherNeedMentor)
      ) {
        if (formData.otherCompeting) {
          competitions.push({ competitionId: `other:${formData.otherCompetitionName}`, interest: 'competing' });
        }
        if (formData.otherNeedPartner) {
          competitions.push({ competitionId: `other:${formData.otherCompetitionName}`, interest: 'looking_for_partner' });
        }
        if (formData.otherNeedMentor) {
          competitions.push({ competitionId: `other:${formData.otherCompetitionName}`, interest: 'looking_for_mentor' });
        }
      }

      const response = await fetch("/api/profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          school: formData.school,
          grade_level: formData.gradeLevel,
          bio: formData.bio,
          skills: formData.skills,
          roles: formData.roles,
          experience_level: formData.experienceLevel,
          time_commitment: formData.timeCommitment,
          collaboration_style: formData.collaborationStyle,
          location: formData.location,
          competitions,
          profile_image_url: formData.profileImageUrl || user.imageUrl || "",
        }),
      });

      if (response.ok) {
        // After successful onboarding, fetch recommended teammates
        const res = await fetch("/api/ai-match", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id })
        });
        if (res.ok) {
          const data = await res.json();
          setRecommended(data.matches);
          setShowRecommended(true);
        }
        router.push("/dashboard");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create profile");
      }
    } catch (error) {
      console.error("Error creating profile:", error);
      setError(error instanceof Error ? error.message : "Failed to create profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentStep]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/60 to-indigo-100/60 dark:from-zinc-900 dark:to-zinc-950 flex items-center justify-center px-2 py-8">
      <BackgroundGradient startColor="from-gray-50/50" endColor="to-gray-100/50" triggerStart="top center" triggerEnd="center center" />
      <FloatingShapes count={3} triggerStart="top center" triggerEnd="bottom center" />
      <div className="relative z-10 flex items-center justify-center w-full mx-auto" style={{ maxWidth: '80vw' }}>
        <Card className="w-full rounded-3xl shadow-2xl border-0 bg-white/90 dark:bg-zinc-900/90 transition-all duration-500">
          <CardContent className="p-0">
            <div className="p-8 md:p-12">
          <TextFade triggerStart="top 80%" triggerEnd="center center" stagger={0.1}>
            {/* Header */}
                <div ref={topRef} className="text-center mb-10">
                  <div className="text-5xl md:text-6xl font-extrabold text-black mb-6 leading-tight tracking-tight">
                    Welcome to <span className="text-indigo-400">Versa</span>
              </div>
                  <p className="text-lg md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Let's get to know you better so we can match you with the perfect teammates
              </p>
            </div>

            {/* Progress Bar */}
                <div className="mb-10">
                  <div className="flex justify-between text-xs md:text-sm text-gray-600 mb-2">
                    <span className="font-semibold uppercase tracking-widest">Step {currentStep} of {totalSteps}</span>
                    <span className="font-semibold uppercase tracking-widest">{Math.round(progress)}% Complete</span>
              </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-indigo-500 h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
              </div>
            </div>

                {/* Form Steps with fade-in transition */}
                <div className="transition-opacity duration-500" style={{ opacity: 1 }}>
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                    <div className="space-y-10 animate-fadeIn">
                    <div className="text-center mb-8">
                      <div className="flex items-center justify-center space-x-3 mb-4">
                          <User className="h-8 w-8 text-indigo-500" />
                          <h2 className="text-2xl md:text-3xl font-semibold text-black">Personal Information</h2>
                        </div>
                        <p className="text-lg text-gray-500">Tell us about yourself to help us find the perfect teammates</p>
                      </div>
                      <div className="flex flex-col items-center mb-6">
                        <Label className="text-base font-medium text-black mb-2">Profile Picture (optional)</Label>
                        <div className="mb-2">
                          <img
                            src={imagePreview || "/placeholder-user.jpg"}
                            alt="Profile Preview"
                            className="h-20 w-20 rounded-full object-cover border-2 border-gray-200"
                          />
                    </div>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const formDataObj = new FormData();
                              formDataObj.append("file", file);
                              // Upload to /api/upload, get URL
                              const res = await fetch("/api/upload", { method: "POST", body: formDataObj });
                              const data = await res.json();
                              setFormData((prev) => ({ ...prev, profileImageUrl: data.url }));
                              setImagePreview(data.url);
                            }
                          }}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <Label htmlFor="firstName" className="text-base font-medium text-black">First Name *</Label>
                          <Input id="firstName" value={formData.firstName} onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))} placeholder="Enter your first name" className="h-12 text-base border-2 border-gray-200 focus:border-indigo-400 rounded-xl px-4" />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="lastName" className="text-base font-medium text-black">Last Name *</Label>
                          <Input id="lastName" value={formData.lastName} onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))} placeholder="Enter your last name" className="h-12 text-base border-2 border-gray-200 focus:border-indigo-400 rounded-xl px-4" />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="email" className="text-base font-medium text-black">Email *</Label>
                        <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))} placeholder="Enter your email" className="h-12 text-base border-2 border-gray-200 focus:border-indigo-400 rounded-xl px-4" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <Label htmlFor="school" className="text-base font-medium text-black">School *</Label>
                          <Input id="school" value={formData.school} onChange={(e) => setFormData((prev) => ({ ...prev, school: e.target.value }))} placeholder="Enter your school name (City, ST)" aria-label="Enter your school name in the format: City, ST" className="h-12 text-base border-2 border-gray-200 focus:border-indigo-400 rounded-xl px-4" />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="gradeLevel" className="text-base font-medium text-black">Grade Level</Label>
                        <Select value={formData.gradeLevel} onValueChange={(value) => setFormData((prev) => ({ ...prev, gradeLevel: value }))}>
                            <SelectTrigger className="h-12 text-base border-2 border-gray-200 focus:border-indigo-400 rounded-xl px-4">
                            <SelectValue placeholder="Select your grade level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="9th Grade">9th Grade</SelectItem>
                            <SelectItem value="10th Grade">10th Grade</SelectItem>
                            <SelectItem value="11th Grade">11th Grade</SelectItem>
                            <SelectItem value="12th Grade">12th Grade</SelectItem>
                            <SelectItem value="College Freshman">College Freshman</SelectItem>
                            <SelectItem value="College Sophomore">College Sophomore</SelectItem>
                            <SelectItem value="College Junior">College Junior</SelectItem>
                            <SelectItem value="College Senior">College Senior</SelectItem>
                            <SelectItem value="Graduate Student">Graduate Student</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                      <div className="space-y-3">
                        <Label htmlFor="state" className="text-base font-medium text-black">State *</Label>
                        <StateDropdown value={formData.state || ''} onChange={val => setFormData(prev => ({ ...prev, state: val }))} />
                    </div>
                  </div>
                )}
                {/* Step 2: Skills & Roles */}
                {currentStep === 2 && (
                    <div className="space-y-10 animate-fadeIn">
                    <div className="text-center mb-8">
                      <div className="flex items-center justify-center space-x-3 mb-4">
                          <Code className="h-8 w-8 text-indigo-500" />
                          <h2 className="text-2xl md:text-3xl font-semibold text-black">Skills & Roles</h2>
                        </div>
                        <p className="text-lg text-gray-500">What are you good at and what roles do you prefer?</p>
                      </div>
                    <div className="space-y-8">
                      <div>
                          <Label className="text-base font-medium text-black mb-2 block">Select Your Skills *</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {skillOptions.map((skill) => (
                            <div key={skill} className="flex items-center space-x-3">
                                <Checkbox id={skill} checked={formData.skills.includes(skill)} onCheckedChange={() => toggleArrayItem(formData.skills, skill, (skills) => setFormData((prev) => ({ ...prev, skills })))} className="border-2 border-gray-200 data-[state=checked]:border-indigo-500" />
                                <Label htmlFor={skill} className="text-sm font-medium text-black cursor-pointer">
                                {skill}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                          <Label className="text-base font-medium text-black mb-2 block">Preferred Roles *</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {roleOptions.map((role) => (
                            <div key={role} className="flex items-center space-x-3">
                                <Checkbox id={role} checked={formData.roles.includes(role)} onCheckedChange={() => toggleArrayItem(formData.roles, role, (roles) => setFormData((prev) => ({ ...prev, roles })))} className="border-2 border-gray-200 data-[state=checked]:border-indigo-500" />
                                <Label htmlFor={role} className="text-sm font-medium text-black cursor-pointer">
                                {role}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                        <div className="space-y-3">
                          <Label htmlFor="experienceLevel" className="text-base font-medium text-black">Experience Level</Label>
                        <Select value={formData.experienceLevel} onValueChange={(value) => setFormData((prev) => ({ ...prev, experienceLevel: value }))}>
                            <SelectTrigger className="h-12 text-base border-2 border-gray-200 focus:border-indigo-400 rounded-xl px-4">
                            <SelectValue placeholder="Select your experience level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Beginner">Beginner</SelectItem>
                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                            <SelectItem value="Advanced">Advanced</SelectItem>
                            <SelectItem value="Expert">Expert</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}
                {/* Step 3: Preferences */}
                {currentStep === 3 && (
                    <div className="space-y-10 animate-fadeIn">
                    <div className="text-center mb-8">
                      <div className="flex items-center justify-center space-x-3 mb-4">
                          <Target className="h-8 w-8 text-indigo-500" />
                          <h2 className="text-2xl md:text-3xl font-semibold text-black">Preferences</h2>
                        </div>
                        <p className="text-lg text-gray-500">How do you like to work and collaborate?</p>
                      </div>
                    <div className="space-y-8">
                        <div className="space-y-3">
                          <Label htmlFor="timeCommitment" className="text-base font-medium text-black">Time Commitment *</Label>
                        <Select value={formData.timeCommitment} onValueChange={(value) => setFormData((prev) => ({ ...prev, timeCommitment: value }))}>
                            <SelectTrigger className="h-12 text-base border-2 border-gray-200 focus:border-indigo-400 rounded-xl px-4">
                            <SelectValue placeholder="Select your time commitment" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-5 hours/week">1-5 hours/week</SelectItem>
                            <SelectItem value="5-10 hours/week">5-10 hours/week</SelectItem>
                            <SelectItem value="10-20 hours/week">10-20 hours/week</SelectItem>
                            <SelectItem value="20+ hours/week">20+ hours/week</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                          <Label className="text-base font-medium text-black mb-2 block">Collaboration Style *</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {collaborationStyleOptions.map((style) => (
                            <div key={style} className="flex items-center space-x-3">
                                <Checkbox id={style} checked={formData.collaborationStyle.includes(style)} onCheckedChange={() => toggleArrayItem(formData.collaborationStyle, style, (collaborationStyle) => setFormData((prev) => ({ ...prev, collaborationStyle })))} className="border-2 border-gray-200 data-[state=checked]:border-indigo-500" />
                                <Label htmlFor={style} className="text-sm font-medium text-black cursor-pointer">
                                {style}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                  {/* Step 4: Competition Interests */}
                {currentStep === 4 && (
                    <div className="space-y-10 animate-fadeIn">
                    <div className="text-center mb-8">
                      <div className="flex items-center justify-center space-x-3 mb-4">
                          <Trophy className="h-8 w-8 text-indigo-500" />
                          <h2 className="text-2xl md:text-3xl font-semibold text-black">Competitions & Interests</h2>
                        </div>
                        <p className="text-lg text-gray-500">Select the competitions you're interested in and your goal for each.</p>
                      </div>
                      <div className="flex flex-wrap gap-6 justify-center w-full">
                        {competitions.map((comp) => {
                          const selected = formData.competitions.filter(c => c.competitionId === comp.id);
                          const isChecked = (interest: string) => selected.some(s => s.interest === interest);
                          const handleCheck = (interest: string, checked: boolean) => {
                            setFormData(prev => {
                              let competitions = prev.competitions.filter(c => !(c.competitionId === comp.id && c.interest === interest));
                              if (checked) competitions = [...competitions, { competitionId: comp.id, interest: interest as any }];
                              return { ...prev, competitions };
                            });
                          };
                          return (
                            <div key={comp.id} className="flex flex-col items-center bg-gray-50 dark:bg-zinc-800 rounded-2xl p-4 min-w-[220px] max-w-xs w-full shadow-md border border-gray-200 dark:border-zinc-700">
                              <span className="font-bold text-lg mb-2">{comp.icon} {comp.name}</span>
                              <div className="flex flex-row gap-3 mt-2">
                                <label className="flex items-center gap-1 text-sm">
                                  <input type="checkbox" checked={isChecked('competing')} onChange={e => handleCheck('competing', e.target.checked)} /> Competing
                                </label>
                                <label className="flex items-center gap-1 text-sm">
                                  <input type="checkbox" checked={isChecked('looking_for_partner')} onChange={e => handleCheck('looking_for_partner', e.target.checked)} /> Need Partner
                                </label>
                                <label className="flex items-center gap-1 text-sm">
                                  <input type="checkbox" checked={isChecked('looking_for_mentor')} onChange={e => handleCheck('looking_for_mentor', e.target.checked)} /> Need Mentor
                                </label>
                              </div>
                            </div>
                          );
                        })}
                        {/* Other option */}
                        <div className="flex flex-col items-center bg-gray-50 dark:bg-zinc-800 rounded-2xl p-4 min-w-[220px] max-w-xs w-full shadow-md border border-gray-200 dark:border-zinc-700">
                          <span className="font-bold text-lg mb-2">Other</span>
                          <Input
                            value={formData.otherCompetitionName || ''}
                            onChange={e => setFormData(prev => ({ ...prev, otherCompetitionName: e.target.value }))}
                            placeholder="Competition name"
                            className="mb-2 h-10 text-base border-2 border-gray-200 focus:border-indigo-400 rounded-xl px-3"
                          />
                          <div className="flex flex-row gap-3 mt-2">
                            <label className="flex items-center gap-1 text-sm">
                              <input type="checkbox" checked={formData.otherCompeting || false} onChange={e => setFormData(prev => ({ ...prev, otherCompeting: e.target.checked }))} /> Competing
                            </label>
                            <label className="flex items-center gap-1 text-sm">
                              <input type="checkbox" checked={formData.otherNeedPartner || false} onChange={e => setFormData(prev => ({ ...prev, otherNeedPartner: e.target.checked }))} /> Need Partner
                            </label>
                            <label className="flex items-center gap-1 text-sm">
                              <input type="checkbox" checked={formData.otherNeedMentor || false} onChange={e => setFormData(prev => ({ ...prev, otherNeedMentor: e.target.checked }))} /> Need Mentor
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Step 5: Bio */}
                  {currentStep === 5 && (
                    <div className="space-y-10 animate-fadeIn">
                      <div className="text-center mb-8">
                        <div className="flex items-center justify-center space-x-3 mb-4">
                          <Star className="h-8 w-8 text-indigo-500" />
                          <h2 className="text-2xl md:text-3xl font-semibold text-black">Tell Your Story</h2>
                        </div>
                        <p className="text-lg text-gray-500">Share a bit about yourself and what you're passionate about</p>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="bio" className="text-base font-medium text-black">Bio *</Label>
                        <Textarea id="bio" value={formData.bio} onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))} placeholder="Tell us about yourself, your interests, goals, and what you're looking for in a team..." className="min-h-32 text-base border-2 border-gray-200 focus:border-indigo-400 rounded-xl px-4 resize-none" />
                        <p className="text-sm text-gray-500">This will help other students understand who you are and what you bring to a team.</p>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg mt-6 animate-fadeIn">
                      <AlertCircle className="h-5 w-5 text-red-400" />
                      <p className="text-red-500 font-semibold">{error}</p>
                  </div>
                )}

                {/* Navigation Buttons */}
                  <div className="flex flex-col md:flex-row justify-between items-center pt-10 gap-4 animate-fadeIn">
                    <Button variant="outline" size="lg" className="rounded-xl px-8 py-3 text-base font-semibold border-gray-300 hover:bg-gray-100 transition-all" onClick={handleBack} disabled={currentStep === 1 || isSubmitting}>
                      <ArrowLeft className="mr-2 h-5 w-5" /> Back
                  </Button>
                    <Button size="lg" className="rounded-xl px-8 py-3 text-base font-semibold bg-indigo-500 hover:bg-indigo-600 text-white shadow-md transition-all" onClick={handleNext} disabled={!isStepValid() || isSubmitting}>
                      {isSubmitting ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : currentStep === totalSteps ? "Finish" : "Next"}
                      {currentStep !== totalSteps && <ArrowRight className="ml-2 h-5 w-5" />}
                  </Button>
                  </div>
                </div>
              </TextFade>
                </div>
              </CardContent>
            </Card>
      </div>
      {showRecommended && (
        <RecommendedTeammatesModal matches={recommended} onClose={() => setShowRecommended(false)} />
      )}
    </div>
  );
} 