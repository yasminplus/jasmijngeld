import { format } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useNavigate } from '@tanstack/react-router';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { getPaymentSourceList, type PaymentSource } from '@/services/accounts-cards';
import {
    createExpense, CURRENCY_CHOICES, type Expense, type ExpenseCategory, expenseFormSchema, type ExpenseFormType,
    getExpenseCategories, getStoreList, type Store, updateExpense
} from '@/services/expenses';

import { DatePickerInputField } from '../form/date-picker-input-field';
import { InputField } from '../form/input-field';
import { SelectInputField } from '../form/select-input-field';

type ExpenseFormProps = {
  expense?: Expense
}

type ExpenseFormValues =  z.infer<typeof expenseFormSchema>;

export default function ExpenseForm({ expense }: ExpenseFormProps) {
  const navigate = useNavigate()
  const [categories, setCategories] = useState<ExpenseCategory[]>([])
  const [storeList, setStoreList] = useState<Store[]>([])
  const [sourceList, setSourceList] = useState<PaymentSource[]>([])
  const [stringDate, setStringDate] = useState<string>("")

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
    } 
    : {
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
        search: { id: expense.id, op_type: 'update' }
      })
    } else {
      const newData = await createExpense(payload)
      navigate({
        to: '/expenses',
        search: { id: newData.id, op_type: 'create' }
      })
    }
  }

  const fetchSelectOptions = useCallback(() => {
    Promise.all([getExpenseCategories(), getStoreList(), getPaymentSourceList()])
    .then(results => {
      setCategories(results[0])
      setStoreList(results[1])
      setSourceList(results[2])
    })
    .catch(err => {
      throw err
    })
  }, [])

  useEffect(() => {
    fetchSelectOptions()
  }, [fetchSelectOptions])

  useEffect(() => {
    if (expense) {
      setStringDate(format(expense.date, "dd/MM/yyyy"))
    } else {
      setStringDate(format(new Date(), "dd/MM/yyyy"))
    }
  }, [expense])

  return (
    <>
      <div className='w-52'> 

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 mx-auto pt-5">

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
            />

            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem className='text-left'>
                  <FormLabel>
                    Currency
                    <span className="text-destructive"> *</span>
                  </FormLabel>
                  <FormControl>
                    <Select
                      defaultValue={expense? expense.currency : 'IDR'} 
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {CURRENCY_CHOICES.map( choice => 
                          <SelectItem key={choice} value={choice}>{choice}</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <InputField 
              name="description"
              control={form.control}
              label="Description"
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className='text-left'>
                  <FormLabel>
                    Category
                    <span className="text-destructive"> *</span>
                  </FormLabel>
                  <FormControl>
                    <Select
                      // try either this or the line below
                      // defaultValue={expense? expense.source_type : undefined} 
                      value={field.value || ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map( choice => 
                          <SelectItem key={choice.id} value={choice.name}>
                            {choice.iconObj ? <choice.iconObj className="inline mr-2" /> : null}
                            {choice.name}
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SelectInputField
              name="store"
              control={form.control}
              label="Store"
              options={storeList}
            />

            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem className='text-left'>
                  <FormLabel>Source</FormLabel>
                  <FormControl>
                    <Select
                      // try either this or the line below
                      // defaultValue={expense? expense.source_type : undefined} 
                      value={field.value || ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="">
                        <SelectValue placeholder="Select payment source" />
                      </SelectTrigger>
                      <SelectContent>
                        {sourceList.map( choice => 
                          <SelectItem key={choice.id} value={choice.name}>{choice.name}</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
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