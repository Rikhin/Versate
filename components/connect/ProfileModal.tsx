"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, ExternalLink, Building, MapPin, Clock, User, GraduationCap } from "lucide-react"
import { MessageButton } from "@/components/messaging/MessageButton"

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
  const [isSending, setIsSending] = useState(false)
  const [showEmailForm, setShowEmailForm] = useState(false)

  const handleSendEmail = async () => {
    if (!profile?.email || !emailSubject || !emailBody) return
    
    setIsSending(true)
    try {
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: profile.email,
          subject: emailSubject,
          body: emailBody,
          from: 'noreply@colabboard.com'
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send email')
      }
      
      // Reset form
      setEmailSubject("")
      setEmailBody("")
      setShowEmailForm(false)
      alert("Email sent successfully!")
    } catch (error) {
      console.error("Failed to send email:", error)
      alert("Failed to send email. Please try again.")
    } finally {
      setIsSending(false)
    }
  }

  const handleExternalEmail = () => {
    if (profile?.email) {
      window.open(`mailto:${profile.email}?subject=Hello from ColabBoard`, "_blank")
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
                    <span className="text-sm text-blue-600">{profile.email}</span>
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
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Title:</span>
                    <span className="text-sm">{profile.jobTitle}</span>
                  </div>
                )}
                
                {profile.yearsExperience && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Experience:</span>
                    <span className="text-sm">{profile.yearsExperience} years</span>
                  </div>
                )}
                
                {profile.state && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Location:</span>
                    <span className="text-sm">{profile.state}</span>
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
                     <User className="h-4 w-4 text-gray-500" />
                     <span className="text-sm font-medium">Grade:</span>
                     <span className="text-sm">{profile.grade}</span>
                   </div>
                 )}
               </div>
               
               {profile.interests && profile.interests.length > 0 && (
                 <div className="mt-4">
                   <span className="text-sm font-medium text-gray-700">Skills & Interests:</span>
                   <div className="flex flex-wrap gap-2 mt-2">
                     {profile.interests.map((interest, index) => (
                       <Badge key={index} variant="secondary" className="text-xs">
                         {interest}
                       </Badge>
                     ))}
                   </div>
                 </div>
               )}
              
              {profile.linkedin && (
                <div className="mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(profile.linkedin, "_blank")}
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View LinkedIn Profile
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Email Actions */}
          <div className="flex gap-2">
            {profile.type === "student" && profile.userId && (
              <MessageButton recipientId={profile.userId} recipientName={profile.name} />
            )}
            <Button
              onClick={() => setShowEmailForm(!showEmailForm)}
              className="flex items-center gap-2"
            >
              <Mail className="h-4 w-4" />
              Send In-App Email
            </Button>
            <Button
              variant="outline"
              onClick={handleExternalEmail}
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Send External Email
            </Button>
          </div>

          {/* Email Form */}
          {showEmailForm && (
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <Label htmlFor="email-subject">Subject</Label>
                  <Input
                    id="email-subject"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="Enter email subject..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="email-body">Message</Label>
                  <Textarea
                    id="email-body"
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    placeholder={`Hi ${profile.name.split(' ')[0]},\n\nI found your profile on ColabBoard and would love to connect...`}
                    rows={8}
                  />
                </div>
                
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  <p><strong>Email will be sent to:</strong> {profile.email}</p>
                  <p><strong>From:</strong> noreply@colabboard.com</p>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={handleSendEmail}
                    disabled={isSending || !emailSubject || !emailBody}
                    className="flex items-center gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    {isSending ? "Sending..." : "Send Email"}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowEmailForm(false)
                      setEmailSubject("")
                      setEmailBody("")
                    }}
                  >
                    Cancel
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