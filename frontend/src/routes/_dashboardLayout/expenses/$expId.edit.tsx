import { createFileRoute, useCanGoBack, useRouter } from '@tanstack/react-router'
import { AxiosError } from 'axios'
import { ArrowLeft } from 'lucide-react'
import ExpenseForm from '@/components/expenses/expense-form'
import { Button } from '@/components/ui/button'
import { getExpense } from '@/services/expenses'


export const Route = createFileRoute(
  '/_dashboardLayout/expenses/$expId/edit'
)({
  component: EditExpense,
  loader: async ({ params }) => {
    try {
      const res = await getExpense(Number(params.expId))
      return res
    } catch (error) {
      if (error instanceof AxiosError) {
        // return a consistent shape so Route.useLoaderData() can be typed/checked
        return { status: error.response?.status ?? 500, message: error.message }
      }
      // re-throw unexpected errors so the router can handle them
      throw error
    }
  },
})

function EditExpense() {
  const router = useRouter()
  const loaderData = Route.useLoaderData()
  const canGoBack = useCanGoBack()

  if (loaderData && typeof loaderData === 'object' && 'status' in loaderData) {
    return (
      <div>
        <h1>Data not found</h1>
      </div>
    )
  } else if (typeof loaderData === 'object' && 'currency' in loaderData) {
    return (
      <div>
        <h1 className='text-2xl font-medium'>
          {canGoBack? (
            <Button onClick={() => router.history.back()} variant="ghost" size="icon">
              <ArrowLeft />
            </Button>
          ) : null}
          Edit expense
        </h1>
        <ExpenseForm expense={loaderData!} />
      </div>
    )
  }
}
