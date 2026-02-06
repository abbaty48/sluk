import { NavLink } from "react-router";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ToggleTheme";
import {
  BookOpen,
  Brain,
  Download,
  HardDriveDownload,
  History,
  Sparkle,
  Sparkles,
  UserRound,
} from "lucide-react";

function SideBarNav() {
  return (
    <nav className="space-y-5 w-9/12 text-xs">
      <NavLink
        to={"/"}
        className={({ isActive }) =>
          `flex flex-col flex-wrap p-2 gap-2 items-center justify-center hover:bg-sidebar-ring/20 hover:rounded-[20%] ${isActive ? "bg-sidebar-ring/20 rounded-[20%]" : ""} `
        }
        title="Homepage"
        aria-hidden
      >
        <BookOpen size={20} />
        <span>Library</span>
      </NavLink>
      <NavLink
        to={"/recent-articles"}
        className={({ isActive }) =>
          `flex flex-wrap p-2 gap-2 items-center justify-center hover:bg-sidebar-ring/20 hover:rounded-[20%] ${isActive ? "bg-sidebar-ring/20 rounded-[20%]" : ""} `
        }
        aria-label="Recent articles you've viewed."
        title="Recent articles you've opened."
      >
        <History size={20} />
        <span>Recent's</span>
      </NavLink>
      <NavLink
        to={"/ai-articles"}
        className={({ isActive }) =>
          `flex flex-wrap p-2 gap-1 items-center justify-center hover:bg-sidebar-ring/20 hover:rounded-[20%] ${isActive ? "bg-sidebar-ring/20 rounded-[20%]" : ""} `
        }
        aria-label="Artificiant Interllegent."
        title="AI"
      >
        <Sparkles size={20} />
        <span>AI</span>
      </NavLink>
    </nav>
  );
}

export function SideBar() {
  return (
    <aside className="hidden md:flex flex-col items-center justify-between py-6 bg-sidebar h-screen w-20 border-r-sidebar-border text-sidebar-foreground border-r sticky top-0 left-0">
      <SideBarNav />
      <ul className="flex flex-col space-y-5">
        <Button
          type="button"
          variant={"ghost"}
          aria-label="User Profile"
          className="p-4 hover:bg-sidebar-ring/20 hover:rounded-full"
        >
          <UserRound />
        </Button>
        <Button
          type="button"
          variant={"ghost"}
          aria-label="Install the website."
          className="p-4 hover:bg-sidebar-ring/20 hover:rounded-full"
        >
          <HardDriveDownload />
        </Button>
        <ThemeToggle />
      </ul>
    </aside>
  );
}
