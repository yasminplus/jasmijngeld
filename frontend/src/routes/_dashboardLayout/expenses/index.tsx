import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboardLayout/expenses/')({
  component: ListExpenses,
})

import { DataTable } from '@/components/sources/data-table'
import { useCallback, useEffect, useState } from 'react'
import { expensesColumns } from '@/components/expenses/columns-exp'
import { Expense, getExpenseList } from '@/services/expenses'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'


function ListExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [cols, setCols] = useState(expensesColumns)

  const fetchTableData = useCallback(() => {
    getExpenseList()
    .then(data => setExpenses(data))
    .catch(err => {
      throw err
    })
  }, [])

  useEffect(() => {
    fetchTableData()
  }, [fetchTableData])

  return (
    <div>
      <Link to={''} >
        <Button className='mb-4'>
          <Plus />Add new expense
        </Button>
      </Link>

      <DataTable columns={cols} data={expenses} />
    </div>
  )
}
