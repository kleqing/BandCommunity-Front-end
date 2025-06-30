import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Band Community",
  description: "A clean and minimal UI layout with floating navbar and sidebar",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
          {children}
          <Toaster richColors theme="system" position="top-right"
            toastOptions={{
              style: { borderRadius: 8 },
              duration: 4000,
            }} />
        </ThemeProvider>
      </body>
    </html>
  )
}
