import ExpenseForm from '@/components/expenses/expense-form'
import { getExpense } from '@/services/expenses'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_dashboardLayout/expenses/$expId/edit'
)({
  component: EditExpense,
  loader: async ({ params }) => await getExpense(Number(params.expId)),
})

function EditExpense() {
  const loaderData = Route.useLoaderData()

  return (
    <div>
      <h1 className='text-2xl font-semibold'>Edit expense</h1>
      <ExpenseForm expense={loaderData} />
    </div>
  )
}
