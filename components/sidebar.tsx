"use client"

import { Home, Compass, Bookmark, Music, List, Users, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const topSidebarItems = [
  { icon: Home, label: "Home", active: true },
  { icon: Compass, label: "Explorer", active: false },
  { icon: Bookmark, label: "Saved", active: false },
  { icon: Music, label: "Music", active: false },
  { icon: List, label: "Playlist", active: false },
  { icon: Users, label: "Artist", active: false },
]

const bottomSidebarItems = [{ icon: Settings, label: "Settings", active: false }]

export function Sidebar() {
  return (
    <aside className="fixed left-4 top-24 h-[calc(100vh-8rem)] w-16 flex flex-col">
      <div className="flex-1 flex flex-col items-center space-y-6 py-6">
        {topSidebarItems.map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            className={cn(
              "flex flex-col items-center justify-center p-0 hover:bg-muted/50 group mx-0 py-0 h-[70px] w-[70px]",
              item.active && "bg-muted",
            )}
          >
            <item.icon
              className={cn(
                "h-5 w-5 mb-1 transition-colors",
                item.active ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
              )}
            />
            <span
              className={cn(
                "text-xs transition-colors",
                item.active ? "text-primary font-medium" : "text-muted-foreground group-hover:text-foreground",
              )}
            >
              {item.label}
            </span>
          </Button>
        ))}
      </div>

      {/* Bottom Settings */}
      <div className="pb-6">
        {bottomSidebarItems.map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            className={cn(
              "flex flex-col items-center justify-center p-0 hover:bg-muted/50 group mx-0 py-0 h-[70px] w-[70px]",
              item.active && "bg-muted",
            )}
          >
            <item.icon
              className={cn(
                "h-5 w-5 mb-1 transition-colors",
                item.active ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
              )}
            />
            <span
              className={cn(
                "text-xs transition-colors",
                item.active ? "text-primary font-medium" : "text-muted-foreground group-hover:text-foreground",
              )}
            >
              {item.label}
            </span>
          </Button>
        ))}
      </div>
    </aside>
  )
}
