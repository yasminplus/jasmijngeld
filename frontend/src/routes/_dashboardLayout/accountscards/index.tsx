import { useCallback, useEffect, useState } from 'react'
import { Plus } from "lucide-react"
import { type SearchSchemaInput, createFileRoute, Link } from '@tanstack/react-router'
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"

import { AlertDelete } from '@/components/alert-delete'
import { DataTable } from '@/components/sources/data-table'
import { sourcesColumns } from '@/components/sources/columns'
import { 
  type PaymentSource, 
  deletePaymentSource, 
  getPaymentSourceList 
} from '@/services/accounts-cards' 
import type OperationsType from '@/types/OperationsType'

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

  const fetchTableData = useCallback(() => {
    getPaymentSourceList()
    .then(data => setAccounts(data))
    .catch(err => {
      throw err
    })
  }, [])

  useEffect(() => {
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
  
    if (cols.length == 4) {
      setCols(prev => [
        ...prev,
        {
          id: "delete_action",
          cell: ({ row }) => {
            const source = row.original
          return (
            <AlertDelete handleDelete={handleDelete} record={source} recordType='payment source' />
          )},
        }
      ])
    }
  } , [cols, fetchTableData])

  useEffect(() => {
    fetchTableData()
  }, [fetchTableData]);

  return (
    <div>
      <Link to={'/accountscards/new'} >
        <Button className='mb-4'>
          <Plus />Add new account/card
        </Button>
      </Link>

      <DataTable columns={cols} data={accounts}  />
    </div>
  )
}
