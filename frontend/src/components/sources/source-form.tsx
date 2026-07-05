import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { InputField } from "@/components/form/input-field"
import { type OptionType, SelectField } from "@/components/form/select-field"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"

import {
  type PaymentSource,
  SOURCE_TYPE_CHOICES,
  createPaymentSource,
  sourceSchema,
  updatePaymentSource
} from '@/services/accounts-cards';

type PaymentSourceFormProps = {
  account?: PaymentSource
}

type FormValues = z.infer<typeof sourceSchema>;

export default function PaymentSourceForm({ account }: PaymentSourceFormProps) {
  const navigate = useNavigate()
  const [sourceTypeList, setSourceTypeList] = useState<OptionType[]>([])

  const form = useForm<FormValues>({
    defaultValues: account 
    ? {
      name: account.name,
      source_type: account.source_type,
      acc_identifier: account.acc_identifier
    } 
    : undefined,
    resolver: zodResolver(sourceSchema),
  })
  const { isSubmitting } = form.formState

  async function onSubmit(data: FormValues) {
    if (account) {
      await updatePaymentSource(account.id, data)
      navigate({
        to: '/accountscards',
        state: { message: 'Payment source has been updated' }
      })
    } else {
      await createPaymentSource(data)
      navigate({
        to: '/accountscards',
        state: { message: 'A new payment source has been created' }
      })
    }
  }

  useEffect(() => {
    setSourceTypeList(SOURCE_TYPE_CHOICES.map(choice => {
      return {
        id: choice,
        name: choice
      }
    }))
  }, [])

  return (
    <>
      <div className='w-66'> 

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)} 
          className="space-y-3 max-w-3xl mx-auto py-5"
        >

          <InputField
            name='name'
            control={form.control}
            label='Name'
            required
            placeholder="Enter a name"
          />

          <SelectField
            name="source_type"
            control={form.control}
            label="Source type"
            placeholder="Select type"
            options={sourceTypeList}
          />

          <InputField
            name='acc_identifier'
            control={form.control}
            label='Account identifier'
            placeholder="E.g. last 4 digits of the card"
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