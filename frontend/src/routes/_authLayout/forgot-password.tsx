import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'
import { requestResetPassword } from '@/services/reset-pw'
import { insertEmailSchema } from '@/schemas/auth'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from '@/components/ui/input'

export const Route = createFileRoute('/_authLayout/forgot-password')({
  component: ForgotPassword,
})

function ForgotPassword() {
  const navigate = useNavigate()
  const form = useForm<z.infer<typeof insertEmailSchema>>({
    resolver: zodResolver(insertEmailSchema),
    defaultValues: {
      email: ""
    }
  })
  
  async function onSubmit(values: z.infer<typeof insertEmailSchema>) {
    requestResetPassword(values)
    .then(() => {
      navigate({to: '/check-email/$emailType', params: {'emailType': 'reset'}})
    })
    .catch(error => {
      // technically the endpoint always send 200, but just in case.
      console.error(error)
      toast.error("Uh oh, we could not send you the reset password link.")
    })
  }
  return (
    <>
      <h1 className="text-2xl mb-3">Forgot your password?</h1>
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
