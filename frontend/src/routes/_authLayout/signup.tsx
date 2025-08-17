import { createFileRoute, Link } from '@tanstack/react-router'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { InputField } from '@/components/form/input-field'

export const Route = createFileRoute('/_authLayout/signup')({
  component: SignUpForm,
})


const formSchema = z
  .object({
    first_name: z.string().min(3),
    last_name: z.string().optional().or(z.literal('')),
    email: z.string().email().min(15),
    password: z.string().trim().min(8).trim(),
    confirm: z.string().trim().min(8).trim(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  })

type SignUpValues = z.infer<typeof formSchema>

function SignUpForm() {
  const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirm: ""
      }
    })
  
    function onSubmit(data: SignUpValues) {
      const { confirm, ...payload } = data
      console.log(payload)
    }
  
    return (
      <>
      {/* think about using something like vue slots for the title */}
        <h1 className="text-3xl text-left mb-5">Sign Up</h1>
        <Form {...form}>
          
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            <InputField
              name="first_name"
              control={form.control}
              label="First name"
              required
              placeholder="Enter your first name"
            />

            <InputField
              name="last_name"
              control={form.control}
              label="Last name"
              required
              placeholder="Enter your last name"
            />

            <InputField
              name="email"
              control={form.control}
              label="Email"
              required
              type='email'
              placeholder="Enter your email address"
            />

            <InputField
              name="password"
              control={form.control}
              label="Password"
              required
              type='password'
              placeholder="Enter your password"
            />

            <InputField
              name="confirm"
              control={form.control}
              label="Confirm password"
              required
              type='password'
              placeholder="Reenter your password"
            />
            
            <Button type="submit" className="w-full">Sign Up</Button>
          </form>
        </Form>
        <p className="text-sm pt-2 text-center">Already have an account? <Link to="/login">Log In</Link></p>
  
      </>
    )
}
