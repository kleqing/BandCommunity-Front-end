import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { MainContent } from "@/components/main-content"
import { RightPanel } from "@/components/right-panel"

export default function Home() {
  return (
    <div className="min-h-screen bg-background hide-scrollbar">
      <Navbar />
      <div className="flex pt-20">
        <Sidebar />
        <MainContent />
        <RightPanel />
      </div>
    </div>
  )
}
