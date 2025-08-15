import ExpenseForm from '@/components/expenses/expense-form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboardLayout/expenses/new')({
  component: AddExpense,
})

function AddExpense() {
  return (
    <div>
      <h1 className='text-2xl font-semibold'>Add new expense</h1>
      <ExpenseForm />
    </div>
  )
}
