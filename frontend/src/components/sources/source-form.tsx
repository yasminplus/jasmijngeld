import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
        search: { id: account.id, op_type: 'update' }
      })
    } else {
      const newData = await createPaymentSource(data)
      navigate({
        to: '/accountscards',
        search: { id: newData.id, op_type: 'create' }
      })
    }
  }
  return (
    <>
      <div className='w-52'> 

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 max-w-3xl mx-auto py-5">

          <FormField
            control={form.control}
            name="name"
            render={ ({ field }) => (
              <FormItem className='text-left'>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    value={field.value || ""}
                    onChange={field.onChange}
                    // can't use this
                    // {...field}   
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="source_type"
            render={({ field }) => (
              <FormItem className='text-left'>
                <FormLabel>Source type</FormLabel>
                <FormControl>
                  <Select
                    // either this or the line below that works
                    // defaultValue={account? account.source_type : undefined} 
                    value={field.value || ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {SOURCE_TYPE_CHOICES.map( choice => 
                        <SelectItem key={choice} value={choice}>{choice}</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="acc_identifier"
            render={ ({field }) => (
              <FormItem className='text-left'>
                <FormLabel>Account identifier</FormLabel>
                <FormControl>
                  <Input 
                    value={field.value || ""}
                    onChange={field.onChange}
                  />
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