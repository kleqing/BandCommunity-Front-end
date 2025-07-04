"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    Camera,
    Edit,
    MapPin,
    Calendar,
    Briefcase,
    GraduationCap,
    Heart,
    Music,
    Clock,
    Users,
    MoreHorizontal,
    MessageCircle,
    UserPlus,
} from "lucide-react"

// Mock user data
const profileUser = {
    id: 1,
    name: "John Doe",
    username: "@johndoe",
    avatar: "/placeholder.svg?height=160&width=160",
    bio: "Music lover, photographer, and coffee enthusiast ☕ Living life one beat at a time 🎵",
    location: "San Francisco, CA",
    joinDate: "Joined March 2020",
    work: "Software Engineer at TechCorp",
    education: "University of California, Berkeley",
    relationship: "Single",
    followers: 1234,
    following: 567,
    friends: 892,
    isOwnProfile: true, // Set to false for other users' profiles
}

// Mock recent images
const recentImages = [
    { id: 1, src: "/placeholder.svg?height=200&width=200", alt: "Concert photo" },
    { id: 2, src: "/placeholder.svg?height=200&width=200", alt: "Studio session" },
    { id: 3, src: "/placeholder.svg?height=200&width=200", alt: "Music festival" },
    { id: 4, src: "/placeholder.svg?height=200&width=200", alt: "Band practice" },
    { id: 5, src: "/placeholder.svg?height=200&width=200", alt: "Recording session" },
    { id: 6, src: "/placeholder.svg?height=200&width=200", alt: "Live performance" },
    { id: 7, src: "/placeholder.svg?height=200&width=200", alt: "Backstage" },
    { id: 8, src: "/placeholder.svg?height=200&width=200", alt: "Sound check" },
    { id: 9, src: "/placeholder.svg?height=200&width=200", alt: "Jam session" },
]

// Mock recent played - changed from now playing
const recentPlayed = {
    title: "Bohemian Rhapsody",
    artist: "Queen",
    cover: "/placeholder.svg?height=40&width=40",
}

// Mock recent activity
const recentActivity = [
    {
        id: 1,
        title: "Hotel California",
        artist: "Eagles",
        time: "2 hours ago",
        cover: "/placeholder.svg?height=40&width=40",
    },
    {
        id: 2,
        title: "Stairway to Heaven",
        artist: "Led Zeppelin",
        time: "4 hours ago",
        cover: "/placeholder.svg?height=40&width=40",
    },
    {
        id: 3,
        title: "Sweet Child O' Mine",
        artist: "Guns N' Roses",
        time: "6 hours ago",
        cover: "/placeholder.svg?height=40&width=40",
    },
    { id: 4, title: "Imagine", artist: "John Lennon", time: "8 hours ago", cover: "/placeholder.svg?height=40&width=40" },
    {
        id: 5,
        title: "Billie Jean",
        artist: "Michael Jackson",
        time: "10 hours ago",
        cover: "/placeholder.svg?height=40&width=40",
    },
]

// Mock friends list
const friends = [
    { id: 1, name: "Alice Johnson", avatar: "/placeholder.svg?height=80&width=80", mutualFriends: 12 },
    { id: 2, name: "Bob Smith", avatar: "/placeholder.svg?height=80&width=80", mutualFriends: 8 },
    { id: 3, name: "Carol Davis", avatar: "/placeholder.svg?height=80&width=80", mutualFriends: 15 },
    { id: 4, name: "David Wilson", avatar: "/placeholder.svg?height=80&width=80", mutualFriends: 6 },
    { id: 5, name: "Emma Brown", avatar: "/placeholder.svg?height=80&width=80", mutualFriends: 9 },
    { id: 6, name: "Frank Miller", avatar: "/placeholder.svg?height=80&width=80", mutualFriends: 11 },
    { id: 7, name: "Grace Lee", avatar: "/placeholder.svg?height=80&width=80", mutualFriends: 7 },
    { id: 8, name: "Henry Taylor", avatar: "/placeholder.svg?height=80&width=80", mutualFriends: 13 },
    { id: 9, name: "Ivy Chen", avatar: "/placeholder.svg?height=80&width=80", mutualFriends: 5 },
]

