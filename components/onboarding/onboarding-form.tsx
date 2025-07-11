"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, AlertCircle, ArrowRight, ArrowLeft, User, Code, Target, Star } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { BackgroundGradient, FloatingShapes, TextFade } from "@/components/scroll-animations";
import Papa from 'papaparse';
import { RecommendedTeammatesModal } from "@/components/recommended-teammates-modal";
import Image from 'next/image';

interface CompetitionInterest {
  competitionId: string;
  interest: 'competing' | 'looking_for_partner' | 'looking_for_mentor';
}

interface OnboardingFormData {
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  gradeLevel: string;
  bio: string;
  skills: string;
  timeCommitment: string;
  collaborationStyle: string[];
  location: string;
  competitions: CompetitionInterest[];
  profileImageUrl?: string;
}

// Add RecommendedTeammate interface for type safety
interface RecommendedTeammate {
  user_id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  bio?: string;
  similarity: number;
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
        setCities(parsed.data.map((row: unknown) => ({ city: (row as { city: string, state_id: string }).city, state_id: (row as { city: string, state_id: string }).state_id })).filter((row: unknown) => (row as { city: string, state_id: string }).city && (row as { city: string, state_id: string }).state_id));
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

export function OnboardingForm() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const [imagePreview, setImagePreview] = useState<string>(user?.imageUrl || "");
  const [recommended, setRecommended] = useState<RecommendedTeammate[]>([]);
  const [showRecommended, setShowRecommended] = useState(false);
  const [selectedCompetitions] = useState<{ [key: string]: CompetitionInterest[] }>({}); // Remove setSelectedCompetitions
  const [formData, setFormData] = useState<OnboardingFormData>({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.emailAddresses?.[0]?.emailAddress || "",
    city: "",
    gradeLevel: "",
    bio: "",
    skills: "",
    timeCommitment: "",
    collaborationStyle: [],
    location: "",
    competitions: [],
  });
  // Move useEffect(() => { ... }, [currentStep]) above the early return
  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentStep]);
  // Wait for user to load or if user is null
  if (!isLoaded || !user) return <div>Loading...</div>;

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

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
        return formData.firstName && formData.lastName && formData.email && formData.city;
      case 2:
        return formData.skills.trim().length > 0;
      case 3:
        return formData.timeCommitment && formData.collaborationStyle.length > 0;
      case 4:
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
      // Convert selected competitions to the format expected by the API
      const competitionsArray = Object.values(selectedCompetitions).flat();

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
          city: formData.city,
          grade_level: formData.gradeLevel,
          bio: formData.bio,
          skills: formData.skills.split(',').map(s => s.trim()).filter(s => s.length > 0),
          time_commitment: formData.timeCommitment,
          collaboration_style: formData.collaborationStyle,
          location: formData.city, // Save city to location column as requested
          competitions: competitionsArray,
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
                    Welcome to <span className="text-indigo-400">Versate</span>
              </div>
                  <p className="text-lg md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Let&apos;s get to know you better so we can match you with the perfect teammates
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
                        <Label className="text-base font-normal text-black mb-2">Profile Picture (optional)</Label>
                        <div className="mb-2">
                          <Image
                            src={imagePreview || "/placeholder-user.jpg"}
                            alt="Profile Preview"
                            width={80}
                            height={80}
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
                      <div className="space-y-3">
                        <Label htmlFor="city" className="text-base font-normal text-black">City *</Label>
                        <CityDropdown value={formData.city || ''} onChange={val => setFormData(prev => ({ ...prev, city: val }))} />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <Label htmlFor="firstName" className="text-base font-normal text-black">First Name *</Label>
                          <Input id="firstName" value={formData.firstName} onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))} placeholder="Enter your first name" className="h-12 text-base border-2 border-gray-200 focus:border-indigo-400 rounded-xl px-4" />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="lastName" className="text-base font-normal text-black">Last Name *</Label>
                          <Input id="lastName" value={formData.lastName} onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))} placeholder="Enter your last name" className="h-12 text-base border-2 border-gray-200 focus:border-indigo-400 rounded-xl px-4" />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="email" className="text-base font-normal text-black">Email *</Label>
                        <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))} placeholder="Enter your email" className="h-12 text-base border-2 border-gray-200 focus:border-indigo-400 rounded-xl px-4" />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="gradeLevel" className="text-base font-normal text-black">Grade Level</Label>
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
                  )}
                {/* Step 2: Skills */}
                {currentStep === 2 && (
                    <div className="space-y-10 animate-fadeIn">
                    <div className="text-center mb-8">
                      <div className="flex items-center justify-center space-x-3 mb-4">
                          <Code className="h-8 w-8 text-indigo-500" />
                          <h2 className="text-2xl md:text-3xl font-semibold text-black">Skills & Expertise</h2>
                        </div>
                        <p className="text-lg text-gray-500">What are you good at? Separate each skill with a comma</p>
                      </div>
                    <div className="space-y-8">
                      <div className="space-y-3">
                          <Label className="text-base font-normal text-black">Your Skills *</Label>
                        <Textarea 
                          value={formData.skills} 
                          onChange={(e) => setFormData((prev) => ({ ...prev, skills: e.target.value }))} 
                          placeholder="e.g., JavaScript, Python, UI/UX Design, Project Management, Data Analysis..."
                          className="min-h-32 text-base border-2 border-gray-200 focus:border-indigo-400 rounded-xl px-4 resize-none"
                        />
                        <p className="text-sm text-gray-500">Examples: JavaScript, Python, UI/UX Design, Project Management, Data Analysis, Machine Learning, Graphic Design, etc.</p>
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
                          <h2 className="text-2xl md:text-3xl font-semibold text-black">Work Preferences</h2>
                        </div>
                        <p className="text-lg text-gray-500">How do you like to work and collaborate?</p>
                      </div>
                    <div className="space-y-8">
                        <div className="space-y-3">
                          <Label className="text-base font-normal text-black">Time Commitment *</Label>
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
                          <Label className="text-base font-normal text-black">Collaboration Style *</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {collaborationStyleOptions.map((style) => (
                            <div key={style} className="flex items-center space-x-3">
                                <Checkbox id={style} checked={formData.collaborationStyle.includes(style)} onCheckedChange={() => toggleArrayItem(formData.collaborationStyle, style, (collaborationStyle) => setFormData((prev) => ({ ...prev, collaborationStyle })))} className="border-2 border-gray-200 data-[state=checked]:border-indigo-500" />
                                <Label htmlFor={style} className="text-sm font-normal text-black cursor-pointer">
                                {style}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                  {/* Step 4: Bio */}
                  {currentStep === 4 && (
                    <div className="space-y-10 animate-fadeIn">
                      <div className="text-center mb-8">
                        <div className="flex items-center justify-center space-x-3 mb-4">
                          <Star className="h-8 w-8 text-indigo-500" />
                          <h2 className="text-2xl md:text-3xl font-semibold text-black">Tell Your Story</h2>
                        </div>
                        <p className="text-lg text-gray-500">Share a bit about yourself and what you&apos;re passionate about</p>
                      </div>
                      <div className="space-y-3">
                        <Label className="text-base font-normal text-black">Bio *</Label>
                        <Textarea id="bio" value={formData.bio} onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))} placeholder="Tell us about yourself, your interests, goals, and what you're looking for in a team..." className="min-h-32 text-base border-2 border-gray-200 focus:border-indigo-400 rounded-xl px-4 resize-none" />
                        <p className="text-sm text-gray-500">This will help other students understand who you are and what you bring to a team.</p>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg mt-6 animate-fadeIn">
                      <AlertCircle className="h-5 w-5 text-red-400" />
                      <p className="text-red-500 font-normal">{error}</p>
                  </div>
                )}

                {/* Navigation Buttons */}
                  <div className="flex flex-col md:flex-row justify-between items-center pt-10 gap-4 animate-fadeIn">
                    <Button variant="outline" size="lg" className="rounded-xl px-8 py-3 text-base font-normal border-gray-300 hover:bg-gray-100 transition-all" onClick={handleBack} disabled={currentStep === 1 || isSubmitting}>
                      <ArrowLeft className="mr-2 h-5 w-5" /> Back
                  </Button>
                    <Button size="lg" className="rounded-xl px-8 py-3 text-base font-normal bg-indigo-500 hover:bg-indigo-600 text-white shadow-md transition-all" onClick={handleNext} disabled={!isStepValid() || isSubmitting}>
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