// import { useNavigate } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { InputField } from '@/components/form/input-field'
import { sendVerificationLink } from "@/services/signup"
import { insertEmailSchema } from "@/schemas/auth"

type EmailValue = z.infer<typeof insertEmailSchema>

interface Props {
  resetPassword: boolean
}
/*
Initially this was used to ask users whose verification links are already expired
to enter their email address, to send another verification link, but it's bad for 
the UX. Maybe we can reuse this for Password Resets.
*/
export default function InsertEmailVerify({ resetPassword }: Props) {
  // const navigate = useNavigate()
  const form = useForm<EmailValue>({
    resolver: zodResolver(insertEmailSchema),
    defaultValues: {
      email: "",
    }
  })

  function onSubmit(data: EmailValue) {
    sendVerificationLink(data)
    .then(() => {
      console.log("success requesting email")
    })
    .catch(error => {
      console.error(error)
    })
  }
  
  return (
    <>
      <p>Enter your email address to { resetPassword? "reset your password" : "verify your email" }.</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <InputField
            name="email"
            control={form.control}
            type='email'
            placeholder="Enter your email address"
          />

          <Button type="submit" className="w-full">Send email</Button>
        </form>
      </Form>
    </>
  )
}