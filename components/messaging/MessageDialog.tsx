"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, X } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { createClient } from "@/lib/supabase"

interface MessageDialogProps {
  isOpen: boolean
  onClose: () => void
  recipientId: string
  recipientName: string
}

interface Message {
  id: string
  sender_id: string
  recipient_id: string
  content: string
  created_at: string
}

export function MessageDialog({ isOpen, onClose, recipientId, recipientName }: MessageDialogProps) {
  const { user } = useUser()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  // Limit to last 50 messages to prevent performance issues
  const MAX_MESSAGES = 50

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (isOpen && user) {
      fetchMessages()
    }
  }, [isOpen, recipientId, user])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Set up real-time subscription
  useEffect(() => {
    if (!isOpen || !user) return

    const supabase = createClient()
    const channel = supabase.channel('dialog-messages-realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'messages',
        filter: `(sender_id=eq.${user.id} AND recipient_id=eq.${recipientId}) OR (sender_id=eq.${recipientId} AND recipient_id=eq.${user.id})`
      }, (payload) => {
        console.log('Dialog message change detected:', payload)
        fetchMessages()
      })
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [isOpen, user, recipientId])

  const fetchMessages = async () => {
    if (!user) return
    
    setIsLoading(true)
    try {
      const response = await fetch(`/api/messages?with=${recipientId}`)
      if (response.ok) {
        const data = await response.json()
        // Only keep the last MAX_MESSAGES messages
        const limitedMessages = data.slice(-MAX_MESSAGES)
        setMessages(limitedMessages)
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !user || isSending) return

    setIsSending(true)
    setSendError(null)
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipientId,
          content: newMessage.trim(),
        }),
      })

      const result = await response.json()
      console.log("Send message response:", result)

      if (response.ok) {
        setMessages(prev => {
          const newMessages = [...prev, result]
          // Keep only the last MAX_MESSAGES messages
          return newMessages.slice(-MAX_MESSAGES)
        })
        setNewMessage("")
      } else {
        setSendError(result.error || "Failed to send message.")
      }
    } catch (error) {
      setSendError("Network error. Please try again.")
      console.error("Error sending message:", error)
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

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md h-[600px] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-user.jpg" alt={recipientName} />
                <AvatarFallback>{recipientName[0]}</AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-lg">{recipientName}</DialogTitle>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div 
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto space-y-4 p-4 border rounded-lg min-h-0"
          style={{ maxHeight: '400px' }}
        >
          {isLoading ? (
            <div className="text-center text-gray-500">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-500">No messages yet. Start the conversation!</div>
          ) : (
            <>
              {messages.length >= MAX_MESSAGES && (
                <div className="text-center text-xs text-gray-400 pb-2">
                  Showing last {MAX_MESSAGES} messages
                </div>
              )}
              {messages.map((message) => {
                const isOwnMessage = message.sender_id === user?.id
                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[280px] px-4 py-2 rounded-lg break-words ${
                        isOwnMessage
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words overflow-hidden">
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
              })}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex-shrink-0 flex space-x-2 p-4 border-t">
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
      </DialogContent>
    </Dialog>
  )
} 