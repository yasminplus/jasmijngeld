import { createFileRoute } from '@tanstack/react-router'
import { useAuthContext } from '@/context/auth'
import RecentExpenses from './-exp-dashboard'

export const Route = createFileRoute('/_dashboardLayout/dashboard')({
  component: DashboardHome,
})

function DashboardHome() {
  const authContext = useAuthContext()
  return (
    <div>
      <p>Hello, { authContext.user?.first_name } </p>
      <RecentExpenses />
    </div>
  )
}