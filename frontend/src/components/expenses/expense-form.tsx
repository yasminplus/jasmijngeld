import { format } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { useNavigate } from '@tanstack/react-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, WandSparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Field, FieldLabel } from '@/components/ui/field';
import { DatePickerInputField } from '@/components/form/date-picker-input-field';
import { InputField } from '@/components/form/input-field';
import { type OptionType, SelectField } from "@/components/form/select-field"
import { SelectInputField } from '@/components/form/select-input-field';

import { useExpenseStatic } from '@/context/expense-static';
import { useGlobalDataContext } from '@/context/globaldata';

import { getPaymentSourceList, type PaymentSource } from '@/services/accounts-cards';
import {
  createExpense,
  createStore,
  type Expense,
  type ExpenseCategory,
  expenseFormSchema,
  type ExpenseFormType,
  getStoreList,
  parseExpenseText,
  type Store, updateExpense
} from '@/services/expenses';

type ExpenseFormProps = {
  expense?: Expense,
  showAiInput?: boolean
}

type ExpenseFormValues =  z.infer<typeof expenseFormSchema>;

export default function ExpenseForm({ expense, showAiInput }: ExpenseFormProps) {
  const navigate = useNavigate()
  const [categories, setCategories] = useState<ExpenseCategory[]>([])
  const [currencyList, setCurrencyList] = useState<OptionType[]>([])
  const [sourceList, setSourceList] = useState<PaymentSource[]>([])
  const [storeList, setStoreList] = useState<Store[]>([])
  const [stringDate, setStringDate] = useState<string>("")
  const [expText, setExpText] = useState('')
  const [parseLoading, setParseLoading] = useState(false)
  const globalDataContext = useGlobalDataContext()
  const expStatic = useExpenseStatic()

  const form = useForm<ExpenseFormValues>({
    defaultValues: expense 
    ? {
      amount: expense.amount,
      currency: expense.currency,
      date: new Date(expense.date),
      description: expense.description,
      category: expense.category,
      store: expense.store? expense.store : undefined,
      source: expense.source
    } : {
      amount: undefined,
      currency: 'IDR',
      date: new Date(),
      description: undefined,
      category: undefined,
      store: undefined,
      source: undefined
    },
    resolver: zodResolver(expenseFormSchema),
  })
  const { isSubmitting } = form.formState

  async function onSubmit(data: ExpenseFormValues) {
    const payload: ExpenseFormType = {
      ...data,
      date: format(data.date, "yyyy-MM-dd"),
      store: data.store? data.store : "",
      source: data.source? data.source : ""
    };

    if (expense) {
      await updateExpense(expense.id, payload)
      navigate({
        to: '/expenses',
        state: { message: 'Expense has been updated' }
      })
    } else {
      await createExpense(payload)
      navigate({
        to: '/expenses',
        state: { message: 'A new expense has been created' }
      })
    }
  }

  useEffect(() => {
    const list = globalDataContext.enabledCurrencies.map(curr => {
      return {
        id: curr,
        name: curr
      }
    })
    setCurrencyList(list)
  }, [globalDataContext.enabledCurrencies])

  const fetchSelectOptions = useCallback(() => {
    Promise.all([getStoreList(), getPaymentSourceList()])
    .then(results => {
      setStoreList(results[0])
      setSourceList(results[1])
    })
    .catch(err => {
      throw err
    })
  }, [])

  useEffect(() => {
    fetchSelectOptions()
  }, [fetchSelectOptions])

  useEffect(() => {
    setCategories(expStatic.categories)
  }, [expStatic.categories])

  useEffect(() => {
    if (expense) {
      setStringDate(format(expense.date, "dd/MM/yyyy"))
    } else {
      setStringDate(format(new Date(), "dd/MM/yyyy"))
    }
  }, [expense])

  async function sendExpenseText() {
    try {
      setParseLoading(true)
      const exp = await parseExpenseText(expText)
      const parsedDate = exp.date ? new Date(exp.date) : new Date()
      form.reset({
        amount: exp.amount,
        currency: exp.currency ?? 'IDR',
        date: parsedDate,
        description: exp.description,
        category: exp.category,
        store: exp.store ?? undefined,
        source: exp.source
      })
      setStringDate(format(parsedDate, 'dd/MM/yyyy'))
      toast.success('Form filled in. Please review before saving.')
      setExpText('')
    } catch {
      toast.error('Could not parse expense, please try again later')
    } finally {
      setParseLoading(false)
    }
  }

  function parseExpenseClicked() {
    if (form.formState.isDirty) {
      toast('Form already filled. Parse again and overwrite with new result?', {
        action: <Button onClick={() => sendExpenseText()}>Overwrite</Button>,
      })
    } else {
      sendExpenseText()
    }
  }

  async function onCreateStoreOption(name: string): Promise<boolean> {
    try {
      const newStore = await createStore(name)
      setStoreList(prev => [...prev, newStore].sort((a, b) => a.name.localeCompare(b.name)))
      form.setValue('store', newStore.name)
      toast.success(`Store "${name}" added`)
      return true
    } catch {
      toast.error(`Could not add store "${name}"`)
      return false
    }
  }

  return (
    <>
      <div className='w-80'>

        {showAiInput && (
          <div className='border-2 rounded-md grid gap-1 px-2 py-2 mt-2'>
            <Field>
              <FieldLabel htmlFor="expense-text">
                <WandSparkles size={14} /> <span> Add expense using AI </span>
              </FieldLabel>
              <Textarea
                id="expense-text"
                placeholder="Write your expense here to prefill the form, one at a time"
                value={expText}
                onChange={e => setExpText(e.target.value)}
                rows={4}
              />
            </Field>
            <Button type="button" className="w-full mt-2" disabled={parseLoading || !expText}
              onClick={parseExpenseClicked}
            >
              {parseLoading && <Loader2 className='animate-spin'/>}
              Parse expense
            </Button>
          </div>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3 mx-auto pt-5">

            <DatePickerInputField 
              stringDate={stringDate} 
              setStringDate={setStringDate}
              name="date"
              control={form.control}
              label="Date"
              required
            />

            <InputField
              name="amount"
              control={form.control}
              label="Amount"
              required
              type='number'
              placeholder='Enter the expense amount'
            />

            <SelectField
              name="currency"
              control={form.control}
              label="Currency"
              placeholder="Select currency"
              options={currencyList}
            />

            <InputField
              name="description"
              control={form.control}
              label="Description"
              placeholder='Describe the expense'
            />

            <SelectField
              name="category"
              control={form.control}
              label="Category"
              placeholder="Select category"
              options={categories}
            />

            <SelectInputField
              name="store"
              control={form.control}
              label="Store"
              options={storeList}
              onCreateOption={onCreateStoreOption}
            />

            <SelectField
              name="source"
              control={form.control}
              label="Source"
              placeholder='Select payment source'
              options={sourceList}
            />

            <Button
              type="submit" 
              className="w-full mt-5"
              disabled={isSubmitting}
            >
              Save
            </Button>
          </form>
        </Form>
      </div>
    </>
  )
}