"use client"    // TODO: what is this?

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
import { Link } from "react-router"
import { jwtDecode } from "jwt-decode";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().trim().min(8),
})

interface Token {
  access: string;
  refresh: string;
}

const BE_BASE_URL = 'http://localhost:8000'

export function LoginForm() {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    login(values)
  }

  async function login(credentials: z.infer<typeof formSchema>) {
    console.log(credentials)
    return fetch(BE_BASE_URL + "/api/auth/token/", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })
    .then(response => {
      if (response.status == 401) {
        // throw error here
        throw new Error(`Response status: ${response.status}`);
      } else {
        return response.json()
      }
    })
    .then(data => {
      const token: Token = {
        access: data.access,
        refresh: data.refresh
      }
      const decoded = jwtDecode(token.access)
      console.log(decoded)
    })
    .catch(error => {
      console.log(error)
      console.log("User not found")
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

export default LoginForm