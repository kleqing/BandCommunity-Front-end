"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ShareModalProps {
  post: any
  onClose: () => void
}

export function ShareModal({ post, onClose }: ShareModalProps) {
  const [shareText, setShareText] = useState("")

  const handleShare = () => {
    // Handle share logic here
    console.log("Sharing post with text:", shareText)
    onClose()
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Post</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Share Text Input */}
          <div>
            <Textarea
              placeholder="Write something about this post..."
              value={shareText}
              onChange={(e) => setShareText(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          {/* Post Preview */}
          <div className="border border-border rounded-lg p-3 bg-muted/50">
            <div className="flex items-center space-x-3 mb-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={post.avatar || "/placeholder.svg"} alt={post.band} />
                <AvatarFallback>{post.band.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-sm">{post.band}</h3>
                <p className="text-xs text-muted-foreground">{post.postDate}</p>
              </div>
            </div>
            <img
              src={post.image || "/placeholder.svg"}
              alt="Post preview"
              className="w-full h-32 object-cover rounded"
            />
          </div>

          {/* Share Button */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleShare} className="bg-sky-500 hover:bg-sky-600">
              Share
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
