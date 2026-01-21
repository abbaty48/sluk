import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ToggleTheme";
import { Library, MessageCircleMore, UserRound } from "lucide-react";

function SideBarNav() {
    return (
        <nav className="space-y-5 w-9/12 text-xs">
            <Link to={"/"} className={"flex flex-col flex-wrap p-2 gap-2 items-center justify-center hover:bg-sidebar-ring/20 hover:rounded-[20%]"} title="Homepage" aria-hidden>
                <Library size={20} />
                <span>Library</span>
            </Link>
            <Link to={"/"} className="flex flex-wrap p-2 gap-2 items-center justify-center hover:bg-sidebar-ring/20 hover:rounded-[20%]" aria-label="Contact us" title="Contact us for more information.">
                <MessageCircleMore size={20} />
                <span>Contact</span>
            </Link>
        </nav>
    )
}

export function SideBar() {
    return (
        <aside className="hidden md:flex flex-col items-center justify-between py-6 bg-sidebar h-screen w-20 border-r-sidebar-border text-sidebar-foreground border-r sticky top-0 left-0">
            <SideBarNav />
            <ul className="flex flex-col space-y-5">
                <Button type="button" variant={'ghost'} aria-label="User Profile" className="p-4 hover:bg-sidebar-ring/20 hover:rounded-full" >
                    <UserRound />
                </Button>
                <ThemeToggle />
            </ul>
        </aside >
    )
}
