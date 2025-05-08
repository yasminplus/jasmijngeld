import { createFileRoute, Link, redirect, useNavigate } from '@tanstack/react-router'

import { useRouter } from '@tanstack/react-router';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
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

import { useAuthContext } from "@/context/auth"

export const Route = createFileRoute('/_authLayout/Login')({
  component: LoginForm,
  beforeLoad: ({ context }) => {
    if (context.authContext.isAuthenticated) {
      throw redirect({ to: '/dashboard' })
    }
  },
  loader: ({ context }) => {
    console.log(context)
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
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await authContext.login_i(values)
    await router.invalidate()
    await navigate({to: '/dashboard'})
  }

  return (
    <>
      <h1 className="text-3xl text-left mb-5">Log In</h1>
      <Form {...form} >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
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
              <FormItem>
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
      </Form>
      <p className="text-sm pt-2 text-center">Don't have an account? <Link to="/signup">Sign Up</Link></p>
    </>
  )
}
