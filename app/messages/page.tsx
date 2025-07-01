"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Search, Send, Bot } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { Textarea } from "@/components/ui/textarea"
import { useRealtimeMessages } from "@/hooks/use-realtime-messages"
import { useRequireProfile } from "@/hooks/use-require-profile"
import AIChatbot from "@/components/ai-chatbot/AIChatbot"

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
  const [isAIChat, setIsAIChat] = useState(false)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { loading, profile } = useRequireProfile()

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

  const fetchMessages = async (partnerId: string) => {
    setIsLoadingMessages(true)
    try {
      const response = await fetch(`/api/messages?with=${partnerId}`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      }
    } catch (error) {
      setMessages([])
    } finally {
      setIsLoadingMessages(false)
    }
  }

  const filteredConversations = conversations.filter(conversation => {
    const fullName = `${conversation.partner.first_name} ${conversation.partner.last_name}`.toLowerCase()
    return fullName.includes(searchQuery.toLowerCase())
  })

  const openConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation)
    setIsAIChat(false)
  }

  const openAIChat = () => {
    setSelectedConversation(null)
    setIsAIChat(true)
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  if (!profile) {
    return null; // Will redirect, don't render anything
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
            <Card className="h-[600px]">
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
                {/* AI Chat Option */}
                <div
                  className={`p-4 hover:bg-gray-50 cursor-pointer border-b ${isAIChat ? 'bg-blue-50 border-blue-200' : ''}`}
                  onClick={openAIChat}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600">
                      <Bot className="h-5 w-5 text-white" />
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">AI Assistant</p>
                        <div className="flex items-center space-x-1">
                          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                          <span className="text-xs text-gray-500">Online</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">Always here to help</p>
                    </div>
                  </div>
                </div>

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
                        className={`p-4 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 ${selectedConversation?.partnerId === conversation.partnerId ? 'bg-blue-50 border-blue-200' : ''}`}
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
              {isAIChat ? (
                <AIChatbot />
              ) : (
                <>
                  <CardHeader className="flex-shrink-0">
                    <CardTitle>
                      {selectedConversation ? (
                        `${selectedConversation.partner.first_name} ${selectedConversation.partner.last_name}`
                      ) : (
                        "Select a conversation to start messaging"
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col p-0">
                    {!selectedConversation ? (
                      <div className="text-center text-gray-500 flex-1 flex flex-col items-center justify-center">
                        <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>Choose a conversation from the list to start messaging</p>
                      </div>
                    ) : (
                      <>
                        <div className="overflow-y-auto space-y-4 p-4 border-b bg-white h-[500px]">
                          {isLoadingMessages ? (
                            <div className="text-center text-gray-500">Loading messages...</div>
                          ) : messages.length === 0 ? (
                            <div className="text-center text-gray-500">No messages yet. Start the conversation!</div>
                          ) : (
                            messages.map((message) => {
                              const isOwnMessage = message.sender_id === user?.id
                              return (
                                <div
                                  key={message.id}
                                  className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                                >
                                  <div
                                    className={`inline-block max-w-[60%] min-w-[64px] px-4 py-2 rounded-lg align-bottom break-words whitespace-pre-wrap shadow-sm ${
                                      isOwnMessage
                                        ? "bg-blue-600 text-white self-end"
                                        : "bg-gray-100 text-gray-900 self-start"
                                    }`}
                                  >
                                    <p className="text-sm break-words whitespace-pre-wrap overflow-hidden">
                                      {message.content}
                                    </p>
                                    <p className={`text-xs mt-1 ${
                                      isOwnMessage ? "text-blue-100" : "text-gray-500"
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
                        <div className="flex-shrink-0 flex space-x-2 p-4 bg-white">
                          <Textarea
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your message..."
                            className="flex-1 min-h-[60px] max-h-[120px] resize-none"
                            disabled={isSending}
                          />
                          <Button
                            onClick={sendMessage}
                            disabled={!newMessage.trim() || isSending}
                            size="sm"
                            className="self-end"
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                        {sendError && (
                          <div className="text-red-500 text-sm px-4 pb-2">{sendError}</div>
                        )}
                      </>
                    )}
                  </CardContent>
                </>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 