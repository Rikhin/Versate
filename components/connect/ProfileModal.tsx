"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Mail, Building, Briefcase, MapPin, Link as LinkIcon, User, GraduationCap, BookOpen, Send } from "lucide-react"

interface ProfileData {
  name: string
  email: string
  company?: string
  jobTitle?: string
  yearsExperience?: string
  state?: string
  linkedin?: string
  type: "mentor" | "student"
  school?: string
  grade?: string
  interests?: string[]
  userId?: string
}

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
  profile: ProfileData | null
}

export function ProfileModal({ isOpen, onClose, profile }: ProfileModalProps) {
  const [emailSubject, setEmailSubject] = useState("")
  const [emailBody, setEmailBody] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)

  useEffect(() => {
    // Fetch current user's profile
    const fetchUserProfile = async () => {
      try {
        const res = await fetch("/api/profile/me")
        if (res.ok) {
          const data = await res.json()
          setUserProfile(data)
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error)
      }
    }

    if (isOpen) {
      fetchUserProfile()
    }
  }, [isOpen])

  const generateEmail = async () => {
    if (!profile || !userProfile) return
    
    setIsGenerating(true)
    try {
      const res = await fetch("/api/ai/generate-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userProfile, mentorProfile: profile })
      })
      const data = await res.json()
      if (res.ok && data.subject && data.body) {
        setEmailSubject(data.subject)
        setEmailBody(data.body)
      } else {
        alert(data.error || "Failed to generate email. Please try again.")
      }
    } catch (error) {
      console.error("Error generating email:", error)
      alert("Failed to generate email. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  if (!profile) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {profile.name}
            <Badge variant={profile.type === "mentor" ? "default" : "secondary"}>
              {profile.type === "mentor" ? "Mentor" : "Student"}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Information */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Email:</span>
                    <a 
                      href={`mailto:${profile.email}`} 
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {profile.email}
                    </a>
                  </div>
                )}
                
                {profile.company && (
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Company:</span>
                    <span className="text-sm">{profile.company}</span>
                  </div>
                )}

                {profile.jobTitle && (
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Role:</span>
                    <span className="text-sm">{profile.jobTitle}</span>
                  </div>
                )}

                {profile.school && (
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">School:</span>
                    <span className="text-sm">{profile.school}</span>
                  </div>
                )}

                {profile.grade && (
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Grade:</span>
                    <span className="text-sm">{profile.grade}</span>
                  </div>
                )}

                {profile.state && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Location:</span>
                    <span className="text-sm">{profile.state}</span>
                  </div>
                )}

                {profile.linkedin && (
                  <div className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">LinkedIn:</span>
                    <a 
                      href={profile.linkedin.startsWith('http') ? profile.linkedin : `https://${profile.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View Profile
                    </a>
                  </div>
                )}
              </div>

              {profile.interests && profile.interests.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Interests:</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((interest, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Email Form */}
          {profile.type === "mentor" && userProfile && (
            <Card>
              <CardContent className="pt-6 space-y-4">
                <h3 className="font-medium">Connect with {profile.name.split(' ')[0]}</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="email-subject" className="text-sm font-medium">
                      Subject
                    </label>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={generateEmail}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Generate with AI
                        </>
                      )}
                    </Button>
                  </div>
                  <Input 
                    id="email-subject" 
                    value={emailSubject} 
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="Subject"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email-body" className="text-sm font-medium">
                    Message
                  </label>
                  <Textarea 
                    id="email-body" 
                    value={emailBody} 
                    onChange={(e) => setEmailBody(e.target.value)}
                    placeholder={`Hi ${profile.name.split(' ')[0]},`}
                    className="min-h-[200px]"
                  />
                </div>

                <div className="flex justify-end">
                  <Button disabled={!emailBody || !emailSubject || isGenerating}>
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
