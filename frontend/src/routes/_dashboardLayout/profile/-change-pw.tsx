import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { InputField } from "@/components/form/input-field"
import { AxiosError } from "axios"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { changePassword, type ChangePwType } from "@/services/users"

const formSchema = z
  .object({
    old_password: z.string().trim().min(8).trim(),
    new_password: z.string().trim().min(8).trim(),
    new_confirm: z.string().trim().min(8).trim(),
  })
  .refine((data) => data.new_password === data.new_confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  })

type ChangePassValues = z.infer<typeof formSchema>

export default function ChangePassword() {
  const form = useForm<ChangePassValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      old_password: "",
      new_password: "",
      new_confirm: ""
    }
  })
  const { isSubmitting } = form.formState

  function onSubmit(data: ChangePassValues) {
    const payload: ChangePwType = {
      old: data.old_password,
      new: data.new_password
    }
    changePassword(payload)
      .then(() =>
        toast.success("Password successfully changed")
      )
      .catch(error => {
        console.error(error)
        if (error instanceof AxiosError) {
          if (error.status == 403) {
            form.setError("old_password",
              { type: "custom", message: error.response?.data.message })
          }
        }
      })
  }

  return (
    <div className='w-80 mt-8'>
      <h1 className="text-2xl text-left mb-5">Password</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <InputField
            name="old_password"
            control={form.control}
            label="Current password"
            required
            type='password'
            placeholder="Enter your current password"
          />

          <InputField
            name="new_password"
            control={form.control}
            label="New password"
            required
            type='password'
            placeholder="Enter your new password"
          />

          <InputField
            name="new_confirm"
            control={form.control}
            label="Confirm new password"
            required
            type='password'
            placeholder="Reenter your new password"
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            Change password
          </Button>
        </form>
      </Form>
    </div>
  )
}