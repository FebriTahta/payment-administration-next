'use client'
import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function DarkThemeButton() {
  const { theme, setTheme } = useTheme()

  return (
    <Button className="dark:bg-gray-800 w-[50px]" variant="outline" size="icon" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      {theme === "light" ? (
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      )}
      <span className="sr-only">ThemeButton</span>
    </Button>
  )
}