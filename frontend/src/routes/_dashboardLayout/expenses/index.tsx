import { Plus } from "lucide-react"
import { useCallback, useEffect, useState } from 'react'
import { Link, createFileRoute, useRouterState } from '@tanstack/react-router'
import { toast } from "sonner"

import { Button } from '@/components/ui/button'

import { expensesColumns } from '@/components/expenses/columns-exp'
import { DataTable } from '@/components/expenses/data-table'
import { AlertDelete } from "@/components/alert-delete"

import { 
  type Expense, 
  deleteExpense, 
  getExpenseList,
} from '@/services/expenses'

export const Route = createFileRoute('/_dashboardLayout/expenses/')({
  component: ListExpenses,
})

function ListExpenses() {
  const state = useRouterState({ select: s => s.location.state });
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [cols, setCols] = useState(expensesColumns)
  const [totalData, setTotalData] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchTableData = useCallback(() => {
    getExpenseList()
    .then(results => {
      setExpenses(results.rows)
      setTotalData(results.total)
      setLoading(false)
    })
    .catch(err => {
      throw err
    })
  }, [])

  useEffect(() => {
    if (state.message)
      toast.success(state.message)
  }, [state])

  useEffect(() => {
    fetchTableData()
  }, [fetchTableData])

  useEffect(() => {
    const handleDelete = async(expense: Expense) => {
      const amount = `${expense.amount} ${expense.currency}`
      try {
        const success = await deleteExpense(expense.id)
        if (success) {
          fetchTableData()
          // fetchDataPaginated(pagination)
          toast.success(`Expense with the amount ${amount} has been deleted`)
        } else {
          throw new Error('API return false')
        }
      }
      catch (err) {
        toast.error(`Unable to delete expense with the amount ${amount}.`)
        console.error(err)
      }
    }

    if (cols.length == 8) {
      setCols(prev => [
        ...prev,
        {
          id: "delete_action",
          header: '',
          cell: ({ row }) => {
            const expense = row.original
            return (
              <AlertDelete handleDelete={handleDelete} record={expense} recordType="expense" />
          )},
        }
      ])
    }
  } , [cols, fetchTableData])

  return (
    <div>
      <Link to={'/expenses/new'} >
        <Button className='mb-4'>
          <Plus />Add new expense
        </Button>
      </Link>

      <DataTable 
        columns={cols} 
        data={expenses}
        totalData={totalData}
        loading={loading}
      />
    </div>
  )
}
