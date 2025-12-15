import { createFileRoute, useCanGoBack, useRouter } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import PaymentSourceForm from '@/components/sources/source-form'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/_dashboardLayout/accountscards/new')({
  component: AddAccount,
})

function AddAccount() {
  const router = useRouter()
  const canGoBack = useCanGoBack()

  return (
    <div>
      <h1 className='text-2xl font-medium'>
        {canGoBack? (
          <Button onClick={() => router.history.back()} variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        ) : null}
        Add new account/card
      </h1>
      <PaymentSourceForm />
    </div>
  )
}
