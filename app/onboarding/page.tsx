"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Trophy, User, Code, Target, ArrowRight, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: "",
    lastName: "",
    email: "",
    school: "",
    grade: "",
    major: "",

    // Skills & Interests
    skills: [] as string[],
    interests: [] as string[],
    experience: "",

    // Competition Preferences
    competitions: [] as string[],
    timeCommitment: "",
    teamPreference: "",
    goals: "",
  })

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  const skillOptions = [
    "JavaScript",
    "Python",
    "React",
    "Node.js",
    "TypeScript",
    "Java",
    "C++",
    "Swift",
    "Machine Learning",
    "AI",
    "Data Science",
    "UI/UX Design",
    "Graphic Design",
    "Project Management",
    "Business Strategy",
    "Marketing",
    "Research",
    "Writing",
  ]

  const interestOptions = [
    "Web Development",
    "Mobile Apps",
    "AI/Machine Learning",
    "Data Science",
    "Cybersecurity",
    "Game Development",
    "Robotics",
    "IoT",
    "Blockchain",
    "Business Innovation",
    "Social Impact",
    "Healthcare Tech",
    "Education Tech",
    "Environmental Solutions",
    "Fintech",
  ]

  const competitionOptions = [
    "Congressional App Challenge",
    "Technovation Girls",
    "Regeneron ISEF",
    "Conrad Challenge",
    "Diamond Challenge",
    "DECA Competition",
    "RoboCupJunior",
    "eCYBERMISSION",
    "Google Science Fair",
  ]

  const toggleArrayItem = (array: string[], item: string, setter: (value: string[]) => void) => {
    if (array.includes(item)) {
      setter(array.filter((i) => i !== item))
    } else {
      setter([...array, item])
    }
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete onboarding
      console.log("Onboarding completed:", formData)
      router.push("/dashboard")
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.firstName && formData.lastName && formData.email && formData.school
      case 2:
        return formData.skills.length > 0 && formData.interests.length > 0
      case 3:
        return formData.competitions.length > 0 && formData.timeCommitment
      case 4:
        return formData.goals.trim().length > 0
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Trophy className="h-8 w-8 text-slate-600" />
            <div>
              <span className="text-2xl font-bold text-slate-800">ColabBoard</span>
              <p className="text-xs text-slate-500 -mt-1">built by Rikhin Kavuru</p>
            </div>
          </Link>
          <div className="text-sm text-slate-600">
            Step {currentStep} of {totalSteps}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-slate-600 mb-2">
            <span>Getting Started</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <User className="h-6 w-6 text-blue-600" />
                <CardTitle>Personal Information</CardTitle>
              </div>
              <CardDescription>Tell us about yourself to help us find the perfect teammates for you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                    placeholder="Enter your first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="school">School/University *</Label>
                <Input
                  id="school"
                  value={formData.school}
                  onChange={(e) => setFormData((prev) => ({ ...prev, school: e.target.value }))}
                  placeholder="Enter your school or university name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="grade">Grade/Year</Label>
                  <Select
                    value={formData.grade}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, grade: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade/year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="9th">9th Grade</SelectItem>
                      <SelectItem value="10th">10th Grade</SelectItem>
                      <SelectItem value="11th">11th Grade</SelectItem>
                      <SelectItem value="12th">12th Grade</SelectItem>
                      <SelectItem value="freshman">College Freshman</SelectItem>
                      <SelectItem value="sophomore">College Sophomore</SelectItem>
                      <SelectItem value="junior">College Junior</SelectItem>
                      <SelectItem value="senior">College Senior</SelectItem>
                      <SelectItem value="graduate">Graduate Student</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="major">Major/Field of Study</Label>
                  <Input
                    id="major"
                    value={formData.major}
                    onChange={(e) => setFormData((prev) => ({ ...prev, major: e.target.value }))}
                    placeholder="e.g., Computer Science"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Skills & Interests */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Code className="h-6 w-6 text-green-600" />
                <CardTitle>Skills & Interests</CardTitle>
              </div>
              <CardDescription>
                Select your skills and areas of interest to match with relevant projects
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Technical Skills *</Label>
                <div className="flex flex-wrap gap-2">
                  {skillOptions.map((skill) => (
                    <Badge
                      key={skill}
                      variant={formData.skills.includes(skill) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() =>
                        toggleArrayItem(formData.skills, skill, (skills) =>
                          setFormData((prev) => ({ ...prev, skills })),
                        )
                      }
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label>Areas of Interest *</Label>
                <div className="flex flex-wrap gap-2">
                  {interestOptions.map((interest) => (
                    <Badge
                      key={interest}
                      variant={formData.interests.includes(interest) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() =>
                        toggleArrayItem(formData.interests, interest, (interests) =>
                          setFormData((prev) => ({ ...prev, interests })),
                        )
                      }
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Experience Level</Label>
                <Select
                  value={formData.experience}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, experience: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner (0-1 years)</SelectItem>
                    <SelectItem value="intermediate">Intermediate (1-3 years)</SelectItem>
                    <SelectItem value="advanced">Advanced (3+ years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Competition Preferences */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Trophy className="h-6 w-6 text-yellow-600" />
                <CardTitle>Competition Preferences</CardTitle>
              </div>
              <CardDescription>Let us know which competitions interest you and your availability</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Competitions of Interest *</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {competitionOptions.map((competition) => (
                    <div key={competition} className="flex items-center space-x-2">
                      <Checkbox
                        id={competition}
                        checked={formData.competitions.includes(competition)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData((prev) => ({
                              ...prev,
                              competitions: [...prev.competitions, competition],
                            }))
                          } else {
                            setFormData((prev) => ({
                              ...prev,
                              competitions: prev.competitions.filter((c) => c !== competition),
                            }))
                          }
                        }}
                      />
                      <Label htmlFor={competition} className="text-sm">
                        {competition}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeCommitment">Time Commitment *</Label>
                <Select
                  value={formData.timeCommitment}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, timeCommitment: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="How much time can you dedicate?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="casual">Casual (1-5 hours/week)</SelectItem>
                    <SelectItem value="moderate">Moderate (5-15 hours/week)</SelectItem>
                    <SelectItem value="intensive">Intensive (15+ hours/week)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="teamPreference">Team Preference</Label>
                <Select
                  value={formData.teamPreference}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, teamPreference: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="What's your preferred team size?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small teams (2-3 people)</SelectItem>
                    <SelectItem value="medium">Medium teams (4-5 people)</SelectItem>
                    <SelectItem value="large">Large teams (6+ people)</SelectItem>
                    <SelectItem value="flexible">I'm flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Goals & Motivation */}
        {currentStep === 4 && (
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Target className="h-6 w-6 text-purple-600" />
                <CardTitle>Goals & Motivation</CardTitle>
              </div>
              <CardDescription>
                Tell us about your goals and what you hope to achieve through competitions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="goals">What are your goals for participating in competitions? *</Label>
                <Textarea
                  id="goals"
                  value={formData.goals}
                  onChange={(e) => setFormData((prev) => ({ ...prev, goals: e.target.value }))}
                  placeholder="Share your motivations, what you hope to learn, achieve, or the impact you want to make..."
                  rows={4}
                />
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-medium text-slate-800 mb-2">What happens next?</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• We'll create your personalized profile</li>
                  <li>• You'll get matched with relevant projects and teammates</li>
                  <li>• Start collaborating on exciting competition projects</li>
                  <li>• Build your portfolio and gain valuable experience</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button onClick={handleNext} disabled={!isStepValid()}>
            {currentStep === totalSteps ? "Complete Setup" : "Next"}
            {currentStep < totalSteps && <ArrowRight className="h-4 w-4 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
