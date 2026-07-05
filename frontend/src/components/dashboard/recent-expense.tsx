import { useCallback, useEffect, useState } from "react"
import { Link, linkOptions } from "@tanstack/react-router"
import {
  Card,
  CardContent,
  CardTitle
} from '@/components/ui/card';
import ExpenseRow from "@/components/dashboard/expense-row";
import { type Expense, getExpenseListPaginated } from "@/services/expenses"

export default function RecentExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([])

  const dashboardLinkOptions = linkOptions({
    to: '/expenses',
    search: { id: 0, op_type: 'none' },
  })

  const fetchData = useCallback(() => {
    getExpenseListPaginated({pageIndex: 0, pageSize: 10})
    .then(res => {
      setExpenses(res.rows)
    })
    .catch(err => {
      throw err
    })
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <Card>
      <CardContent>
        <CardTitle>
          <div className="flex flex-row justify-between mb-2">
            <h1 className="text-xl ">Recent expenses</h1>
            <Link {...dashboardLinkOptions} className="text-sm mt-1" >
              See all
            </Link>
          </div>
        </CardTitle>

        <div className="flex w-full flex-col">
          {expenses.map(exp => (
            <ExpenseRow expense={exp} key={exp.id} />
          ))}
        </div>

      </CardContent>
    </Card>
  )
}
