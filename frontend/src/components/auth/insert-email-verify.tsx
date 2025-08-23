import { useNavigate } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { InputField } from '@/components/form/input-field'
import { sendVerificationLink } from "@/services/signup"

const formSchema = z
  .object({
    email: z.string().email().min(15),
  })

type EmailValue = z.infer<typeof formSchema>
  
export default function InsertEmailVerify() {
  const navigate = useNavigate()
  const form = useForm<EmailValue>({
    resolver: zodResolver(formSchema),
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
      <h1>Enter your email address to verify your email.</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <InputField
            name="email"
            control={form.control}
            label="Email"
            required
            type='email'
            placeholder="Enter your email address"
          />

          <Button type="submit" className="w-full">Resend email</Button>
        </form>
      </Form>
    </>
  )
}