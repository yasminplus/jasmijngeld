import { createFileRoute, useCanGoBack, useRouter } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import ExpenseForm from '@/components/expenses/expense-form'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/_dashboardLayout/expenses/new')({
  component: AddExpense,
})

function AddExpense() {
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
        Add new expense
      </h1>
      <ExpenseForm />
    </div>
  )
}
