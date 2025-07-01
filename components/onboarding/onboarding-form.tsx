"use client";

import { useState } from "react";
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
}

export function OnboardingForm() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
  });

  const totalSteps = 4;
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
        return formData.firstName && formData.lastName && formData.email && formData.school;
      case 2:
        return formData.skills.length > 0 && formData.roles.length > 0;
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
        }),
      });

      if (response.ok) {
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
      <div className="relative z-10 flex items-center justify-center w-full max-w-2xl mx-auto">
        <Card className="w-full rounded-3xl shadow-2xl border-0 bg-white/90 dark:bg-zinc-900/90 transition-all duration-500">
          <CardContent className="p-0">
            <div className="p-8 md:p-12">
              <TextFade triggerStart="top 80%" triggerEnd="center center" stagger={0.1}>
                {/* Header */}
                <div className="text-center mb-10">
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
                          <h2 className="text-2xl md:text-3xl font-bold text-black">Personal Information</h2>
                        </div>
                        <p className="text-lg text-gray-500">Tell us about yourself to help us find the perfect teammates</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <Label htmlFor="firstName" className="text-base font-semibold text-black">First Name *</Label>
                          <Input id="firstName" value={formData.firstName} onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))} placeholder="Enter your first name" className="h-12 text-base border-2 border-gray-200 focus:border-indigo-400 rounded-xl px-4" />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="lastName" className="text-base font-semibold text-black">Last Name *</Label>
                          <Input id="lastName" value={formData.lastName} onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))} placeholder="Enter your last name" className="h-12 text-base border-2 border-gray-200 focus:border-indigo-400 rounded-xl px-4" />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="email" className="text-base font-semibold text-black">Email *</Label>
                        <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))} placeholder="Enter your email" className="h-12 text-base border-2 border-gray-200 focus:border-indigo-400 rounded-xl px-4" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <Label htmlFor="school" className="text-base font-semibold text-black">School *</Label>
                          <Input id="school" value={formData.school} onChange={(e) => setFormData((prev) => ({ ...prev, school: e.target.value }))} placeholder="Enter your school name" className="h-12 text-base border-2 border-gray-200 focus:border-indigo-400 rounded-xl px-4" />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="gradeLevel" className="text-base font-semibold text-black">Grade Level</Label>
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
                        <Label htmlFor="location" className="text-base font-semibold text-black">Location</Label>
                        <Input id="location" value={formData.location} onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))} placeholder="Enter your city, state, or country" className="h-12 text-base border-2 border-gray-200 focus:border-indigo-400 rounded-xl px-4" />
                      </div>
                    </div>
                  )}
                  {/* Step 2: Skills & Roles */}
                  {currentStep === 2 && (
                    <div className="space-y-10 animate-fadeIn">
                      <div className="text-center mb-8">
                        <div className="flex items-center justify-center space-x-3 mb-4">
                          <Code className="h-8 w-8 text-indigo-500" />
                          <h2 className="text-2xl md:text-3xl font-bold text-black">Skills & Roles</h2>
                        </div>
                        <p className="text-lg text-gray-500">What are you good at and what roles do you prefer?</p>
                      </div>
                      <div className="space-y-8">
                        <div>
                          <Label className="text-base font-semibold text-black mb-2 block">Select Your Skills *</Label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {skillOptions.map((skill) => (
                              <div key={skill} className="flex items-center space-x-3">
                                <Checkbox id={skill} checked={formData.skills.includes(skill)} onCheckedChange={() => toggleArrayItem(formData.skills, skill, (skills) => setFormData((prev) => ({ ...prev, skills })))} className="border-2 border-gray-200 data-[state=checked]:border-indigo-500" />
                                <Label htmlFor={skill} className="text-sm font-semibold text-black cursor-pointer">
                                  {skill}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <Label className="text-base font-semibold text-black mb-2 block">Preferred Roles *</Label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {roleOptions.map((role) => (
                              <div key={role} className="flex items-center space-x-3">
                                <Checkbox id={role} checked={formData.roles.includes(role)} onCheckedChange={() => toggleArrayItem(formData.roles, role, (roles) => setFormData((prev) => ({ ...prev, roles })))} className="border-2 border-gray-200 data-[state=checked]:border-indigo-500" />
                                <Label htmlFor={role} className="text-sm font-semibold text-black cursor-pointer">
                                  {role}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="experienceLevel" className="text-base font-semibold text-black">Experience Level</Label>
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
                          <h2 className="text-2xl md:text-3xl font-bold text-black">Preferences</h2>
                        </div>
                        <p className="text-lg text-gray-500">How do you like to work and collaborate?</p>
                      </div>
                      <div className="space-y-8">
                        <div className="space-y-3">
                          <Label htmlFor="timeCommitment" className="text-base font-semibold text-black">Time Commitment *</Label>
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
                          <Label className="text-base font-semibold text-black mb-2 block">Collaboration Style *</Label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {collaborationStyleOptions.map((style) => (
                              <div key={style} className="flex items-center space-x-3">
                                <Checkbox id={style} checked={formData.collaborationStyle.includes(style)} onCheckedChange={() => toggleArrayItem(formData.collaborationStyle, style, (collaborationStyle) => setFormData((prev) => ({ ...prev, collaborationStyle })))} className="border-2 border-gray-200 data-[state=checked]:border-indigo-500" />
                                <Label htmlFor={style} className="text-sm font-semibold text-black cursor-pointer">
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
                          <h2 className="text-2xl md:text-3xl font-bold text-black">Tell Your Story</h2>
                        </div>
                        <p className="text-lg text-gray-500">Share a bit about yourself and what you're passionate about</p>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="bio" className="text-base font-semibold text-black">Bio *</Label>
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
    </div>
  );
} 