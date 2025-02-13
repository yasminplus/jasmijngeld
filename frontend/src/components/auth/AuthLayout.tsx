import { Outlet } from "react-router";
import { Brand } from "@/components/Brand"

export default function AuthLayout() {
  return (
    <div>
      <Brand />
      <Outlet />
    </div>
  )
}