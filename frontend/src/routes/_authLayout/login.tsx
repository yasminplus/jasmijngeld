import { createFileRoute, Link, redirect, useNavigate, useRouterState } from '@tanstack/react-router'

import { useEffect, useState } from 'react';
import { useRouter } from '@tanstack/react-router';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from 'sonner';
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

import { useAuthContext } from "@/context/auth"

export const Route = createFileRoute('/_authLayout/login')({
  component: LoginForm,
  beforeLoad: ({ context }) => {
    if (context.authContext.isAuthenticated && context.authContext.user?.is_verified) {
      throw redirect({ to: '/dashboard' })
    }
  },
  loader: ({ context }) => {
    // TODO may not need this, keep this for reference for now
  },
})

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().trim().min(8),
})

function LoginForm() {
  const authContext = useAuthContext()
  const router = useRouter()
  const navigate = useNavigate({ from: '/login' })
  const state = useRouterState({ select: s => s.location.state });
  const [loginError, setLoginError] = useState('')

  useEffect(() => {
    if (state.message)
      toast.success(state.message)
  }, [state])
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoginError('')
    authContext.login_i(values)
    .then(() => {
      router.invalidate()
      navigate({to: '/dashboard'})
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
        {loginError && (
          <Alert className='mt-4'>
            <AlertDescription>
              { loginError }
            </AlertDescription>
          </Alert>
        ) }
      </Form>
      {/* remove link to signup for now */}
      <p className="text-sm pt-2 text-center">
        Don't have an account? <Link to="/signup" className='font-semibold'>Sign up</Link>
      </p>
    </>
  )
}
