import { createFileRoute } from '@tanstack/react-router'
import { getUserAccountData } from '@/services/users'
import ChangePasswordForm from '@/components/profile/ChangePasswordForm'
import ProfileForm from '@/components/profile/ProfileForm'

export const Route = createFileRoute('/_dashboardLayout/profile/')({
  component: ProfileIndex,
  loader: async () => await getUserAccountData(),
})

function ProfileIndex() {
  const user = Route.useLoaderData().data

  return (
    <div className='w-80'>

      <ProfileForm user={user} />

      <ChangePasswordForm />

    </div>
  )
}
