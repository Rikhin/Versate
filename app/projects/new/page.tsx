"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Trophy, ArrowLeft, Code, Palette, Users, Rocket } from "lucide-react"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import Link from "next/link"

// Add Clerk imports:
import { UserButton } from "@clerk/nextjs"

export default function NewProjectPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    competition: "",
    category: "",
    deadline: undefined as Date | undefined,
    techStack: [] as string[],
    teamSize: { min: 2, max: 5 },
    roles: [] as string[],
    timeCommitment: "",
    isPublic: true,
    requirements: "",
  })

  const competitions = [
    "Congressional App Challenge",
    "Technovation Girls",
    "Regeneron ISEF",
    "Conrad Challenge",
    "Diamond Challenge",
    "DECA Competition",
    "RoboCupJunior",
    "eCYBERMISSION",
    "Other",
  ]

  const categories = ["STEM", "Computer Science", "Business & Entrepreneurship", "Innovation & Design"]

  const techOptions = [
    "JavaScript",
    "Python",
    "React",
    "Node.js",
    "TypeScript",
    "Java",
    "C++",
    "Swift",
    "Kotlin",
    "Flutter",
    "Vue.js",
    "Angular",
    "Machine Learning",
    "AI",
    "Data Science",
    "Blockchain",
    "Mobile Development",
    "Web Development",
    "Game Development",
  ]

  const roleOptions = [
    { id: "developer", label: "Developer", icon: Code },
    { id: "designer", label: "Designer", icon: Palette },
    { id: "manager", label: "Project Manager", icon: Users },
    { id: "founder", label: "Team Lead", icon: Rocket },
    { id: "researcher", label: "Researcher", icon: Trophy },
    { id: "marketer", label: "Marketing", icon: Users },
  ]

  const toggleTech = (tech: string) => {
    setFormData((prev) => ({
      ...prev,
      techStack: prev.techStack.includes(tech) ? prev.techStack.filter((t) => t !== tech) : [...prev.techStack, tech],
    }))
  }

  const toggleRole = (role: string) => {
    setFormData((prev) => ({
      ...prev,
      roles: prev.roles.includes(role) ? prev.roles.filter((r) => r !== role) : [...prev.roles, role],
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would save to your database
    console.log("Creating project:", formData)
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        {/* Update the header: */}
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <Link href="/" className="flex items-center space-x-2">
              <Trophy className="h-8 w-8 text-slate-600" />
              <span className="text-2xl font-bold text-slate-800">ColabBoard</span>
            </Link>
          </div>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-10 w-10",
              },
            }}
          />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Create New Project</h1>
          <p className="text-slate-600">Start a competition project and find your perfect teammates</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Project Details */}
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>Tell us about your competition project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter your project title"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your project, its goals, and what you hope to achieve..."
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="competition">Competition *</Label>
                  <Select
                    value={formData.competition}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, competition: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select competition" />
                    </SelectTrigger>
                    <SelectContent>
                      {competitions.map((comp) => (
                        <SelectItem key={comp} value={comp}>
                          {comp}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Deadline</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.deadline ? format(formData.deadline, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.deadline}
                      onSelect={(date) => setFormData((prev) => ({ ...prev, deadline: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
          </Card>

          {/* Tech Stack */}
          <Card>
            <CardHeader>
              <CardTitle>Tech Stack & Tools</CardTitle>
              <CardDescription>What technologies will you be using?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Label>Technologies (select all that apply)</Label>
                <div className="flex flex-wrap gap-2">
                  {techOptions.map((tech) => (
                    <Badge
                      key={tech}
                      variant={formData.techStack.includes(tech) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleTech(tech)}
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Team Requirements</CardTitle>
              <CardDescription>Define your ideal team composition</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minTeamSize">Minimum Team Size</Label>
                  <Select
                    value={formData.teamSize.min.toString()}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        teamSize: { ...prev.teamSize, min: Number.parseInt(value) },
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((size) => (
                        <SelectItem key={size} value={size.toString()}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxTeamSize">Maximum Team Size</Label>
                  <Select
                    value={formData.teamSize.max.toString()}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        teamSize: { ...prev.teamSize, max: Number.parseInt(value) },
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[2, 3, 4, 5, 6, 7, 8].map((size) => (
                        <SelectItem key={size} value={size.toString()}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Needed Roles</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {roleOptions.map((role) => (
                    <Card
                      key={role.id}
                      className={`cursor-pointer transition-colors ${
                        formData.roles.includes(role.id) ? "ring-2 ring-slate-800 bg-slate-50" : ""
                      }`}
                      onClick={() => toggleRole(role.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <role.icon className="h-5 w-5 text-slate-600" />
                          <span className="font-medium">{role.label}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeCommitment">Expected Time Commitment</Label>
                <RadioGroup
                  value={formData.timeCommitment}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, timeCommitment: value }))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="casual" id="casual" />
                    <Label htmlFor="casual">Casual (1-5 hours/week)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="moderate" id="moderate" />
                    <Label htmlFor="moderate">Moderate (5-15 hours/week)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="intensive" id="intensive" />
                    <Label htmlFor="intensive">Intensive (15+ hours/week)</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Additional Requirements</Label>
                <Textarea
                  id="requirements"
                  placeholder="Any specific skills, experience, or requirements for team members..."
                  value={formData.requirements}
                  onChange={(e) => setFormData((prev) => ({ ...prev, requirements: e.target.value }))}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Project Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Project Settings</CardTitle>
              <CardDescription>Configure how others can find and join your project</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPublic"
                  checked={formData.isPublic}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isPublic: checked as boolean }))}
                />
                <Label htmlFor="isPublic">Make this project public</Label>
              </div>
              <p className="text-sm text-slate-600 mt-2">
                Public projects can be discovered by other students. Private projects are only visible to invited
                members.
              </p>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Link href="/dashboard">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button type="submit" disabled={!formData.title || !formData.description || !formData.competition}>
              Create Project
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
