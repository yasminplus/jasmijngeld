import { InputField } from '@/components/form/input-field'
import { Button } from '@/components/ui/button'
import { getUserAccountData, updateUserAccount } from '@/services/users'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { Form } from "@/components/ui/form"
import { z } from 'zod'

export const Route = createFileRoute('/_dashboardLayout/profile/')({
  component: ProfileForm,
  loader: async () => await getUserAccountData(),
})

const accountSchema = z
  .object({
    email: z.string().min(15),
    first_name: z.string().min(3),
    last_name: z.string().optional().or(z.literal('')),
  })
type AccountValues = z.infer<typeof accountSchema>

function ProfileForm() {
  const user = Route.useLoaderData().data

  const form = useForm<AccountValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name? user.last_name : '',
    }
    // defaultValues: {
    //   email: "user.email",
    //   first_name: "user.first_name",
    //   last_name: "user.last_name"
    // }
  })

  function onSubmit(data: AccountValues) {
    updateUserAccount(data)
    .then(res => 
      console.log(res)
    )
    .catch(error => {
      console.error(error)
    })
  }


  return (
    <div className='w-80'>
      <h1 className="text-2xl text-left mb-5">Edit profile</h1>
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
          
          <Button type="submit" className="w-full">Update profile</Button>

        </form>
      </Form>
    </div>
  )
}
