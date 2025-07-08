"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Search, Send } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { Textarea } from "@/components/ui/textarea"
import { useRealtimeMessages } from "@/hooks/use-realtime-messages"
import { useRequireProfile } from "@/hooks/use-require-profile"
import { BackgroundGradient, FloatingShapes } from '@/components/scroll-animations'

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
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { loading, profile } = useRequireProfile()
  const [conversationsError, setConversationsError] = useState<string | null>(null)
  const [messagesError, setMessagesError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchConversations()
    }
  }, [user])

  const markMessagesAsRead = useCallback(async (partnerId: string) => {
    if (!user) return
    
    try {
      const response = await fetch("/api/messages/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partnerId }),
      })
      
      if (response.ok) {
        // Update conversations to reflect read status
        setConversations(prev => prev.map(conv => 
          conv.partnerId === partnerId 
            ? { ...conv, unreadCount: 0 }
            : conv
        ))
      }
    } catch (error) {
      console.error("Error marking messages as read:", error)
    }
  }, [user])

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.partnerId)
      markMessagesAsRead(selectedConversation.partnerId)
    }
  }, [selectedConversation, markMessagesAsRead])

  // Set up WebSocket-based real-time messaging
  const handleNewMessage = useCallback((message: any) => {
    console.log('New message received via WebSocket:', message)
    
    // Check if this message belongs to the currently selected conversation
    if (selectedConversation) {
      const isInCurrentConversation = 
        (message.sender_id === selectedConversation.partnerId && message.recipient_id === user?.id) ||
        (message.sender_id === user?.id && message.recipient_id === selectedConversation.partnerId)
      
      console.log('Is in current conversation:', isInCurrentConversation, {
        messageSender: message.sender_id,
        messageRecipient: message.recipient_id,
        selectedPartner: selectedConversation.partnerId,
        currentUser: user?.id
      })
      
      if (isInCurrentConversation) {
        console.log('Adding message to current conversation')
        setMessages(prev => [...prev, message])
        
        // Mark as read if it's a new message to us
        if (message.recipient_id === user?.id && message.sender_id === selectedConversation.partnerId) {
          markMessagesAsRead(selectedConversation.partnerId)
        }
      }
    }
    
    // Always refresh conversations list
    fetchConversations()
  }, [selectedConversation, user, markMessagesAsRead])

  const handleConversationUpdate = useCallback(() => {
    console.log('Conversation update received via WebSocket')
    fetchConversations()
  }, [])

  // Initialize real-time messaging
  useRealtimeMessages(handleNewMessage, handleConversationUpdate)

  const fetchConversations = async () => {
    if (!user) return
    
    setIsLoading(true)
    setConversationsError(null)
    try {
      const response = await fetch("/api/messages/conversations")
      if (response.ok) {
        const data = await response.json()
        setConversations(data)
      } else {
        setConversationsError("Failed to load conversations. Please try again later.")
      }
    } catch (error) {
      console.error("Error fetching conversations:", error)
      setConversationsError("Failed to load conversations. Please check your connection.")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchMessages = async (partnerId: string) => {
    setIsLoadingMessages(true)
    setMessagesError(null)
    try {
      const response = await fetch(`/api/messages?with=${partnerId}`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      } else {
        setMessagesError("Failed to load messages. Please try again later.")
      }
    } catch (error) {
      setMessages([])
      setMessagesError("Failed to load messages. Please check your connection.")
    } finally {
      setIsLoadingMessages(false)
    }
  }

  const filteredConversations = conversations.filter(conversation => {
    // Remove the check that hides conversations with missing partner
    // Always show the conversation, use fallback name/avatar if needed
    const fullName = `${conversation.partner?.first_name || "Unknown"} ${conversation.partner?.last_name || "User"}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  })

  const openConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation)
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

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || isSending) return
    setIsSending(true)
    setSendError(null)
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientId: selectedConversation.partnerId,
          content: newMessage.trim(),
        }),
      })
      const result = await response.json()
      if (response.ok) {
        // Message will be added via WebSocket, but we can add it immediately for better UX
        setMessages((prev) => [...prev, result])
        setNewMessage("")
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100)
      } else {
        setSendError(result.error || "Failed to send message.")
      }
    } catch (error) {
      setSendError("Network error. Please try again.")
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Defensive fallback for partner name and avatar
  const getPartnerName = (partner: any) => {
    // Always return a name, even if partner is null
    if (!partner) return "Unknown User";
    const first = partner.first_name || "Unknown";
    const last = partner.last_name || "User";
    return `${first} ${last}`;
  };
  const getPartnerInitials = (partner: any) => {
    // Always return initials, even if partner is null
    if (!partner) return "U";
    return `${(partner.first_name?.[0] || "U")}${(partner.last_name?.[0] || "U")}`;
  };

  useEffect(() => {
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 50);
  }, [messages]);

  if (loading) {
    return (
      <div className="min-h-screen bg-helix-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-helix-gradient-start mx-auto mb-4"></div>
          <p className="text-helix-text-light">Loading...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-helix-dark flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-black text-white mb-6">Profile Missing</h1>
          <p className="text-xl text-helix-text-light mb-8">Your user profile could not be loaded. Please create or fix your profile to use messages.</p>
          <a href="/profile" className="inline-block bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end text-white px-8 py-4 rounded-full font-bold hover:shadow-xl glow transition-all duration-300">Go to Profile</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-helix-dark relative overflow-hidden">
      <BackgroundGradient startColor="from-helix-blue/20" endColor="to-helix-dark-blue/20" triggerStart="top center" triggerEnd="center center" />
      <FloatingShapes count={3} triggerStart="top center" triggerEnd="bottom center" />
      <div className="container mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-5xl font-black text-white mb-4">Messages</h1>
          <p className="text-xl text-helix-text-light">Connect with other students and team members</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Conversations List */}
          <div className="lg:col-span-1">
            <Card className="h-[700px] glass border border-white/10 rounded-[20px] shadow-2xl">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-6">
                  <MessageSquare className="h-6 w-6 text-helix-gradient-start" />
                  <CardTitle className="text-xl font-black text-white">Conversations</CardTitle>
                </div>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-helix-text-light h-5 w-5" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 bg-white/10 border-white/20 text-white placeholder:text-helix-text-light rounded-xl"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {conversationsError ? (
                  <div className="p-6 text-center text-red-400 text-lg">{conversationsError}</div>
                ) : isLoading ? (
                  <div className="p-6 text-center text-helix-text-light text-lg">Loading conversations...</div>
                ) : filteredConversations.length === 0 ? (
                  <div className="p-6 text-center text-helix-text-light text-lg">
                    {searchQuery ? "No conversations found." : "No conversations yet."}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredConversations.map((conversation) => (
                      <div
                        key={conversation.partnerId}
                        className={`p-6 hover:bg-white/5 cursor-pointer border-b border-white/10 last:border-b-0 transition-all duration-300 ${
                          selectedConversation?.partnerId === conversation.partnerId 
                            ? 'bg-white/10 border-helix-gradient-start/30' 
                            : ''
                        }`}
                        onClick={() => openConversation(conversation)}
                      >
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12 border-2 border-white/20">
                            <AvatarImage 
                              src={conversation.partner?.avatar_url || "/placeholder-user.jpg"} 
                              alt={`${conversation.partner?.first_name || "Unknown"} ${conversation.partner?.last_name || "User"}`} 
                            />
                            <AvatarFallback className="bg-white/10 text-white font-bold">
                              {getPartnerInitials(conversation.partner)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-base font-bold text-white truncate">
                                {getPartnerName(conversation.partner)}
                              </p>
                              <span className="text-sm text-helix-text-light">
                                {formatTime(conversation.lastMessage.created_at)}
                              </span>
                            </div>
                            <p className="text-sm text-helix-text-light truncate">
                              {formatMessagePreview(conversation.lastMessage.content)}
                            </p>
                          </div>
                          {conversation.unreadCount > 0 && (
                            <Badge variant="destructive" className="ml-3 bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end text-white font-bold">
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
            <Card className="h-[700px] flex flex-col max-w-4xl mx-auto glass border border-white/10 rounded-[20px] shadow-2xl">
              <CardHeader className="flex-shrink-0">
                <CardTitle className="text-xl font-black text-white">
                  {selectedConversation ? (
                    getPartnerName(selectedConversation.partner)
                  ) : (
                    "Select a conversation to start messaging"
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col p-0">
                {!selectedConversation ? (
                  <div className="text-center text-helix-text-light flex-1 flex flex-col items-center justify-center">
                    <MessageSquare className="h-16 w-16 mx-auto mb-6 text-helix-gradient-start" />
                    <p className="text-lg">Choose a conversation from the list to start messaging</p>
                  </div>
                ) : (
                  <>
                    <div className="overflow-y-auto space-y-6 p-6 border-b border-white/10 bg-white/5 h-[550px]">
                      {messagesError ? (
                        <div className="text-center text-red-400 text-lg">{messagesError}</div>
                      ) : isLoadingMessages ? (
                        <div className="text-center text-helix-text-light text-lg">Loading messages...</div>
                      ) : messages.length === 0 ? (
                        <div className="text-center text-helix-text-light text-lg">No messages yet. Start the conversation!</div>
                      ) : (
                        messages.map((message) => {
                          const isOwnMessage = message.sender_id === user?.id
                          return (
                            <div
                              key={message.id}
                              className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`inline-block max-w-[80%] min-w-[64px] px-4 py-3 rounded-[16px] align-bottom break-words whitespace-pre-wrap shadow-xl text-base ${
                                  isOwnMessage
                                    ? "bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end text-white self-end"
                                    : "bg-white/10 border border-white/20 text-white self-start"
                                }`}
                              >
                                <p className="text-base break-words whitespace-pre-wrap overflow-hidden">
                                  {message.content}
                                </p>
                                <p className={`text-sm mt-2 ${
                                  isOwnMessage ? "text-white/80" : "text-helix-text-light"
                                }`}>
                                  {formatTime(message.created_at)}
                                </p>
                              </div>
                            </div>
                          )
                        })
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                    <div className="flex-shrink-0 flex space-x-4 p-6 bg-white/5">
                      <Textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        className="flex-1 min-h-[56px] max-h-[120px] resize-none text-base bg-white/10 border-white/20 text-white placeholder:text-helix-text-light rounded-xl"
                        disabled={isSending}
                      />
                      <Button
                        onClick={sendMessage}
                        disabled={!newMessage.trim() || isSending}
                        size="sm"
                        className="self-end bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end text-white hover:shadow-xl glow rounded-xl font-bold px-6 py-3"
                      >
                        <Send className="h-5 w-5" />
                      </Button>
                    </div>
                    {sendError && (
                      <div className="text-red-400 text-base px-6 pb-4">{sendError}</div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 