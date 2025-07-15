import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Expense, getExpenseListPaginated } from "@/services/expenses"
import { useCallback, useEffect, useState } from "react"

export default function RecentExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([])

  const fetchTableData = useCallback(() => {
      getExpenseListPaginated({pageIndex: 0, pageSize: 5})
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
    <div className="w-80 mt-2">
      <h1 className="text-xl mb-2">Recent 5 expenses</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Currency</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((exp) => (
            <TableRow key={`${exp.amount}-${exp.date}-${exp.description}`}>
              <TableCell>{exp.date}</TableCell>
              <TableCell>{exp.amount}</TableCell>
              <TableCell>{exp.currency}</TableCell>
              <TableCell>{exp.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
