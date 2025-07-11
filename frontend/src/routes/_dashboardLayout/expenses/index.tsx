import { Plus } from "lucide-react"
import { useCallback, useEffect, useState } from 'react'
import { SearchSchemaInput, Link, createFileRoute } from '@tanstack/react-router'
import { toast } from "sonner"
import { z } from "zod"

import { Button } from '@/components/ui/button'

import { expensesColumns } from '@/components/expenses/columns-exp'
import { DataTable } from '@/components/expenses/data-table'
import { AlertDelete } from "@/components/alert-delete"

import { 
  Expense, 
  deleteExpense, 
  getExpenseList,
  getExpenseListPaginated
} from '@/services/expenses'
import OperationsType from '@/types/OperationsType'
import { PaginationState } from "@tanstack/react-table"

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

const DEFAULT_PAGE_SIZE = 20

function ListExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [cols, setCols] = useState(expensesColumns)
  const [totalData, setTotalData] = useState(0)
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0, //initial page index
    pageSize: DEFAULT_PAGE_SIZE, //default page size
  });

  const fetchTableData = useCallback(() => {
    getExpenseList()
    .then(data => setExpenses(data))
    .catch(err => {
      throw err
    })
  }, [])

  const fetchDataPaginated = useCallback(async (newPagination: PaginationState) => {
    getExpenseListPaginated(newPagination)
      .then(results => {
        setExpenses(results.rows)
        setTotalData(results.total)
      })
      .catch(err => {
        throw err
      })
  }, [])

  useEffect(() => {
    fetchDataPaginated(pagination)
  }, [fetchDataPaginated, pagination])

   useEffect(() => {
    const handleDelete = async(expense: Expense) => {
      const amount = `${expense.amount} ${expense.currency}`
      try {
        const success = await deleteExpense(expense.id)
        if (success) {
          // fetchTableData()
          fetchDataPaginated(pagination)
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
          cell: ({ row }) => {
            const expense = row.original
            return (
              <AlertDelete handleDelete={handleDelete} record={expense} recordType="expense" />
          )},
        }
      ])
    }
  } , [cols, fetchDataPaginated, pagination])

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
        pagination={pagination}
        setPagination={setPagination}
      />
    </div>
  )
}
