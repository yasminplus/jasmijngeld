import { createFileRoute } from '@tanstack/react-router'
import PaymentSourceForm from '@/components/sources/source-form'

export const Route = createFileRoute('/_dashboardLayout/accountscards/new')({
  component: AddAccount,
})

function AddAccount() {

  return (
    <>
      <h1>Add new account/card</h1>
      <PaymentSourceForm />
    </>
  )
}
