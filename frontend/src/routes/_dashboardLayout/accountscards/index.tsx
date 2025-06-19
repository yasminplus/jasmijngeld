import { useCallback, useEffect, useState } from 'react'
import { Plus, Trash } from "lucide-react"
import { SearchSchemaInput, createFileRoute, Link } from '@tanstack/react-router'
import { z } from "zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

import { PaymentSource, deletePaymentSource, getPaymentSourceList } from '@/services/accounts-cards' 
import { DataTable } from '@/components/sources/data-table'
import { sourcesColumns } from '@/components/sources/columns'

type OperationsType = 'create' | 'update' | 'none'

export const Route = createFileRoute('/_dashboardLayout/accountscards/')({
  component: ListAccounts,
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
        toast.success(`Payment source has been updated`)
      } else if (op_type === 'create') {
        toast.success(`A new payment source has been created`)
      }
    }
  }
})

function ListAccounts() {
  const [ accounts, setAccounts ] = useState<PaymentSource[]>([])
  const [ cols, setCols ] = useState(sourcesColumns)
  // const { id, op_type } = Route.useSearch()

  const handleDelete = async(source: PaymentSource) => {
    const name = source.name
    try {
      const success = await deletePaymentSource(source.id)
      if (success) {
        fetchTableData()
        toast.success(`Payment source ${name} has been deleted`)
      } else {
        throw new Error('API return false')
      }
    }
    catch (err) {
      toast.error(`Unable to delete payment source ${name}, perhaps this is linked to some expenses.`)
      console.error(err)
    }
  }

  const fetchTableData = useCallback(() => {
    getPaymentSourceList()
    .then(data => setAccounts(data))
    .catch(err => {
      throw err
    })
  }, [])

  useEffect(() => {
    if (cols.length == 4) {
      setCols(prev => [
        ...prev,
        {
          id: "delete_action",
          cell: ({ row }) => {
            const source = row.original
          return (
            <Button className='p-0 w-8 h-8' onClick={() => handleDelete(source)}>
              <Trash />
            </Button>
          )},
        }
      ])
    }
  } , [cols])

  useEffect(() => {
    fetchTableData()
  }, [fetchTableData]);

  return (
    <div>
      <Link to={'/dashboard'} >
        <Button className='mb-4'>
          <Plus />Add new account/card
        </Button>
      </Link>

      <DataTable columns={cols} data={accounts}  />
    </div>
  )
}
