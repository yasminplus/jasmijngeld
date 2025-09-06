import { createFileRoute } from '@tanstack/react-router'
import { getUserAccountData } from '@/services/users'
import ChangePassword from './-change-pw'
import ProfileForm from './-edit-profile'

export const Route = createFileRoute('/_dashboardLayout/profile/')({
  component: ProfileIndex,
  loader: async () => await getUserAccountData(),
})

function ProfileIndex() {
  const user = Route.useLoaderData().data

  return (
    <div className='w-80'>

      <ProfileForm user={user} />

      <ChangePassword />

    </div>
  )
}
