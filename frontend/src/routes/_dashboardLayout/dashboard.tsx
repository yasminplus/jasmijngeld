import MonthlyCategoryPieChart from '@/components/expenses/category-pie-chart';
import Last12MonthsBarChart from '@/components/expenses/last-12months-bar-chart';
import { useAuthContext } from '@/context/auth';
import { createFileRoute } from '@tanstack/react-router';

import RecentExpenses from './-exp-dashboard';

export const Route = createFileRoute('/_dashboardLayout/dashboard')({
  component: DashboardHome,
})

function DashboardHome() {
  const authContext = useAuthContext()
  return (
    <div>
      <p>Hello, { authContext.user?.first_name } </p>
      <Last12MonthsBarChart />
      <MonthlyCategoryPieChart />
      <RecentExpenses />
    </div>
  )
}