import { useEffect, useState } from 'react'
import { Plus, Trash } from "lucide-react"
import { SearchSchemaInput, createFileRoute, Link } from '@tanstack/react-router'
import { z } from "zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

import { PaymentSource, deletePaymentSource, getPaymentSourceList } from '@/services/accounts-cards' 
import { DataTable } from '@/components/sources/data-table'
import { sourcesColumns } from '@/components/sources/columns'

type OperationsType = 'create' | 'update' | 'delete'

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
          op_type: z.enum(['create', 'update', 'delete', 'none']).catch('create'),
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
      } else if (op_type === 'delete') {
        toast.success(`Payment source has been deleted`)
      }
    }

  }
})

function ListAccounts() {
  const [ accounts, setAccounts ] = useState<PaymentSource[]>([])
  const [ cols, setCols ] = useState(sourcesColumns)
  // const { id, op_type } = Route.useSearch()

  const handleDelete = async(id: number) => {
    try {
      const res = await deletePaymentSource(id)
      console.log(res)
      // TODO: refresh table
    }
    catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (cols.length == 4) {
      setCols(prev => [
        ...prev,
        {
          id: "delete_action",
          cell: ({ row }) => {
            const source = row.original
          return (
            <Button className='p-0 w-8 h-8' onClick={() => handleDelete(source.id)}>
              <Trash />
            </Button>
          )},
        }
      ])
    }
  } , [cols])

  useEffect(() => {
    getPaymentSourceList()
    .then(data => setAccounts(data))
    .catch(err => {
      throw err
    })
  }, []);

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
