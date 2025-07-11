"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Mail, Building, Briefcase, MapPin, Link as LinkIcon, User, GraduationCap, BookOpen, Send, Sparkles } from "lucide-react"

export type ProfileData = {
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
  const [isSending, setIsSending] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [emailSuccess, setEmailSuccess] = useState(false)
  const [userProfile, setUserProfile] = useState<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    imageUrl?: string;
    [key: string]: unknown;
  } | null>(null)

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
    setEmailError(null)
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
        setEmailSuccess(false)
      } else {
        setEmailError(data.error || "Failed to generate email. Please try again.")
      }
    } catch (error) {
      console.error("Error generating email:", error)
      setEmailError("Failed to generate email. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const sendEmail = async () => {
    if (!profile || !emailSubject || !emailBody) return
    
    setIsSending(true)
    setEmailError(null)
    try {
      const res = await fetch("/api/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: profile.email,
          subject: emailSubject,
          body: emailBody,
          recipientName: profile.name
        })
      })
      
      const data = await res.json()
      if (res.ok && data.success) {
        setEmailSuccess(true)
        setEmailError(null)
      } else {
        setEmailError(data.error || "Failed to send email. Please try again.")
      }
    } catch (error) {
      console.error("Error sending email:", error)
      setEmailError("Failed to send email. Please try again.")
    } finally {
      setIsSending(false)
    }
  }

  const resetEmailState = () => {
    setEmailError(null)
    setEmailSuccess(false)
  }

  if (!profile) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        resetEmailState()
      }
      onClose()
    }}>
      <DialogContent className="max-w-3xl w-full max-h-[90vh] overflow-y-auto bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-2xl">
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

          {/* Communication Options */}
          {profile.type === "mentor" && userProfile && (
            <Card>
              <CardContent className="pt-6 space-y-4">
                <h3 className="font-medium mb-2">Connect with {profile.name.split(' ')[0]}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Choose how you want to reach out:
                </p>
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  {/* In-app email (Resend) */}
                  <Button 
                    className="flex-1 bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end text-white font-semibold py-3 px-4 rounded-md shadow hover:scale-105 transition"
                    onClick={() => document.getElementById('in-app-email-section')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <Send className="mr-2 h-5 w-5" />
                    Send In-App Email
                  </Button>
                  {/* External email */}
                  <a
                    href={`mailto:${profile.email}?subject=Hello from Versate`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button 
                      variant="outline"
                      className="w-full py-3 px-4 rounded-md border border-helix-gradient-start text-helix-gradient-start font-semibold hover:bg-helix-gradient-start/10"
                    >
                      <Mail className="mr-2 h-5 w-5" />
                      Open in Email App
                    </Button>
                  </a>
                  {/* AI-generated template */}
                  <Button 
                    variant="outline"
                    className="flex-1 py-3 px-4 rounded-md border border-helix-gradient-start text-helix-gradient-start font-semibold hover:bg-helix-gradient-start/10"
                    onClick={generateEmail}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Generate Email with AI
                      </>
                    )}
                  </Button>
                </div>
                {/* In-app email form */}
                <div id="in-app-email-section" className="space-y-4 mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">Send an Email</h4>
                  
                  {emailSuccess && (
                    <div className="p-3 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm rounded-md">
                      Your email has been sent successfully!
                    </div>
                  )}
                  
                  {emailError && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm rounded-md">
                      {emailError}
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <label htmlFor="email-subject" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Subject
                    </label>
                    <Input 
                      id="email-subject" 
                      value={emailSubject} 
                      onChange={(e) => {
                        resetEmailState()
                        setEmailSubject(e.target.value)
                      }}
                      placeholder="Subject"
                      className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label htmlFor="email-body" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Message
                      </label>
                      <button 
                        type="button"
                        onClick={generateEmail}
                        disabled={isGenerating}
                        className="text-xs flex items-center text-helix-gradient-end hover:text-helix-gradient-start transition-colors"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-1 h-3 w-3" />
                            Generate with AI
                          </>
                        )}
                      </button>
                    </div>
                    <Textarea 
                      id="email-body" 
                      value={emailBody} 
                      onChange={(e) => {
                        resetEmailState()
                        setEmailBody(e.target.value)
                      }}
                      placeholder={`Hi ${profile.name.split(' ')[0]},`}
                      className="min-h-[200px] bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-between gap-3 pt-2">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Your email will be sent through Versate's secure email service.
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline"
                        onClick={() => {
                          const mailtoLink = `mailto:${profile.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`
                          window.open(mailtoLink, '_blank')
                        }}
                        disabled={!emailBody || !emailSubject}
                        className="border-gray-300 dark:border-gray-600"
                      >
                        Open in Email App
                      </Button>
                      <Button 
                        onClick={sendEmail}
                        disabled={!emailBody || !emailSubject || isSending}
                        className="bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end text-white hover:opacity-90 transition-opacity"
                      >
                        {isSending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Send In-App Email
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
