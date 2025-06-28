import { Search, Clock, TrendingUp } from "lucide-react"

const recentSearches = ["React components", "TypeScript tutorial", "UI design"]
const trendingSearches = ["Next.js 14", "Tailwind CSS", "shadcn/ui"]

export function SearchDropdown() {
  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg p-4 z-50">
      <div className="space-y-4">
        {/* Recent Searches */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Recent</span>
          </div>
          <div className="space-y-1">
            {recentSearches.map((search) => (
              <div key={search} className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded cursor-pointer">
                <Search className="h-3 w-3 text-muted-foreground" />
                <span className="text-sm">{search}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trending */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Trending</span>
          </div>
          <div className="space-y-1">
            {trendingSearches.map((search) => (
              <div key={search} className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded cursor-pointer">
                <TrendingUp className="h-3 w-3 text-muted-foreground" />
                <span className="text-sm">{search}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
