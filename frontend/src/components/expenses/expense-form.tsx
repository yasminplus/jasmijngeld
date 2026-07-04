import { format } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { useNavigate } from '@tanstack/react-router';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
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
  type Store, updateExpense
} from '@/services/expenses';

type ExpenseFormProps = {
  expense?: Expense,
  initialValues?: Partial<ExpenseFormType>
}

type ExpenseFormValues =  z.infer<typeof expenseFormSchema>;

export default function ExpenseForm({ expense, initialValues }: ExpenseFormProps) {
  const navigate = useNavigate()
  const [categories, setCategories] = useState<ExpenseCategory[]>([])
  const [currencyList, setCurrencyList] = useState<OptionType[]>([])
  const [sourceList, setSourceList] = useState<PaymentSource[]>([])
  const [storeList, setStoreList] = useState<Store[]>([])
  const [stringDate, setStringDate] = useState<string>("")
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
    if (initialValues) {
      form.reset({
        amount: initialValues.amount,
        currency: initialValues.currency,
        date: initialValues.date ? new Date(initialValues.date) : new Date(),
        description: initialValues.description,
        category: initialValues.category,
        store: initialValues.store !== null? initialValues.store : undefined,
        source: initialValues.source
      })
    }
  }, [initialValues, form])

  useEffect(() => {
    if (expense) {
      setStringDate(format(expense.date, "dd/MM/yyyy"))
    } else if (initialValues && initialValues.date) {
      setStringDate(format(initialValues.date!, "dd/MM/yyyy"))
    } else {
      setStringDate(format(new Date(), "dd/MM/yyyy"))
    }
  }, [expense, initialValues])

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