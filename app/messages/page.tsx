"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Search, Send } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { MessageDialog } from "@/components/messaging/MessageDialog"

interface Conversation {
  partnerId: string
  partner: {
    id: string
    first_name: string
    last_name: string
    avatar_url?: string
  }
  lastMessage: {
    content: string
    created_at: string
    sender_id: string
  }
  unreadCount: number
}

export default function MessagesPage() {
  const { user } = useUser()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    if (user) {
      fetchConversations()
    }
  }, [user])

  const fetchConversations = async () => {
    if (!user) return
    
    setIsLoading(true)
    try {
      const response = await fetch("/api/messages/conversations")
      if (response.ok) {
        const data = await response.json()
        setConversations(data)
      }
    } catch (error) {
      console.error("Error fetching conversations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredConversations = conversations.filter(conversation => {
    const fullName = `${conversation.partner.first_name} ${conversation.partner.last_name}`.toLowerCase()
    return fullName.includes(searchQuery.toLowerCase())
  })

  const openConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation)
    setIsDialogOpen(true)
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (diffInHours < 168) {
      return date.toLocaleDateString([], { weekday: 'short' })
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }
  }

  const formatMessagePreview = (content: string) => {
    return content.length > 50 ? content.substring(0, 50) + "..." : content
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Messages</h1>
          <p className="text-slate-600">Connect with other students and team members</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversations List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2 mb-4">
                  <MessageSquare className="h-5 w-5" />
                  <CardTitle>Conversations</CardTitle>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="p-4 text-center text-gray-500">Loading conversations...</div>
                ) : filteredConversations.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    {searchQuery ? "No conversations found." : "No conversations yet."}
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredConversations.map((conversation) => (
                      <div
                        key={conversation.partnerId}
                        className="p-4 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                        onClick={() => openConversation(conversation)}
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage 
                              src={conversation.partner.avatar_url || "/placeholder-user.jpg"} 
                              alt={`${conversation.partner.first_name} ${conversation.partner.last_name}`} 
                            />
                            <AvatarFallback>
                              {conversation.partner.first_name[0]}{conversation.partner.last_name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {conversation.partner.first_name} {conversation.partner.last_name}
                              </p>
                              <span className="text-xs text-gray-500">
                                {formatTime(conversation.lastMessage.created_at)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 truncate">
                              {formatMessagePreview(conversation.lastMessage.content)}
                            </p>
                          </div>
                          {conversation.unreadCount > 0 && (
                            <Badge variant="destructive" className="ml-2">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Message Area */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="flex-shrink-0">
                <CardTitle>
                  {selectedConversation ? (
                    `${selectedConversation.partner.first_name} ${selectedConversation.partner.last_name}`
                  ) : (
                    "Select a conversation to start messaging"
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex items-center justify-center">
                {!selectedConversation ? (
                  <div className="text-center text-gray-500">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Choose a conversation from the list to start messaging</p>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Button onClick={() => setIsDialogOpen(true)}>
                      <Send className="h-4 w-4 mr-2" />
                      Open Conversation
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Message Dialog */}
        {selectedConversation && (
          <MessageDialog
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            recipientId={selectedConversation.partnerId}
            recipientName={`${selectedConversation.partner.first_name} ${selectedConversation.partner.last_name}`}
          />
        )}
      </div>
    </div>
  )
} 