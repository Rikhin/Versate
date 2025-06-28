"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, Paperclip, Smile, Search, Trophy, MessageCircle } from "lucide-react"
import Link from "next/link"

// Add Clerk imports:
import { UserButton } from "@clerk/nextjs"

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState(1)
  const [message, setMessage] = useState("")

  const conversations = [
    {
      id: 1,
      type: "project",
      name: "AI Study Assistant Team",
      lastMessage: "Great progress on the backend API!",
      timestamp: "2 min ago",
      unread: 2,
      avatar: "/placeholder.svg?height=40&width=40",
      online: true,
    },
    {
      id: 2,
      type: "direct",
      name: "Emma Thompson",
      lastMessage: "Are you available for a quick call?",
      timestamp: "15 min ago",
      unread: 1,
      avatar: "/placeholder.svg?height=40&width=40",
      online: true,
    },
    {
      id: 3,
      type: "project",
      name: "Sustainable Campus Initiative",
      lastMessage: "Let's schedule our next meeting",
      timestamp: "1 hour ago",
      unread: 0,
      avatar: "/placeholder.svg?height=40&width=40",
      online: false,
    },
    {
      id: 4,
      type: "direct",
      name: "David Kim",
      lastMessage: "Thanks for the code review!",
      timestamp: "3 hours ago",
      unread: 0,
      avatar: "/placeholder.svg?height=40&width=40",
      online: false,
    },
  ]

  const messages = [
    {
      id: 1,
      sender: "Emma Thompson",
      content: "Hey everyone! I've finished the user interface mockups. What do you think?",
      timestamp: "10:30 AM",
      avatar: "/placeholder.svg?height=32&width=32",
      isMe: false,
    },
    {
      id: 2,
      sender: "You",
      content: "They look amazing! The color scheme really fits our target audience.",
      timestamp: "10:32 AM",
      avatar: "/placeholder.svg?height=32&width=32",
      isMe: true,
    },
    {
      id: 3,
      sender: "Alex Rodriguez",
      content: "I agree! I've been working on the backend API. Should have the user authentication ready by tomorrow.",
      timestamp: "10:35 AM",
      avatar: "/placeholder.svg?height=32&width=32",
      isMe: false,
    },
    {
      id: 4,
      sender: "Emma Thompson",
      content: "Perfect timing! I can start integrating the frontend once that's ready.",
      timestamp: "10:37 AM",
      avatar: "/placeholder.svg?height=32&width=32",
      isMe: false,
    },
    {
      id: 5,
      sender: "You",
      content: "Great progress everyone! We're definitely on track for the submission deadline.",
      timestamp: "10:40 AM",
      avatar: "/placeholder.svg?height=32&width=32",
      isMe: true,
    },
  ]

  const handleSendMessage = () => {
    if (message.trim()) {
      // In a real app, this would send the message to your backend
      console.log("Sending message:", message)
      setMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const selectedConversation = conversations.find((c) => c.id === selectedChat)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Trophy className="h-8 w-8 text-slate-600" />
            <span className="text-2xl font-bold text-slate-800">ColabBoard</span>
          </Link>
          {/* Update the header: */}
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                Dashboard
              </Button>
            </Link>
            <Button variant="ghost" size="sm">
              <MessageCircle className="h-4 w-4 mr-2" />
              Messages
            </Button>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-10 w-10",
                },
              }}
            />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          {/* Conversations Sidebar */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Messages</span>
                <Badge variant="secondary">{conversations.filter((c) => c.unread > 0).length}</Badge>
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input placeholder="Search conversations..." className="pl-10" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-4 border-b cursor-pointer hover:bg-slate-50 transition-colors ${
                      selectedChat === conversation.id ? "bg-slate-100" : ""
                    }`}
                    onClick={() => setSelectedChat(conversation.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={conversation.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{conversation.name[0]}</AvatarFallback>
                        </Avatar>
                        {conversation.online && (
                          <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-sm truncate">{conversation.name}</h3>
                          <div className="flex items-center space-x-1">
                            {conversation.type === "project" && (
                              <Badge variant="outline" className="text-xs">
                                Team
                              </Badge>
                            )}
                            {conversation.unread > 0 && <Badge className="text-xs">{conversation.unread}</Badge>}
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 truncate">{conversation.lastMessage}</p>
                        <p className="text-xs text-slate-400">{conversation.timestamp}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-3 flex flex-col">
            {selectedConversation && (
              <>
                {/* Chat Header */}
                <CardHeader className="border-b">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={selectedConversation.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{selectedConversation.name[0]}</AvatarFallback>
                      </Avatar>
                      {selectedConversation.online && (
                        <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">{selectedConversation.name}</h3>
                      <p className="text-sm text-slate-600">
                        {selectedConversation.type === "project" ? "Team Chat" : "Direct Message"}
                        {selectedConversation.online && " • Online"}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 p-0">
                  <ScrollArea className="h-[400px] p-4">
                    <div className="space-y-4">
                      {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`flex space-x-2 max-w-[70%] ${msg.isMe ? "flex-row-reverse space-x-reverse" : ""}`}
                          >
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={msg.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{msg.sender[0]}</AvatarFallback>
                            </Avatar>
                            <div
                              className={`rounded-lg p-3 ${msg.isMe ? "bg-slate-800 text-white" : "bg-white border"}`}
                            >
                              {!msg.isMe && <p className="text-xs font-medium text-slate-600 mb-1">{msg.sender}</p>}
                              <p className="text-sm">{msg.content}</p>
                              <p className={`text-xs mt-1 ${msg.isMe ? "text-slate-300" : "text-slate-500"}`}>
                                {msg.timestamp}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>

                {/* Message Input */}
                <div className="border-t p-4">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <div className="flex-1">
                      <Input
                        placeholder="Type a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                      />
                    </div>
                    <Button variant="ghost" size="icon">
                      <Smile className="h-4 w-4" />
                    </Button>
                    <Button onClick={handleSendMessage} disabled={!message.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
