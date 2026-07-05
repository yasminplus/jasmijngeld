import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Brand } from "@/components/Brand"


export const Route = createFileRoute('/_authLayout')({
  component: AuthLayout,
})

function AuthLayout() {
  return (
    <div className="max-w-sm mx-auto my-0 p-8 text-center">
      <Brand pb="pb-14"/>
      <Outlet />
    </div>
  )
}
