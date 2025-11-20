import { useCallback, useEffect, useState } from 'react'
import { Plus } from "lucide-react"
import { createFileRoute, Link, useRouterState } from '@tanstack/react-router'
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

import { AlertDelete } from '@/components/alert-delete'
import { DataTable } from '@/components/sources/data-table'
import { sourcesColumns } from '@/components/sources/columns'
import { 
  type PaymentSource, 
  deletePaymentSource, 
  getPaymentSourceList 
} from '@/services/accounts-cards' 

export const Route = createFileRoute('/_dashboardLayout/accountscards/')({
  component: ListAccounts,
})

function ListAccounts() {
  const state = useRouterState({ select: s => s.location.state });
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
    if (state.message)
      toast.success(state.message)
  }, [state])

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
