"use client"

import type React from "react"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Send } from "lucide-react"

interface ChatWindowProps {
  friend: { id: number; name: string; avatar: string }
  onClose: () => void
  position: number
}

const mockMessages = [
  { id: 1, text: "Hey! How are you doing?", sender: "friend", time: "2:30 PM" },
  { id: 2, text: "I'm good! Just working on some projects", sender: "me", time: "2:32 PM" },
  { id: 3, text: "That sounds great! What kind of projects?", sender: "friend", time: "2:33 PM" },
]

export function ChatWindow({ friend, onClose, position }: ChatWindowProps) {
  const [messages, setMessages] = useState(mockMessages)
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: newMessage,
          sender: "me",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ])
      setNewMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  return (
    <div
      className="fixed bottom-4 w-80 h-96 bg-background border border-border rounded-lg shadow-lg flex flex-col"
      style={{ right: `${320 + position * 320}px` }}
    >
      {/* Chat Header */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={friend.avatar || "/placeholder.svg"} alt={friend.name} />
            <AvatarFallback>
              {friend.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium text-sm">{friend.name}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="p-1">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-3 overflow-y-auto hide-scrollbar space-y-2">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[70%] p-2 rounded-lg text-sm ${
                message.sender === "me" ? "bg-sky-500 text-white" : "bg-muted text-foreground"
              }`}
            >
              <p>{message.text}</p>
              <p className={`text-xs mt-1 ${message.sender === "me" ? "text-sky-100" : "text-muted-foreground"}`}>
                {message.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-3 border-t border-border">
        <div className="flex space-x-2">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button size="sm" onClick={handleSendMessage}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
