import { CircleAlert } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from "sonner"
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { InputField } from '@/components/form/input-field'
import { Button } from '@/components/ui/button'
import { Form } from "@/components/ui/form"
import { updateUserAccount, type UserAccount } from '@/services/users'
import { useProfile } from '@/context/profile'

const accountSchema = z
  .object({
    email: z.string().min(15),
    first_name: z.string().min(3),
    last_name: z.string().optional().or(z.literal('')),
  })
type AccountValues = z.infer<typeof accountSchema>

interface Props {
  user: UserAccount
}
export default function ProfileForm({ user }: Props) {
  const { setFirstName } = useProfile()
  const form = useForm<AccountValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name? user.last_name : '',
    }
  })
  const { errors, isSubmitting } = form.formState

  function onSubmit(data: AccountValues) {
    updateUserAccount(data)
    .then(() => {
      toast.success("Profile successfully updated")
      setFirstName(data.first_name)
      // window.dispatchEvent(new CustomEvent('storage'));
      // window.dispatchEvent(new CustomEvent('profile:changed'));
    })
    .catch(error => {
      console.error(error)
      form.setError("root.serverError", { 
        type: "custom", 
        message: error.response?.data.message 
      })
    })
  }

  return (
    <div className='w-80'>
      <h1 className="text-2xl text-left mb-5">Account</h1>
      <Form {...form}>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

          <InputField
            name="email"
            control={form.control}
            label="Email"
            required
            type='email'
            placeholder="Enter your email address"
            readonly
          />

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

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            Update profile
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