import { useEffect, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { format } from 'date-fns';

import { useAuthContext } from '@/context/auth';
import Last12MonthsBarChart from '@/components/dashboard/last-12months-bar-chart';
import MonthlyCategoryPieChart from '@/components/dashboard/monthly-category-pie-chart';
import MonthlySourcePieChart from '@/components/dashboard/monthly-source-pie-chart';
import CurrentExpense from '@/components/dashboard/current-expense';
import RecentExpenses from '@/components/dashboard/recent-expense';
import { getSummary12Months } from '@/services/expenses';
import type { Proc12MoSummary } from '@/types/ExpenseSummaryType';
import CurrencyRadioGroup from '@/components/currency-radio-group';
import { useGlobalDataContext } from '@/context/globaldata';

export const Route = createFileRoute('/_dashboardLayout/dashboard')({
  component: DashboardHome,
})

function DashboardHome() {
  const authContext = useAuthContext()
  const globalDataContext = useGlobalDataContext()
  const [last12MonthsData, setLast12MonthsData] = useState<Proc12MoSummary[]>([])
  const [expThisMonth, setExpThisMonth] = useState<Proc12MoSummary>(
    {month: '', IDR: 0, EUR: 0, USD: 0}
  )
  const [currency, setCurrency] = useState(globalDataContext.defaultCurrency)

  useEffect(() => {
    /**
     * TODO: we either need to pass the enabled currencies 
     * to the getSummary function, or find a way to
     * use the context from non-React component.
     */

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
      {/* TODO: Greeting is good but dont know yet where to put. */}
      {/* <p>Hello, { authContext.user?.first_name } </p> */}
      <CurrencyRadioGroup currency={currency} setCurrency={setCurrency} />
      {/* TODO: maybe we can place this part within the main grid. */}
        <div className="grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-2 gap-4">
          <CurrentExpense passedData={expThisMonth} currency={currency}  />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 lg:grid-rows-[auto_1fr_1.2fr] xl:grid-rows-[auto_1fr] gap-4">
          <div className="col-start-1 row-start-1 ">
            <MonthlyCategoryPieChart currency={currency} />
          </div>
          <div className="col-start-1 lg:col-start-2 row-start-2 lg:row-start-1 ">
            <MonthlySourcePieChart currency={currency} />
          </div>
          <div className="col-start-1 lg:col-span-2 xl:row-start-2">
            <Last12MonthsBarChart passedData={last12MonthsData} currency={currency}  />
          </div>
          <div className="col-start-1 xl:col-start-3 xl:row-span-full">
            <RecentExpenses />
          </div>
        </div>
    </div>
  )
}