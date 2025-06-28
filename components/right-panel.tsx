"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Music, Users, Clock } from "lucide-react"
import { ChatWindow } from "@/components/chat-window"

const friends = [
  { id: 1, name: "Alice Johnson", avatar: "/placeholder.svg?height=32&width=32", status: "online" },
  { id: 2, name: "Bob Smith", avatar: "/placeholder.svg?height=32&width=32", status: "away" },
  { id: 3, name: "Carol Davis", avatar: "/placeholder.svg?height=32&width=32", status: "online" },
  { id: 4, name: "David Wilson", avatar: "/placeholder.svg?height=32&width=32", status: "offline" },
]

const currentMusic = {
  title: "Bohemian Rhapsody",
  artist: "Queen",
  cover: "/placeholder.svg?height=40&width=40",
}

const recentActivity = [
  { title: "Hotel California", artist: "Eagles", time: "2 min ago" },
  { title: "Stairway to Heaven", artist: "Led Zeppelin", time: "5 min ago" },
  { title: "Sweet Child O' Mine", artist: "Guns N' Roses", time: "8 min ago" },
  { title: "Imagine", artist: "John Lennon", time: "12 min ago" },
]

export function RightPanel() {
  const [openChats, setOpenChats] = useState<Array<{ id: number; name: string; avatar: string }>>([])

  const handleFriendClick = (friend: (typeof friends)[0]) => {
    if (!openChats.find((chat) => chat.id === friend.id)) {
      setOpenChats((prev) => [...prev, { id: friend.id, name: friend.name, avatar: friend.avatar }])
    }
  }

  const handleCloseChat = (friendId: number) => {
    setOpenChats((prev) => prev.filter((chat) => chat.id !== friendId))
  }

  return (
    <>
      <aside className="fixed right-4 top-24 w-72 h-[calc(100vh-8rem)] bg-background/80 backdrop-blur-md border border-border rounded-2xl shadow-lg overflow-hidden">
        <div className="h-full flex flex-col p-6">
          {/* Friends List */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-medium text-sm">Friends</h3>
            </div>

            <div className="space-y-3">
              {friends.map((friend) => (
                <div
                  key={friend.name}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => handleFriendClick(friend)}
                >
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={friend.avatar || "/placeholder.svg"} alt={friend.name} />
                      <AvatarFallback>
                        {friend.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background ${
                        friend.status === "online"
                          ? "bg-green-500"
                          : friend.status === "away"
                            ? "bg-yellow-500"
                            : "bg-gray-400"
                      }`}
                    />
                  </div>
                  <span className="text-sm font-medium">{friend.name}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-4" />

          {/* Now Playing */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Music className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-medium text-sm">Now Playing</h3>
            </div>

            <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
              <div className="h-10 w-10 bg-muted rounded-md flex items-center justify-center overflow-hidden">
                <img
                  src={currentMusic.cover || "/placeholder.svg"}
                  alt={currentMusic.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{currentMusic.title}</p>
                <p className="text-xs text-muted-foreground truncate">{currentMusic.artist}</p>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Recent Activity */}
          <div className="flex-1 space-y-4 overflow-y-auto hide-scrollbar">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-medium text-sm">Recent Activity</h3>
            </div>

            <div className="space-y-3">
              {recentActivity.map((track, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{track.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{track.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Chat Windows */}
      {openChats.map((chat, index) => (
        <ChatWindow key={chat.id} friend={chat} onClose={() => handleCloseChat(chat.id)} position={index} />
      ))}
    </>
  )
}
