'use client';

export const dynamic = "force-dynamic";

import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useRealtimeMessages } from "@/hooks/use-realtime-messages";

interface Conversation {
  partnerId: string;
  partner: {
    user_id: string;
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
  } | null;
  lastMessage: {
    content: string;
    created_at: string;
  };
  unreadCount: number;
}

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: string;
}

export default function MessagesPage() {
  const { user } = useUser();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showNew, setShowNew] = useState(false);
  const [newUserId, setNewUserId] = useState("");
  const [newError, setNewError] = useState("");

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetch('/api/messages/conversations')
      .then(res => res.json())
      .then(data => {
        setConversations(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, [user]);

  // Real-time updates for conversations and chat
  useRealtimeMessages(
    (msg) => {
      // If the message is for the selected conversation, refetch messages
      if (msg && typeof msg === 'object' && 'sender_id' in msg && 'recipient_id' in msg) {
        if (selected && (msg.sender_id === selected || msg.recipient_id === selected)) {
          fetch(`/api/messages?with=${selected}`)
            .then(res => res.json())
            .then(data => setMessages(Array.isArray(data) ? data : []));
        }
      }
    },
    () => {
      // On conversation update, refetch conversations
      fetch('/api/messages/conversations')
        .then(res => res.json())
        .then(data => setConversations(Array.isArray(data) ? data : []));
    }
  );

  // Fetch messages when a conversation is selected
  useEffect(() => {
    if (!selected) return;
    setChatLoading(true);
    fetch(`/api/messages?with=${selected}`)
      .then(res => res.json())
      .then(data => {
        setMessages(Array.isArray(data) ? data : []);
        setChatLoading(false);
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      });
    // Mark messages as read
    fetch('/api/messages/read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ partnerId: selected })
    });
  }, [selected]);

  // Scroll to bottom when messages change
  useEffect(() => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  }, [messages]);

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim() || !selected || isSending) return;
    setIsSending(true);
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipientId: selected, content: newMessage.trim() }),
      });
      const result = await response.json();
      if (response.ok) {
        setMessages(prev => [...prev, result]);
        setNewMessage("");
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startNewConversation = async () => {
    setNewError("");
    if (!newUserId.trim() || newUserId === user?.id) {
      setNewError("Enter a valid user ID (not yourself)");
      return;
    }
    const res = await fetch("/api/messages/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: newUserId.trim() })
    });
    const data = await res.json();
    if (res.ok && data.conversationId) {
      setSelected(data.conversationId);
      setShowNew(false);
      setNewUserId("");
      setNewError("");
    } else {
      setNewError(data.error || "Could not start conversation");
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Sidebar */}
      <aside className="w-full max-w-xs border-r bg-gray-50 flex flex-col min-h-screen">
        <div className="p-4 border-b flex items-center justify-between gap-2">
          <h1 className="text-xl font-semibold text-gray-800">Messages</h1>
          <button
            className="rounded-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 text-sm font-medium transition"
            onClick={() => setShowNew(v => !v)}
            title="Start new conversation"
          >
            + New
          </button>
        </div>
        {showNew && (
          <div className="p-4 border-b bg-white flex flex-col gap-2">
            <input
              type="text"
              className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Enter user ID..."
              value={newUserId}
              onChange={e => setNewUserId(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') startNewConversation(); }}
            />
            <button
              className="rounded bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 text-sm font-medium transition"
              onClick={startNewConversation}
            >
              Start
            </button>
            {newError && <div className="text-red-500 text-xs mt-1">{newError}</div>}
          </div>
        )}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-gray-400">Loading...</div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-gray-400">No conversations yet.</div>
          ) : (
            <ul>
              {conversations.map(conv => (
                <li
                  key={conv.partnerId}
                  className={`flex items-center gap-3 px-4 py-3 cursor-pointer rounded-lg transition-colors duration-100 select-none
                    ${selected === conv.partnerId ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-100'}
                  `}
                  onClick={() => setSelected(conv.partnerId)}
                  tabIndex={0}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setSelected(conv.partnerId); }}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={conv.partner?.avatar_url || "/placeholder-user.jpg"} alt={conv.partner?.first_name || 'User'} />
                    <AvatarFallback>{(conv.partner?.first_name?.[0] || '?')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {conv.partner?.first_name || 'User'} {conv.partner?.last_name || ''}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {conv.lastMessage?.content || ''}
                    </div>
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="ml-2 bg-blue-500 text-white text-xs rounded-full px-2 py-0.5">
                      {conv.unreadCount}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col items-center justify-center min-h-screen bg-white border-l">
        {!selected ? (
          <div className="text-gray-400 text-lg">Select a conversation to start chatting.</div>
        ) : (
          <div className="w-full max-w-2xl h-full flex flex-col bg-white border rounded-lg shadow-sm m-4 mx-auto min-h-[70vh]">
            {/* Chat header */}
            <div className="flex items-center gap-3 p-4 border-b bg-gray-50 rounded-t-lg">
              {(() => {
                const conv = conversations.find(c => c.partnerId === selected);
                return conv ? (
                  <>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={conv.partner?.avatar_url || "/placeholder-user.jpg"} alt={conv.partner?.first_name || 'User'} />
                      <AvatarFallback>{(conv.partner?.first_name?.[0] || '?')}</AvatarFallback>
                    </Avatar>
                    <div className="font-medium text-gray-900">
                      {conv.partner?.first_name || 'User'} {conv.partner?.last_name || ''}
                    </div>
                  </>
                ) : null;
              })()}
            </div>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {chatLoading ? (
                <div className="text-center text-gray-400">Loading messages...</div>
              ) : messages.length === 0 ? (
                <div className="text-center text-gray-400">No messages yet. Start the conversation!</div>
              ) : (
                messages.map((message) => {
                  const isOwn = message.sender_id === user?.id;
                  return (
                    <div key={message.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                      <div className={`inline-block max-w-[60%] min-w-[64px] px-4 py-2 rounded-lg align-bottom break-words whitespace-pre-wrap shadow-sm
                        ${isOwn ? "bg-blue-600 text-white self-end" : "bg-white text-gray-900 self-start border border-gray-200"}
                      `}>
                        <p className="text-sm break-words whitespace-pre-wrap overflow-hidden">{message.content}</p>
                        <p className={`text-xs mt-1 ${isOwn ? "text-blue-100" : "text-gray-500"}`}>{new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>
            {/* Input */}
            <div className="flex-shrink-0 flex space-x-2 p-4 border-t bg-white rounded-b-lg">
              <Textarea
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
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
          </div>
        )}
      </main>
    </div>
  );
}