"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MessageCircle, Send, X } from "lucide-react"
import { ReactionButton } from "@/components/reaction-button"

interface PostModalProps {
  post: any
  onClose: () => void
}

const mockComments = [
  {
    id: 1,
    user: "Alice Johnson",
    avatar: "/placeholder.svg",
    text: "This is absolutely amazing! 🎵",
    time: "2h",
    reactions: { like: 12, love: 3 },
    replies: [
      {
        id: 11,
        user: "Bob Smith",
        avatar: "/placeholder.svg",
        text: "I totally agree!",
        time: "1h",
        reactions: { like: 5 },
      },
    ],
  },
  {
    id: 2,
    user: "Carol Davis",
    avatar: "/placeholder.svg",
    text: "Been listening to this on repeat all day!",
    time: "4h",
    reactions: { like: 8, laugh: 2 },
    replies: [],
  },
  {
    id: 3,
    user: "David Wilson",
    avatar: "/placeholder.svg",
    text: "Classic! Never gets old 🔥",
    time: "6h",
    reactions: { like: 15, love: 4, wow: 1 },
    replies: [],
  },
]

export function PostModal({ post, onClose }: PostModalProps) {
  const [comments, setComments] = useState(mockComments)
  const [newComment, setNewComment] = useState("")
  const [sortBy, setSortBy] = useState("all")
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [replyText, setReplyText] = useState("")

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now(),
        user: "You",
        avatar: "/placeholder.svg",
        text: newComment,
        time: "now",
        reactions: {},
        replies: [],
      }
      setComments([comment, ...comments])
      setNewComment("")
    }
  }

  const handleAddReply = (commentId: number) => {
    if (replyText.trim()) {
      const reply = {
        id: Date.now(),
        user: "You",
        avatar: "/placeholder.svg",
        text: replyText,
        time: "now",
        reactions: {},
      }
      setComments(
        comments.map((comment) =>
          comment.id === commentId
            ? { ...comment, replies: [...comment.replies, reply] }
            : comment,
        ),
      )
      setReplyText("")
      setReplyingTo(null)
    }
  }

  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === "newest") return b.id - a.id
    return 0
  })

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] p-0" onEscapeKeyDown={onClose}>
        <div className="flex h-full min-h-0">
          {/* Left - Post Image */}
          <div className="flex-1 bg-black flex items-center justify-center overflow-hidden">
            <img
              src={post.image || "/placeholder.svg"}
              alt="Post"
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Right - Comments */}
          <div className="w-96 flex flex-col border-l border-border min-h-0">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={post.avatar || "/placeholder.svg"} alt={post.band} />
                  <AvatarFallback>{post.band.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-sm">{post.band}</h3>
                  <p className="text-xs text-muted-foreground">{post.postDate}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <ReactionButton reactions={post.reactions} />
              <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-muted-foreground">
                <MessageCircle className="h-4 w-4" />
                <span className="text-sm">{post.comments}</span>
              </Button>
            </div>

            {/* Sort */}
            <div className="px-4 py-2 border-b border-border">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sort comments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All comments</SelectItem>
                  <SelectItem value="newest">Newest first</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Comment List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
              {sortedComments.map((comment) => (
                <div key={comment.id} className="space-y-2">
                  <div className="flex space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.avatar} alt={comment.user} />
                      <AvatarFallback>{comment.user.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-muted rounded-lg p-3">
                        <p className="font-semibold text-sm">{comment.user}</p>
                        <p className="text-sm">{comment.text}</p>
                      </div>
                      <div className="flex items-center space-x-4 mt-1">
                        <ReactionButton reactions={comment.reactions} />
                        <button
                          className="text-xs text-muted-foreground hover:text-foreground"
                          onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                        >
                          Reply
                        </button>
                        <span className="text-xs text-muted-foreground">{comment.time}</span>
                      </div>
                    </div>
                  </div>

                  {/* Reply Input */}
                  {replyingTo === comment.id && (
                    <div className="flex space-x-2 ml-11 mt-2">
                      <Input
                        placeholder="Write a reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="flex-1"
                        onKeyDown={(e) => e.key === "Enter" && handleAddReply(comment.id)}
                      />
                      <Button size="sm" onClick={() => handleAddReply(comment.id)}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  {/* Replies */}
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="flex space-x-3 ml-11">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={reply.avatar} alt={reply.user} />
                        <AvatarFallback>{reply.user.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="bg-muted rounded-lg p-2">
                          <p className="font-semibold text-xs">{reply.user}</p>
                          <p className="text-xs">{reply.text}</p>
                        </div>
                        <div className="flex items-center space-x-4 mt-1">
                          <ReactionButton reactions={reply.reactions} />
                          <span className="text-xs text-muted-foreground">{reply.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Add Comment */}
            {replyingTo === null && (
              <div className="p-4 border-t border-border">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1"
                    onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                  />
                  <Button size="sm" onClick={handleAddComment}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
