import { Outlet } from "react-router";

export function LayoutRoot() {
    return (
        <>
            {/* Header */}
            <main>
                <Outlet />
            </main>
            {/* Footer */}
        </>
    )
}
