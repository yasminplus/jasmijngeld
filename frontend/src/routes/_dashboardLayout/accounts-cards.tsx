import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Plus } from "lucide-react"
import { Link } from "@tanstack/react-router"
import { AccountsCards, getAccountsCardsList } from '@/services/accounts-cards' 


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

  const accTable = accounts.map(acc => 
    <TableRow key={acc.id}>
      <TableCell> {acc.name} </TableCell>
      <TableCell> {acc.source_type} </TableCell>
      <TableCell> {acc.acc_identifier == ""? "-" : acc.acc_identifier} </TableCell>
    </TableRow>
  )

  return (
    <div>
      <Link to={'/dashboard'}>
        <Button>
          <Plus />Add new account/card
        </Button>
      </Link>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Source type</TableHead>
            <TableHead>Account identifier</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accTable}
        </TableBody>
      </Table>

      <h1>Add new payment source</h1>
      {/* decide if we want to use datatable or a form to add new payment source*/}
    </div>
  )
}
