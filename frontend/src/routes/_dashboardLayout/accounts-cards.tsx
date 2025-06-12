import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Button } from "@/components/ui/button"

import { Plus } from "lucide-react"
import { Link } from "@tanstack/react-router"
import { AccountsCards, getAccountsCardsList } from '@/services/accounts-cards' 
import { DataTable } from '@/components/sources/data-table'
import { sourcesColumns } from '@/components/sources/columns'

export const Route = createFileRoute('/_dashboardLayout/accounts-cards')({
  component: ListAccounts,
})

function ListAccounts() {
  const [ accounts, setAccounts ] = useState<AccountsCards[]>([])
  useEffect(() => {
    getAccountsCardsList()
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
