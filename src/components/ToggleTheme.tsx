import { useTheme } from "@/states/providers/themes"
import { Button } from "@/components/ui/button"
import { Moon, SunDim } from "lucide-react"

export function ThemeToggle() {
    const { setTheme, theme } = useTheme()
    const nextTheme = theme === "dark" ? "light" : "dark"
    return (
        <Button type="button" variant={'ghost'} aria-hidden aria-label="Toggle Theme" className="p-4 hover:bg-sidebar-ring/20 hover:rounded-full" onClick={() => setTheme(nextTheme)}>
            {nextTheme === "dark" ? (
                <SunDim />
            ) : (
                <Moon />
            )}
        </Button>
    )
}