export function ProfilePage() {
    const [activeTab, setActiveTab] = useState("posts")

    return (
        <div className="min-h-screen bg-background">
            {/* Profile Header */}
            <div className="bg-background border-b border-border">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6">
                        {/* Profile Picture */}
                        <div className="relative">
                            <Avatar className="h-40 w-40 border-4 border-background shadow-lg">
                                <AvatarImage src={profileUser.avatar || "/placeholder.svg"} alt={profileUser.name} />
                                <AvatarFallback className="text-4xl">
                                    {profileUser.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                </AvatarFallback>
                            </Avatar>
                            {profileUser.isOwnProfile && (
                                <Button
                                    size="sm"
                                    className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-muted hover:bg-muted/80 p-0"
                                >
                                    <Camera className="h-4 w-4" />
                                </Button>
                            )}
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1 space-y-2">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold">{profileUser.name}</h1>
                                    <p className="text-muted-foreground">{profileUser.username}</p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                                    {profileUser.isOwnProfile ? (
                                        <>
                                            <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                                                <Edit className="h-4 w-4" />
                                                <span>Edit Profile</span>
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button className="bg-sky-500 hover:bg-sky-600 flex items-center space-x-2">
                                                <UserPlus className="h-4 w-4" />
                                                <span>Add Friend</span>
                                            </Button>
                                            <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                                                <MessageCircle className="h-4 w-4" />
                                                <span>Message</span>
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center space-x-6 text-sm">
                                <span>
                                    <strong>{profileUser.friends}</strong> friends
                                </span>
                                <span>
                                    <strong>{profileUser.followers}</strong> followers
                                </span>
                                <span>
                                    <strong>{profileUser.following}</strong> following
                                </span>
                            </div>

                            {/* Bio */}
                            {profileUser.bio && <p className="text-sm max-w-2xl">{profileUser.bio}</p>}

                            {/* Details */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                {profileUser.work && (
                                    <div className="flex items-center space-x-1">
                                        <Briefcase className="h-4 w-4" />
                                        <span>{profileUser.work}</span>
                                    </div>
                                )}
                                {profileUser.education && (
                                    <div className="flex items-center space-x-1">
                                        <GraduationCap className="h-4 w-4" />
                                        <span>{profileUser.education}</span>
                                    </div>
                                )}
                                {profileUser.location && (
                                    <div className="flex items-center space-x-1">
                                        <MapPin className="h-4 w-4" />
                                        <span>{profileUser.location}</span>
                                    </div>
                                )}
                                {profileUser.relationship && (
                                    <div className="flex items-center space-x-1">
                                        <Heart className="h-4 w-4" />
                                        <span>{profileUser.relationship}</span>
                                    </div>
                                )}
                                <div className="flex items-center space-x-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>{profileUser.joinDate}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-6xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Sidebar */}
                    <div className="space-y-6">
                        {/* Recent Played - Changed from Now Playing */}
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center space-x-2 mb-3">
                                    <Music className="h-4 w-4 text-sky-500" />
                                    <h3 className="font-medium text-sm">Recent Played</h3>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="h-10 w-10 bg-muted rounded-md flex items-center justify-center overflow-hidden">
                                        <img
                                            src={recentPlayed.cover || "/placeholder.svg"}
                                            alt={recentPlayed.title}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{recentPlayed.title}</p>
                                        <p className="text-xs text-muted-foreground truncate">{recentPlayed.artist}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Activity */}
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center space-x-2 mb-4">
                                    <Clock className="h-5 w-5 text-green-500" />
                                    <h3 className="font-semibold">Recent Activity</h3>
                                </div>
                                <div className="space-y-3">
                                    {recentActivity.map((track) => (
                                        <div key={track.id} className="flex items-center space-x-3">
                                            <img
                                                src={track.cover || "/placeholder.svg"}
                                                alt={track.title}
                                                className="h-10 w-10 rounded object-cover"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{track.title}</p>
                                                <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                                            </div>
                                            <span className="text-xs text-muted-foreground">{track.time}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Friends */}
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-2">
                                        <Users className="h-5 w-5 text-blue-500" />
                                        <h3 className="font-semibold">Friends</h3>
                                        <span className="text-sm text-muted-foreground">({profileUser.friends})</span>
                                    </div>
                                    <Button variant="ghost" size="sm" className="text-sky-500 hover:text-sky-600">
                                        See all
                                    </Button>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    {friends.slice(0, 9).map((friend) => (
                                        <div key={friend.id} className="text-center">
                                            <Avatar className="h-16 w-16 mx-auto mb-2">
                                                <AvatarImage src={friend.avatar || "/placeholder.svg"} alt={friend.name} />
                                                <AvatarFallback>
                                                    {friend.name
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")}
                                                </AvatarFallback>
                                            </Avatar>
                                            <p className="text-xs font-medium truncate">{friend.name}</p>
                                            <p className="text-xs text-muted-foreground">{friend.mutualFriends} mutual</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Navigation Tabs - Reordered: Posts -> Photos -> About */}
                        <Card>
                            <CardContent className="p-0">
                                <div className="flex border-b border-border">
                                    <button
                                        onClick={() => setActiveTab("posts")}
                                        className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "posts"
                                                ? "border-sky-500 text-sky-500"
                                                : "border-transparent text-muted-foreground hover:text-foreground"
                                            }`}
                                    >
                                        Posts
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("photos")}
                                        className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "photos"
                                                ? "border-sky-500 text-sky-500"
                                                : "border-transparent text-muted-foreground hover:text-foreground"
                                            }`}
                                    >
                                        Photos
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("about")}
                                        className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "about"
                                                ? "border-sky-500 text-sky-500"
                                                : "border-transparent text-muted-foreground hover:text-foreground"
                                            }`}
                                    >
                                        About
                                    </button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tab Content */}
                        {activeTab === "posts" && (
                            <Card>
                                <CardContent className="p-4">
                                    <div className="text-center py-12">
                                        <p className="text-muted-foreground">No posts to show</p>
                                        <p className="text-sm text-muted-foreground mt-2">
                                            When {profileUser.isOwnProfile ? "you" : profileUser.name} posts something, it will appear here.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {activeTab === "photos" && (
                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-semibold">Recent Photos</h3>
                                        <Button variant="ghost" size="sm" className="text-sky-500 hover:text-sky-600">
                                            See all photos
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        {recentImages.map((image) => (
                                            <div
                                                key={image.id}
                                                className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                                            >
                                                <img
                                                    src={image.src || "/placeholder.svg"}
                                                    alt={image.alt}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {activeTab === "about" && (
                            <Card>
                                <CardContent className="p-4">
                                    <h3 className="font-semibold mb-4">About</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-3">
                                            <Briefcase className="h-5 w-5 text-muted-foreground" />
                                            <div>
                                                <p className="font-medium">Work</p>
                                                <p className="text-sm text-muted-foreground">{profileUser.work}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <GraduationCap className="h-5 w-5 text-muted-foreground" />
                                            <div>
                                                <p className="font-medium">Education</p>
                                                <p className="text-sm text-muted-foreground">{profileUser.education}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <MapPin className="h-5 w-5 text-muted-foreground" />
                                            <div>
                                                <p className="font-medium">Lives in</p>
                                                <p className="text-sm text-muted-foreground">{profileUser.location}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <Heart className="h-5 w-5 text-muted-foreground" />
                                            <div>
                                                <p className="font-medium">Relationship Status</p>
                                                <p className="text-sm text-muted-foreground">{profileUser.relationship}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <Calendar className="h-5 w-5 text-muted-foreground" />
                                            <div>
                                                <p className="font-medium">Joined</p>
                                                <p className="text-sm text-muted-foreground">{profileUser.joinDate}</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
