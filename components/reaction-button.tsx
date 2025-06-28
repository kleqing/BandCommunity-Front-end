"use client"

import { useState, useRef, useEffect } from "react"
import { Heart, X as XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ReactionButtonProps {
  reactions: { [key: string]: number }
}

const reactionEmojis = {
  like: "👍",
  love: "❤️",
  laugh: "😂",
  wow: "😮",
  sad: "😢",
  angry: "😡",
}

export function ReactionButton({ reactions }: ReactionButtonProps) {
  const [showReactions, setShowReactions] = useState(false)
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Get top 3 reactions
  const topReactions = Object.entries(reactions)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)

  const totalReactions = Object.values(reactions).reduce((sum, count) => sum + count, 0)

  const handleReactionClick = (reaction: string) => {
    setSelectedReaction(reaction)
    setShowReactions(false)
  }

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setShowReactions(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowReactions(false)
    }, 100) // 0.5 second delay
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Button
        variant="ghost"
        size="sm"
        className={`flex items-center space-x-2 text-muted-foreground hover:text-red-500 ${selectedReaction ? "text-red-500" : ""
          }`}
        onClick={() => !selectedReaction && handleReactionClick("like")}
      >
        {selectedReaction ? (
          <div className="flex items-center space-x-1">
            <span className="text-base">
              {reactionEmojis[selectedReaction as keyof typeof reactionEmojis]}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setSelectedReaction(null)
              }}
              className="text-muted-foreground hover:text-destructive"
              title="Remove reaction"
            >
              <XIcon className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <Heart className="w-3 h-3" />
        )}

        <div className="flex items-center space-x-1">
          {topReactions.map(([reaction]) => (
            <span key={reaction} className="text-xs">
              {reactionEmojis[reaction as keyof typeof reactionEmojis]}
            </span>
          ))}
          <span className="text-sm">{totalReactions}</span>
        </div>
      </Button>

      {/* Reaction Picker */}
      {showReactions && (
        <div className="absolute bottom-full left-0 mb-2 bg-background border border-border rounded-full px-3 py-2 shadow-lg flex space-x-2 z-10">
          {Object.entries(reactionEmojis).map(([reaction, emoji]) => (
            <button
              key={reaction}
              className="text-xl hover:scale-125 transition-transform p-1 rounded-full hover:bg-muted"
              onClick={() => handleReactionClick(reaction)}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
