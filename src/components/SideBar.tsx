import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Library, MessageCircleMore, SunDim, UserRound } from "lucide-react";

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

export function SideBar() {
    return (
        <aside className="hidden md:flex flex-col items-center justify-between py-6 bg-sidebar-accent">
            <SideBarNav />
            <ul className="space-y-5">
                <li><Button type="button" variant={'ghost'} aria-label="User Profile" className="p-4 hover:bg-sidebar-ring/20 hover:rounded-full" >
                    <UserRound />
                </Button>
                </li>
                <li><Button type="button" variant={'ghost'} aria-hidden aria-label="Toggle Theme" className="p-4 hover:bg-sidebar-ring/20 hover:rounded-full">
                    <SunDim />
                </Button>
                </li>
            </ul>
        </aside >
    )
}
