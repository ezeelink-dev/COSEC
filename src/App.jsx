import React from "react"
import './index.css'
import AppRoutes from "./routes"
import { Toaster } from "@/components/ui/toaster"
import { TooltipProvider} from "@/components/ui/tooltip"
import { ThemeProvider } from "@/components/theme-provider"

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <TooltipProvider>
      <div className="app overflow-hidden">
        <Toaster />
        <AppRoutes />
      </div>
      </TooltipProvider>
    </ThemeProvider>
  )
}

export default App
