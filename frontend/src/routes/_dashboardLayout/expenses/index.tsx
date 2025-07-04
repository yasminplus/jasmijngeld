import { Plus } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { SearchSchemaInput, Link, createFileRoute } from '@tanstack/react-router'
import { toast } from "sonner"
import { z } from "zod"

import { expensesColumns } from '@/components/expenses/columns-exp'
import { DataTable } from '@/components/expenses/data-table'
import { Button } from '@/components/ui/button'

import { Expense, getExpenseList } from '@/services/expenses'
import OperationsType from '@/types/OperationsType'

export const Route = createFileRoute('/_dashboardLayout/expenses/')({
  component: ListExpenses,
  validateSearch: (
    input: {
      op_type: OperationsType
      id: number
    } & SearchSchemaInput,
  ) => {
      return z
        .object({
          id: z.number().catch(0),
          op_type: z.enum(['create', 'update', 'none']).catch('none'),
        })
        .parse(input)
    },
  
  loaderDeps: ({ search: {  id, op_type  } }) => ({  id, op_type  }),
  loader: ({ deps: { id, op_type } }) => {
    // TODO: use id to get the name of the object
    if (id > 0) {
      if (op_type === 'update') {
        toast.success(`Expense has been updated`)
      } else if (op_type === 'create') {
        toast.success(`A new expense has been created`)
      }
    }
  }
})

function ListExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [cols] = useState(expensesColumns)

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
      <Link to={'/expenses/new'} >
        <Button className='mb-4'>
          <Plus />Add new expense
        </Button>
      </Link>

      <DataTable columns={cols} data={expenses} />
    </div>
  )
}
