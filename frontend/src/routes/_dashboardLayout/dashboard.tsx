import MonthlyCategoryPieChart from '@/components/dashboard/category-pie-chart';
import Last12MonthsBarChart from '@/components/dashboard/last-12months-bar-chart';
import { useAuthContext } from '@/context/auth';
import { createFileRoute } from '@tanstack/react-router';

import RecentExpenses from './-exp-dashboard';
import type { Proc12MoSummary } from '@/types/ExpenseSummaryType';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { getSummary12Months } from '@/services/expenses';
import CurrentExpense from '@/components/dashboard/current-expense';

export const Route = createFileRoute('/_dashboardLayout/dashboard')({
  component: DashboardHome,
})

function DashboardHome() {
  const authContext = useAuthContext()
  const [last12MonthsData, setLast12MonthsData] = useState<Proc12MoSummary[]>([])
  const [expThisMonth, setExpThisMonth] = useState<Proc12MoSummary>({month: '', IDR: 0, EUR: 0, USD: 0})
  
  useEffect(() => {
    getSummary12Months()
    .then(res => {
      setLast12MonthsData(res)
      const today = format( new Date(), 'MMM yyyy')
      const data = res.find(item => item.month === today)
      setExpThisMonth(data!)
    })
    .catch(err => {
      throw err
    })
  }, [])

  return (
    <div>
      <p>Hello, { authContext.user?.first_name } </p>
      <CurrentExpense passedData={expThisMonth} />
      <MonthlyCategoryPieChart />
      <Last12MonthsBarChart passedData={last12MonthsData} />
      <RecentExpenses />
    </div>
  )
}