"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Trophy, Search, Send, Phone, Video, MoreVertical, Paperclip, Smile, Users, Settings } from "lucide-react"
import Link from "next/link"

// Mock user data
const mockUser = {
  firstName: "John",
  imageUrl: "/placeholder-user.jpg",
}

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState(1)
  const [message, setMessage] = useState("")

  const mockChats = [
    {
      id: 1,
      name: "AI Study Assistant Team",
      type: "group",
      lastMessage: "Great progress on the ML model!",
      lastTime: "2m ago",
      unread: 2,
      avatar: "/placeholder-user.jpg",
      members: 4,
      project: "Congressional App Challenge",
    },
    {
      id: 2,
      name: "Sarah Chen",
      type: "direct",
      lastMessage: "When can we schedule the next meeting?",
      lastTime: "1h ago",
      unread: 0,
      avatar: "/placeholder-user.jpg",
      online: true,
    },
    {
      id: 3,
      name: "Energy Monitor Project",
      type: "group",
      lastMessage: "Updated the sensor calibration code",
      lastTime: "3h ago",
      unread: 1,
      avatar: "/placeholder-user.jpg",
      members: 3,
      project: "Regeneron ISEF",
    },
    {
      id: 4,
      name: "Mike Johnson",
      type: "direct",
      lastMessage: "Thanks for the code review!",
      lastTime: "1d ago",
      unread: 0,
      avatar: "/placeholder-user.jpg",
      online: false,
    },
  ]

  const mockMessages = [
    {
      id: 1,
      sender: "Sarah Chen",
      content: "Hey everyone! I've finished the initial data preprocessing. The dataset looks clean now.",
      time: "10:30 AM",
      avatar: "/placeholder-user.jpg",
      isMe: false,
    },
    {
      id: 2,
      sender: "You",
      content: "Awesome work Sarah! I'll start working on the model architecture now.",
      time: "10:32 AM",
      avatar: "/placeholder-user.jpg",
      isMe: true,
    },
    {
      id: 3,
      sender: "Mike Johnson",
      content: "I've set up the basic UI components. Should we schedule a demo for tomorrow?",
      time: "10:35 AM",
      avatar: "/placeholder-user.jpg",
      isMe: false,
    },
    {
      id: 4,
      sender: "Sarah Chen",
      content: "That sounds perfect! How about 2 PM?",
      time: "10:36 AM",
      avatar: "/placeholder-user.jpg",
      isMe: false,
    },
    {
      id: 5,
      sender: "You",
      content: "Works for me! I'll have the initial model ready by then.",
      time: "10:38 AM",
      avatar: "/placeholder-user.jpg",
      isMe: true,
    },
  ]

  const currentChat = mockChats.find((chat) => chat.id === selectedChat)

  const handleSendMessage = () => {
    if (message.trim()) {
      // In a real app, this would send the message
      console.log("Sending message:", message)
      setMessage("")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <Trophy className="h-8 w-8 text-slate-600" />
              <div>
                <span className="text-2xl font-bold text-slate-800">brate</span>
                <p className="text-xs text-slate-500 -mt-1">built by Rikhin Kavuru</p>
              </div>
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/dashboard" className="text-slate-600 hover:text-slate-800">
              Dashboard
            </Link>
            <Link href="/explore" className="text-slate-600 hover:text-slate-800">
              Explore
            </Link>
            <Link href="/chat" className="text-slate-600 hover:text-slate-800 font-medium">
              Messages
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={mockUser.imageUrl || "/placeholder.svg"} alt={mockUser.firstName} />
              <AvatarFallback>{mockUser.firstName?.[0] || "U"}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 h-[calc(100vh-120px)]">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
          {/* Chat List */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Messages</span>
                  <Button size="sm" variant="ghost">
                    <Settings className="h-4 w-4" />
                  </Button>
                </CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input placeholder="Search conversations..." className="pl-10" />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-280px)]">
                  {mockChats.map((chat, index) => (
                    <div key={chat.id}>
                      <div
                        className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors ${
                          selectedChat === chat.id ? "bg-slate-100" : ""
                        }`}
                        onClick={() => setSelectedChat(chat.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={chat.avatar || "/placeholder.svg"} alt={chat.name} />
                              <AvatarFallback>{chat.name[0]}</AvatarFallback>
                            </Avatar>
                            {chat.type === "direct" && chat.online && (
                              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                            {chat.type === "group" && (
                              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-600 rounded-full border-2 border-white flex items-center justify-center">
                                <Users className="h-2 w-2 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-slate-800 truncate">{chat.name}</p>
                              <span className="text-xs text-slate-500">{chat.lastTime}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-slate-600 truncate">{chat.lastMessage}</p>
                              {chat.unread > 0 && (
                                <Badge
                                  variant="default"
                                  className="text-xs h-5 w-5 rounded-full p-0 flex items-center justify-center"
                                >
                                  {chat.unread}
                                </Badge>
                              )}
                            </div>
                            {chat.project && <p className="text-xs text-slate-500 mt-1">{chat.project}</p>}
                          </div>
                        </div>
                      </div>
                      {index < mockChats.length - 1 && <Separator />}
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-3">
            <Card className="h-full flex flex-col">
              {/* Chat Header */}
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={currentChat?.avatar || "/placeholder.svg"} alt={currentChat?.name} />
                      <AvatarFallback>{currentChat?.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-slate-800">{currentChat?.name}</h3>
                      {currentChat?.type === "group" ? (
                        <p className="text-sm text-slate-600">{currentChat.members} members</p>
                      ) : (
                        <p className="text-sm text-slate-600">{currentChat?.online ? "Online" : "Last seen 2h ago"}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="ghost">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 p-0">
                <ScrollArea className="h-[calc(100vh-400px)] p-4">
                  <div className="space-y-4">
                    {mockMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex items-start space-x-3 ${msg.isMe ? "flex-row-reverse space-x-reverse" : ""}`}
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={msg.avatar || "/placeholder.svg"} alt={msg.sender} />
                          <AvatarFallback>{msg.sender[0]}</AvatarFallback>
                        </Avatar>
                        <div className={`flex flex-col ${msg.isMe ? "items-end" : "items-start"}`}>
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              msg.isMe ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-800"
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                          </div>
                          <span className="text-xs text-slate-500 mt-1">{msg.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>

              {/* Message Input */}
              <div className="border-t p-4">
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="ghost">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Type a message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      className="pr-10"
                    />
                    <Button size="sm" variant="ghost" className="absolute right-1 top-1/2 transform -translate-y-1/2">
                      <Smile className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button onClick={handleSendMessage} disabled={!message.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
