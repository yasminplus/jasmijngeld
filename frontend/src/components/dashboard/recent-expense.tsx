import { useCallback, useEffect, useState } from "react"
import { Link, linkOptions } from "@tanstack/react-router"
import {
  Card,
  CardContent,
  CardTitle
} from '@/components/ui/card';
import { type Expense, getExpenseListPaginated } from "@/services/expenses"
import ExpenseRow from "./expense-row";

export default function RecentExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const dashboardLinkOptions = linkOptions({
    to: '/expenses',
    search: { id: 0, op_type: 'none' },
  })

  const fetchTableData = useCallback(() => {
    getExpenseListPaginated({pageIndex: 0, pageSize: 10})
    .then(results => {
      setExpenses(results.rows)
    })
    .catch(err => {
      throw err
    })
  }, [])
  
  useEffect(() => {
    fetchTableData()
  }, [fetchTableData])

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
            <ExpenseRow expense={exp} />
          ))}
        </div>


      </CardContent>
    </Card>
  )
}
