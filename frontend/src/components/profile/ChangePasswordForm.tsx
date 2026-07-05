import axios from "axios"
import { CircleAlert } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { InputField } from "@/components/form/input-field"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { changePassword, type ChangePwType } from "@/services/users"
import { changePasswordSchema } from "@/schemas/profile"

type ChangePassValues = z.infer<typeof changePasswordSchema>

export default function ChangePassword() {
  const form = useForm<ChangePassValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      old_password: "",
      new_password: "",
      new_confirm: ""
    }
  })
  const { errors, isSubmitting } = form.formState

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
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 403) {
            form.setError("old_password",
              { type: "custom", message: error.response?.data.message }
            )
          } else {
            form.setError("root.serverError", {
              type: "custom",
              message: error.response?.data.message
            })
          }
        } else {
          form.setError("root.serverError", {
            type: "custom",
            message: "An unexpected error occurred"
          })
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

          {errors.root?.serverError.type === "custom" && 
            <div className="text-sm text-destructive flex flex-row gap-2">
              <CircleAlert/> <span className="pt-0.5">{errors.root?.serverError.message} </span>
            </div>
          }

        </form>
      </Form>
    </div>
  )
}