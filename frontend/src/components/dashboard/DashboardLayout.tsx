import { Outlet } from "react-router";
// import { Brand } from "@/components/Brand"
import Sidebar from "./Sidebar";

export default function DashboardLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="bg-sky-400">
        <Outlet />
      </main>
    </div>
  )
}