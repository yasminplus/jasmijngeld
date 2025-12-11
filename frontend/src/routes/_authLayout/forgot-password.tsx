import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { requestResetPassword } from '@/services/reset-pw'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/_authLayout/forgot-password')({
  component: RouteComponent,
})

const formSchema = z.object({
  email: z.string()
})

function RouteComponent() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ""
    }
  })
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    requestResetPassword(values)
    .then(() => {

    })
    .catch(error => {
      console.error(error)
    })
  }
  return (
    <>
      <h1 className="text-2xl mb-3">Forgot password?</h1>
      <p className='text-sm mb-7'>No worries, we'll email reset instructions.</p>
      <Form {...form} >
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className='text-left'>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">Reset password</Button>
        </form>
      </Form>
      <div className='pt-7 text-center'>
        <Link to="/login" className='font-semibold text-sm text-center'>
          <div className='flex justify-center'>
            <span className='pt-0.5'>
              <ArrowLeft className='size-4 '/> 
            </span>
            &nbsp; Back to log in
          </div>
        </Link>
      </div>
    </>
  )
}
