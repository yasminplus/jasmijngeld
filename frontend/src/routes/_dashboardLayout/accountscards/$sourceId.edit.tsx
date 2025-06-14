import { useEffect, useState } from 'react';

import { createFileRoute } from '@tanstack/react-router'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Alert, AlertDescription } from '@/components/ui/alert';
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
import { AccountsCards, SOURCE_TYPE_CHOICES, getAccountCard } from '@/services/accounts-cards';

export const Route = createFileRoute(
  '/_dashboardLayout/accountscards/$sourceId/edit',
)({
  component: EditAccount
})

const accountSchema = z.object({
  name: z.string(),
  source_type: z.enum(['Bank account', 'Credit card', 'Digital wallet', 'Prepaid card', 'Cash']),
  acc_identifier: z.string().optional().or(z.literal('')),
})

function EditAccount() {
  const { sourceId } = Route.useParams()
  const [account, setAccount] = useState<AccountsCards>({
    id: 0,
    name: '',
    source_type: 'Bank account',
    acc_identifier: ''
  })
  

  function onSubmit(values: z.infer < typeof accountSchema > ) {
    try {
      console.log(values);
    } catch (error) {
      console.error("Form submission error", error);
    }
  }

  // const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data)

  useEffect(() => {
    getAccountCard(sourceId)
    .then(data => {
      setAccount(data)
      form.reset(account)
      // form.setValue("name", account.name )
      // form.setValue("source_type", account.source_type)
      // form.setValue("acc_identifier", account.acc_identifier)
    })
    .catch(err => {
      throw err
    })
  }, [sourceId]) 
  // TODO: fix the useEffect warning 

  const form = useForm<z.infer<typeof accountSchema>>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: account.name,
      source_type: account.source_type,
      acc_identifier: account.acc_identifier
    },
    values: account
  })

  return (
    <>
      <h1>Edit account/card</h1>
      <div className='w-32'> 

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 max-w-3xl w-48 mx-auto py-10">

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
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="source_type"
            // defaultValue={account.source_type }
            render={({ field }) => (
              <FormItem className='text-left'>
                <FormLabel>Source type</FormLabel>
                <FormControl>
                  <Select
                    value={field.value || ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="">
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
          
          <Button type="submit" className="w-full mt-10">Save</Button>
        </form>
      </Form>
      </div>
    </>
  )
}
