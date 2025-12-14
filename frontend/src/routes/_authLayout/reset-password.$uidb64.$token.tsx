import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { AxiosError } from 'axios'
import { CircleAlert } from 'lucide-react'
import { useForm } from 'react-hook-form'
import z from 'zod'

import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { InputField } from '@/components/form/input-field'
import { resetPassword, verifyResetPasswordToken, type ResetPwType } from '@/services/reset-pw'

export const Route = createFileRoute('/_authLayout/reset-password/$uidb64/$token')({
  component: ResetPassword,
    loader: async ({ params }) => {
      try {
        const res = await verifyResetPasswordToken(params.uidb64, params.token)
        return {status: res}
      } catch (error) {
        if (error instanceof AxiosError) {
          console.log(error)
          return {status: error.status}
        }
        return {status: 200}
      }
    },
})

const formSchema = z
  .object({
    new_password: z.string().trim().min(8).trim(),
    new_confirm: z.string().trim().min(8).trim(),
  })
  .refine((data) => data.new_password === data.new_confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  })

type ResetPassValues = z.infer<typeof formSchema>

function ResetPassword() {
  const { status } = Route.useLoaderData()
  const params = Route.useParams()
  const navigate = useNavigate()

  const form = useForm<ResetPassValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      new_password: "",
      new_confirm: ""
    }
  })
  const { errors, isSubmitting } = form.formState

  function onSubmit(data: ResetPassValues) {
    const payload: ResetPwType = {
      new: data.new_password
    }
    resetPassword(params.uidb64, params.token, payload)
      .then(() => {
        navigate({to: '/finish-reset'})
      })
      .catch(error => {
        console.error(error)
        if (error instanceof AxiosError) {
          form.setError("root.serverError", { 
            type: "custom", 
            message: error.response?.data.message 
          })
        }
      })
    }
  
  if (status == 200) {
    return (
      // inform that user can reset password now
      <div className=''>
        <h1 className="text-2xl mb-5 font-semibold mb-7">Reset Password</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              Reset password
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
  } else {
    // inform that token is expired. show component to send reset password token again.
    return (
      <>
        <p className='text-left mb-6 text-sm'>Your link is expired. Please request a new one.</p>
        <Button>
          <Link to='/forgot-password'>Forgot password</Link>
        </Button>
      </>
    )
  }
}
