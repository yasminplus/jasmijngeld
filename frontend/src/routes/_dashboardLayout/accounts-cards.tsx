import { createFileRoute } from '@tanstack/react-router'
import { AccountsCards, getAccountsCardsList } from '@/services/accounts-cards' 
import { useEffect, useState } from 'react'


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
    <tr key={acc.id}>
      <td> {acc.name} </td>
      <td> {acc.source_type} </td>
      <td> {acc.acc_identifier == ""? "-" : acc.acc_identifier} </td>
    </tr>
  )

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Source type</th>
            <th>Account identifier</th>
          </tr>
        </thead>
        <tbody>
          {accTable}
        </tbody>
      </table>
    </div>
  )
}
