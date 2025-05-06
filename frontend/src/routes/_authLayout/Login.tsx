import { createFileRoute, Link } from '@tanstack/react-router'

import { useContext } from 'react';

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

import { jwtDecode, JwtPayload } from "jwt-decode";

import { login } from "@/services/users"
import { SessionContext } from "@/context/session"

export const Route = createFileRoute('/_authLayout/Login')({
  component: LoginForm,
})

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().trim().min(8),
})

type UserPayload = JwtPayload & {
  first_name: string,
  last_name: string
}

function LoginForm() {
  const session = useContext(SessionContext)
  
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        email: "",
        password: ""
      }
    })
  
    function onSubmit(values: z.infer<typeof formSchema>) {
      login(values)
      .then(token => {
        const data = jwtDecode<UserPayload>(token.access)
        console.log(data)
        session.first_name = data.first_name
        session.last_name = data.last_name
        session.access = token.access
        session.refresh = token.refresh
  
        // route to new page
      })
      .catch(error => {
        console.log(error)
      })
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
