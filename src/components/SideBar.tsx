import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/states/providers/themes";
import { Library, MessageCircleMore, Moon, SunDim, UserRound } from "lucide-react";

function SideBarNav() {
    return (
        <nav className="space-y-5 w-9/12 text-sm">
            <Link to={"/"} className={"flex flex-col flex-wrap p-4 gap-2 items-center justify-center hover:bg-sidebar-ring/20 hover:rounded-full"} title="Homepage" aria-hidden>
                <Library />
                <span>Library</span>
            </Link>
            <Link to={"/"} className="flex flex-wrap p-4 gap-2 items-center justify-center hover:bg-sidebar-ring/20 hover:rounded-full" aria-label="Contact us" title="Contact us for more information.">
                <MessageCircleMore />
                <span>Contact</span>
            </Link>
        </nav>
    )
}

function SideBarThemeToggle() {
    const { setTheme, theme } = useTheme()
    const nextTheme = theme === "dark" ? "light" : "dark"
    return (
        <Button type="button" variant={'ghost'} aria-hidden aria-label="Toggle Theme" className="p-4 hover:bg-sidebar-ring/20 hover:rounded-full" onClick={_ => setTheme(nextTheme)}>
            {nextTheme === "dark" ? (
                <SunDim />
            ) : (
                <Moon />
            )}
        </Button>
    )
}

export function SideBar() {
    return (
        <aside className="hidden md:flex flex-col items-center justify-between py-6 bg-sidebar-accent">
            <SideBarNav />
            <ul className="flex flex-col space-y-5">
                <Button type="button" variant={'ghost'} aria-label="User Profile" className="p-4 hover:bg-sidebar-ring/20 hover:rounded-full" >
                    <UserRound />
                </Button>
                <SideBarThemeToggle />
            </ul>
        </aside >
    )
}
