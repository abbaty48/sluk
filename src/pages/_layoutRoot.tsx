import { SideBar } from "@/components/SideBar";
import { Outlet } from "react-router";

export function LayoutRoot() {
    return (
        <>
            <SideBar />
            <main>
                <Outlet />
            </main>
        </>
    )
}
