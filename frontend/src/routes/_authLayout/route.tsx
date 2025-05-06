import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Brand } from "@/components/Brand"

export const Route = createFileRoute('/_authLayout')({
  component: AuthLayout,
})

function AuthLayout() {
  return (
    <div>
      <Brand />
      <Outlet />
    </div>
  )
}
