import MonthlyCategoryPieChart from '@/components/dashboard/category-pie-chart';
import Last12MonthsBarChart from '@/components/dashboard/last-12months-bar-chart';
import { useAuthContext } from '@/context/auth';
import { createFileRoute } from '@tanstack/react-router';

import RecentExpenses from './-exp-dashboard';
import type { Proc12MoSummary } from '@/types/ExpenseSummaryType';
import { useEffect, useState } from 'react';
import { getSummary12Months } from '@/services/expenses';

export const Route = createFileRoute('/_dashboardLayout/dashboard')({
  component: DashboardHome,
})

function DashboardHome() {
  const authContext = useAuthContext()
  const [last12MonthsData, setLast12MonthsData] = useState<Proc12MoSummary[]>([])

  useEffect(() => {
    getSummary12Months()
    .then(res => {
      setLast12MonthsData(res)
    })
    .catch(err => {
      throw err
    })
  }, [])

  return (
    <div>
      <p>Hello, { authContext.user?.first_name } </p>
      <MonthlyCategoryPieChart />
      <Last12MonthsBarChart passedData={last12MonthsData} />
      <RecentExpenses />
    </div>
  )
}