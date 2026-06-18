import { Link } from '@tanstack/react-router'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { InputField } from '@/components/form/input-field'
import { postSignupData } from '@/services/signup'
import { signupSchema } from '@/schemas/auth'


type SignUpValues = z.infer<typeof signupSchema>

export default function SignUpForm({ onSuccess }: {
   onSuccess: () => void
}) {
  const form = useForm<SignUpValues>({
    resolver: zodResolver(signupSchema),
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
    void confirm
    postSignupData(payload)
    .then(() => {
      onSuccess()
    })
    .catch(error => {
      const res = error['response']
      const err_msg = res['data']
      const validFields = ["first_name", "last_name", "email", "password", "confirm"] as const;
      for (const field in err_msg) {
        if (validFields.includes(field as typeof validFields[number])) {
          form.setError(field as typeof validFields[number], { type: "manual", message: err_msg[field] });
        }
      }
    })
  }

  return (
    <>
    {/* think about using something like vue slots for the title */}
      <h1 className="text-3xl text-left mb-5">Sign Up</h1>
      <Form {...form}>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>

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
      <p className="text-sm pt-2 text-center">
        Already have an account? <Link to="/login" className='font-semibold'>Log in</Link>
      </p>

    </>
  )
}
