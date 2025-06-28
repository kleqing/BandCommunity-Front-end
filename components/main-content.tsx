"use client"
import { MessageCircle, Share, MoreHorizontal, Repeat2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ReactionButton } from "@/components/reaction-button"
import { PostModal } from "@/components/post-modal"
import { ShareModal } from "@/components/share-modal"
import { useState } from "react"

const musicGenres = [
  { title: "Rock", description: "Classic rock vibes", gradient: "bg-gradient-to-br from-red-400 to-pink-500" },
  { title: "Jazz", description: "Smooth jazz", gradient: "bg-gradient-to-br from-blue-400 to-purple-500" },
  { title: "Electronic", description: "Digital beats", gradient: "bg-gradient-to-br from-purple-400 to-indigo-500" },
  { title: "Acoustic", description: "Unplugged", gradient: "bg-gradient-to-br from-green-400 to-teal-500" },
  { title: "Hip Hop", description: "Urban beats", gradient: "bg-gradient-to-br from-orange-400 to-red-500" },
  { title: "Classical", description: "Orchestral", gradient: "bg-gradient-to-br from-indigo-400 to-blue-500" },
]

const posts = [
  {
    id: 1,
    band: "Queen",
    avatar: "/placeholder.svg?height=40&width=40",
    postDate: "2 hours ago",
    image: "/placeholder.svg?height=300&width=500",
    reactions: { like: 834, love: 256, wow: 144 },
    comments: 89,
    shares: 45,
    isShared: false,
  },
  {
    id: 2,
    band: "The Beatles",
    avatar: "/placeholder.svg?height=40&width=40",
    postDate: "4 hours ago",
    image: "/placeholder.svg?height=300&width=500",
    reactions: { like: 1456, love: 456, laugh: 244 },
    comments: 156,
    shares: 78,
    isShared: true,
    sharedBy: "John Doe",
    sharedByAvatar: "/placeholder.svg?height=32&width=32",
    shareText: "Amazing performance! 🎸",
  },
  {
    id: 3,
    band: "Led Zeppelin",
    avatar: "/placeholder.svg?height=40&width=40",
    postDate: "6 hours ago",
    image: "/placeholder.svg?height=300&width=500",
    reactions: { like: 1234, love: 398, wow: 244 },
    comments: 234,
    shares: 92,
    isShared: false,
  },
  {
    id: 4,
    band: "Pink Floyd",
    avatar: "/placeholder.svg?height=40&width=40",
    postDate: "8 hours ago",
    image: "/placeholder.svg?height=300&width=500",
    reactions: { like: 987, love: 234, wow: 156 },
    comments: 67,
    shares: 34,
    isShared: true,
    sharedBy: "Music Lover",
    sharedByAvatar: "/placeholder.svg?height=32&width=32",
    shareText: "This song brings back so many memories! 💫",
  },
]

export function MainContent() {
  const [selectedPost, setSelectedPost] = useState<any>(null)
  const [sharePost, setSharePost] = useState<any>(null)

  return (
    <>
      <main className="flex-1 p-6 ml-20 mr-80 hide-scrollbar">
        <div className="space-y-6">
          {/* Music Genre Cards - Made smaller */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Discover Genre</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
              {musicGenres.map((genre, i) => (
                <div
                  key={i}
                  className={`aspect-square ${genre.gradient} rounded-lg flex flex-col items-center justify-center text-white cursor-pointer hover:scale-105 hover:shadow-lg transition-all duration-300 group relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />
                  <div className="relative z-10 text-center p-2">
                    <h3 className="font-bold text-sm mb-1">{genre.title}</h3>
                    <p className="text-xs opacity-90">{genre.description}</p>
                  </div>
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              ))}
            </div>
          </div>

          {/* Facebook-style Posts */}
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-background border border-border rounded-lg shadow-sm">
                {/* Shared Post Header */}
                {post.isShared && (
                  <div className="px-4 pt-3 pb-2">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Repeat2 className="h-4 w-4" />
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={post.sharedByAvatar || "/placeholder.svg"} alt={post.sharedBy} />
                        <AvatarFallback>{post.sharedBy?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{post.sharedBy}</span>
                      <span>shared this</span>
                    </div>
                    {post.shareText && <p className="mt-2 text-sm">{post.shareText}</p>}
                  </div>
                )}

                {/* Post Header */}
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={post.avatar || "/placeholder.svg"} alt={post.band} />
                      <AvatarFallback>{post.band.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-sm">{post.band}</h3>
                      <p className="text-xs text-muted-foreground">{post.postDate}</p>
                    </div>
                  </div>

                  {/* Three dots menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="p-2">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Hide post</DropdownMenuItem>
                      <DropdownMenuItem>Block this band</DropdownMenuItem>
                      <DropdownMenuItem>Report post</DropdownMenuItem>
                      <DropdownMenuItem>Save post</DropdownMenuItem>
                      <DropdownMenuItem>Copy link</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Post Image */}
                <div className="px-4 pb-4">
                  <img
                    src={post.image || "/placeholder.svg"}
                    alt="Post content"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>

                {/* Post Actions */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-border">
                  <ReactionButton reactions={post.reactions} />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-2 text-muted-foreground hover:text-blue-500"
                    onClick={() => setSelectedPost(post)}
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-sm">{post.comments}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-2 text-muted-foreground hover:text-green-500"
                    onClick={() => setSharePost(post)}
                  >
                    <Share className="h-4 w-4" />
                    <span className="text-sm">{post.shares}</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Post Modal for Comments */}
      {selectedPost && <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} />}

      {/* Share Modal */}
      {sharePost && <ShareModal post={sharePost} onClose={() => setSharePost(null)} />}
    </>
  )
}
