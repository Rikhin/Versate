"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Code, Palette, Users, Rocket, ArrowRight, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const { user } = useUser()
  const [formData, setFormData] = useState({
    school: "",
    grade: "",
    bio: "",
    skills: [] as string[],
    roles: [] as string[],
    experience: [] as string[],
    timeCommitment: "",
    collaborationStyle: [] as string[],
  })
  const router = useRouter()

  const skills = [
    "JavaScript",
    "Python",
    "React",
    "Node.js",
    "Machine Learning",
    "Data Science",
    "UI/UX Design",
    "Graphic Design",
    "Project Management",
    "Marketing",
    "Business Strategy",
    "Finance",
    "Research",
    "Writing",
    "Public Speaking",
  ]

  const roles = [
    { id: "developer", label: "Developer", icon: Code, description: "Build and code solutions" },
    { id: "designer", label: "Designer", icon: Palette, description: "Create visual designs and user experiences" },
    { id: "manager", label: "Project Manager", icon: Users, description: "Coordinate team and manage timelines" },
    { id: "founder", label: "Founder/Leader", icon: Rocket, description: "Lead vision and strategy" },
  ]

  const experiences = [
    "First-time competitor",
    "1-2 competitions",
    "3-5 competitions",
    "5+ competitions",
    "Competition winner",
  ]

  const collaborationStyles = ["Regular video calls", "Async communication", "In-person meetings", "Flexible schedule"]

  const toggleSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill) ? prev.skills.filter((s) => s !== skill) : [...prev.skills, skill],
    }))
  }

  const toggleRole = (role: string) => {
    setFormData((prev) => ({
      ...prev,
      roles: prev.roles.includes(role) ? prev.roles.filter((r) => r !== role) : [...prev.roles, role],
    }))
  }

  const toggleExperience = (exp: string) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.includes(exp) ? prev.experience.filter((e) => e !== exp) : [...prev.experience, exp],
    }))
  }

  const toggleCollaboration = (style: string) => {
    setFormData((prev) => ({
      ...prev,
      collaborationStyle: prev.collaborationStyle.includes(style)
        ? prev.collaborationStyle.filter((s) => s !== style)
        : [...prev.collaborationStyle, style],
    }))
  }

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      // Save profile and redirect to dashboard
      console.log("Profile data:", formData)
      router.push("/dashboard")
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const progress = (step / 3) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="container mx-auto max-w-2xl py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome to ColabBoard, {user?.firstName}!</h1>
          <p className="text-slate-600">Let's set up your profile to find the perfect teammates</p>
          <Progress value={progress} className="mt-4" />
          <p className="text-sm text-slate-500 mt-2">Step {step} of 3</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1 && "Basic Information"}
              {step === 2 && "Skills & Roles"}
              {step === 3 && "Experience & Preferences"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Tell us about your academic background"}
              {step === 2 && "What are your strengths and preferred roles?"}
              {step === 3 && "Help us understand your competition experience"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="school">School/University</Label>
                  <Input
                    id="school"
                    placeholder="Enter your school name"
                    value={formData.school}
                    onChange={(e) => setFormData((prev) => ({ ...prev, school: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grade">Grade Level</Label>
                  <Select
                    value={formData.grade}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, grade: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your grade level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high-school">High School</SelectItem>
                      <SelectItem value="freshman">College Freshman</SelectItem>
                      <SelectItem value="sophomore">College Sophomore</SelectItem>
                      <SelectItem value="junior">College Junior</SelectItem>
                      <SelectItem value="senior">College Senior</SelectItem>
                      <SelectItem value="graduate">Graduate Student</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself, your interests, and what you're passionate about..."
                    value={formData.bio}
                    onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                    rows={4}
                  />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="space-y-4">
                  <Label>Skills (select all that apply)</Label>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant={formData.skills.includes(skill) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleSkill(skill)}
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <Label>Preferred Roles</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {roles.map((role) => (
                      <Card
                        key={role.id}
                        className={`cursor-pointer transition-colors ${
                          formData.roles.includes(role.id) ? "ring-2 ring-slate-800 bg-slate-50" : ""
                        }`}
                        onClick={() => toggleRole(role.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <role.icon className="h-6 w-6 text-slate-600" />
                            <div>
                              <h3 className="font-semibold">{role.label}</h3>
                              <p className="text-sm text-slate-600">{role.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="space-y-4">
                  <Label>Competition Experience</Label>
                  <div className="space-y-2">
                    {experiences.map((exp) => (
                      <div key={exp} className="flex items-center space-x-2">
                        <Checkbox
                          id={exp}
                          checked={formData.experience.includes(exp)}
                          onCheckedChange={() => toggleExperience(exp)}
                        />
                        <Label htmlFor={exp}>{exp}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeCommitment">Time Commitment</Label>
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
                <div className="space-y-4">
                  <Label>Collaboration Preferences</Label>
                  <div className="space-y-2">
                    {collaborationStyles.map((style) => (
                      <div key={style} className="flex items-center space-x-2">
                        <Checkbox
                          id={style}
                          checked={formData.collaborationStyle.includes(style)}
                          onCheckedChange={() => toggleCollaboration(style)}
                        />
                        <Label htmlFor={style}>{style}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-between pt-6">
              <Button variant="outline" onClick={handleBack} disabled={step === 1}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={handleNext}>
                {step === 3 ? "Complete Setup" : "Next"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
