import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from "react-hook-form"
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
  SOURCE_TYPE_CHOICES,
  createPaymentSource,
  sourceSchema,
} from '@/services/accounts-cards';

export const Route = createFileRoute('/_dashboardLayout/accountscards/new')({
  component: AddAccount,
})

function AddAccount() {
  const navigate = useNavigate()

  const onSubmit: SubmitHandler<z.infer<typeof sourceSchema>> =  async (data) => {
      try {
        const newData = await createPaymentSource(data)
        // await updatePaymentSource(account.id, data)
        navigate({
          to: '/accountscards',
          search: { id: newData.id, op_type: 'create' }
        })
      }
      catch (err) {
        console.error(err)
      }
    }
  
    const form = useForm<z.infer<typeof sourceSchema>>({
      resolver: zodResolver(sourceSchema),
    })
  
    const { isSubmitting } = form.formState;

  return (
    <>
      <h1>Add new account/card</h1>
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
          
          <Button 
            type="submit" 
            className="w-full mt-10"
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
