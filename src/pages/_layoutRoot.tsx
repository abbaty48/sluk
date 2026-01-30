import { Footer } from "@/components/Footer";
import { SideBar } from "@/components/SideBar";
import { Outlet } from "react-router";

export function LayoutRoot() {
  return (
    <>
      <SideBar />
      <main>
        <Outlet />
        <Footer />
      </main>
    </>
  );
}
