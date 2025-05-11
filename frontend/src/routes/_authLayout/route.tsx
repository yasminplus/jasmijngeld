import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Brand } from "@/components/Brand"


export const Route = createFileRoute('/_authLayout')({
  component: AuthLayout,
})

function AuthLayout() {
  return (
    <div style={{maxWidth: '320px', margin: '0 auto', padding: '2rem', textAlign: 'center'}}>
      <Brand />
      <Outlet />
    </div>
  )
}
