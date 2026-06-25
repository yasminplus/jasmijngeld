import { createFileRoute, useCanGoBack, useRouter } from '@tanstack/react-router'
import { ArrowLeft, WandSparkles } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldLabel,
} from "@/components/ui/field"
import { Textarea } from '@/components/ui/textarea'
import ExpenseForm from '@/components/expenses/expense-form'
import { parseExpenseText } from '@/services/expenses'

export const Route = createFileRoute('/_dashboardLayout/expenses/new')({
  component: AddExpense,
})

function AddExpense() {
  const router = useRouter()
  const canGoBack = useCanGoBack()
  const [expText, setExpText] = useState('')
  const [parseLoading, setParseLoading] = useState(false)

  function onExpTextChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setExpText(e.target.value)
  }
  async function sendExpenseText() {
    try {
      setParseLoading(true)
      const parsedExpense = await parseExpenseText(expText)
      // TODO: pass the expense object to the expense form
    } catch {
      toast.error('Could not parse expense, please try again later')
      return false
    } finally {
      setParseLoading(false)
    }
  }
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

      <div className='w-80 border-2 rounded-md grid gap-1 px-2 py-2 mt-2'>
        <Field>
          <FieldLabel htmlFor="expense-text">
            <WandSparkles size={14} /> <span> Add expense using AI </span>
          </FieldLabel>
          <Textarea 
            id="expense-text" 
            placeholder="Write your expense here to prefill the form, one at a time" 
            value={expText}
            onChange={onExpTextChange}
            rows={4}
          />
        </Field>
        <Button type="button" className="w-full mt-2" disabled={parseLoading}
          onClick={sendExpenseText}
        >
          Parse expense
        </Button>
      </div>

      <ExpenseForm />
    </div>
  )
}
