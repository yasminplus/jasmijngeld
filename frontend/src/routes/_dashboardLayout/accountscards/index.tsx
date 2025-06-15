import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Button } from "@/components/ui/button"

import { Plus } from "lucide-react"
import { Link } from "@tanstack/react-router"
import { PaymentSource, getPaymentSourceList } from '@/services/accounts-cards' 
import { DataTable } from '@/components/sources/data-table'
import { sourcesColumns } from '@/components/sources/columns'

export const Route = createFileRoute('/_dashboardLayout/accountscards/')({
  component: ListAccounts,
})

function ListAccounts() {
  const [ accounts, setAccounts ] = useState<PaymentSource[]>([])
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

      <DataTable columns={sourcesColumns} data={accounts} />
    </div>
  )
}
