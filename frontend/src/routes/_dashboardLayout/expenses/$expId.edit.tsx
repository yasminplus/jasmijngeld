import ExpenseForm from '@/components/expenses/expense-form'
import { Button } from '@/components/ui/button'
import { getExpense } from '@/services/expenses'
import { createFileRoute, useCanGoBack, useRouter } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

export const Route = createFileRoute(
  '/_dashboardLayout/expenses/$expId/edit'
)({
  component: EditExpense,
  loader: async ({ params }) => await getExpense(Number(params.expId)),
})

function EditExpense() {
  const router = useRouter()
  const loaderData = Route.useLoaderData()
  const canGoBack = useCanGoBack()

  return (
    <div>
      <h1 className='text-2xl font-semibold'>
        {canGoBack? (
          <Button onClick={() => router.history.back()} variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        ) : null}
        Edit expense
      </h1>
      <ExpenseForm expense={loaderData} />
    </div>
  )
}
