import { SideBar } from "@/components/SideBar";
import { Footer } from "@/components/Footer";
import { Outlet } from "react-router";

export function LayoutRoot() {
  return (
    <>
      <SideBar />
      <main className="grid grid-rows-[1fr_auto] min-h-screen">
        <Outlet />
        <Footer />
      </main>
    </>
  );
}
