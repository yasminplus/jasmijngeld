import { Link } from '@tanstack/react-router'

import { useEffect, useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from 'sonner';
import type { z } from "zod"
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import GoogleButton from "@/components/auth/GoogleButton"
import { useAuthContext } from "@/context/auth"
import { loginSchema } from "@/schemas/auth"

export default function LoginForm({ onSuccess, arrivalMessage }: {
 onSuccess: () => void,
 arrivalMessage: string
}) {
  const authContext = useAuthContext()
  const [loginError, setLoginError] = useState('')

  useEffect(() => {
    if (arrivalMessage)
      toast.success(arrivalMessage)
  }, [arrivalMessage])

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setLoginError('')
    authContext.login_i(values)
    .then(() => {
      onSuccess()
    })
    .catch(error => {
      setLoginError(error.message)
    })
  }

  return (
    <>
    <h1 className="text-2xl mb-7">Log In</h1>
      <Form {...form} >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className='text-left'>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your password" {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">Log in</Button>
        </form>
        <div className="flex items-center gap-3 my-4 text-sm text-muted-foreground">
          <Separator className="flex-1" />
          or
          <Separator className="flex-1" />
        </div>
        <GoogleButton
          text="signin"
          onSuccess={onSuccess}
          onError={(message) => setLoginError(message)}
        />
        {loginError && (
          <Alert className='mt-4'>
            <AlertDescription>
              { loginError }
            </AlertDescription>
          </Alert>
        ) }
      </Form>
      <p className="text-sm pt-2 text-center">
        Don't have an account? <Link to="/signup" className='font-semibold'>Sign up</Link>
      </p>

      <div className='text-sm font-medium mb-0 mt-2'>
        <Link to="/forgot-password" className="text-primary hover:underline">Forgot password?</Link>
      </div>
    </>
  )
}