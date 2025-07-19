import { createFileRoute } from '@tanstack/react-router'
import { useAuthContext } from '@/context/auth'
import RecentExpenses from './-exp-dashboard'
import Last12MonthsBarChart from '@/components/expenses/last-12months-bar-chart'

export const Route = createFileRoute('/_dashboardLayout/dashboard')({
  component: DashboardHome,
})

function DashboardHome() {
  const authContext = useAuthContext()
  return (
    <div>
      <p>Hello, { authContext.user?.first_name } </p>
      <Last12MonthsBarChart />
      <RecentExpenses />
    </div>
  )
}