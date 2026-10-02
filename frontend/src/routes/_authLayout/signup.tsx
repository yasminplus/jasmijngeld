import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'

import SignUpForm from '@/components/auth/SignupForm'

export const Route = createFileRoute('/_authLayout/signup')({
  component: SignUpFormWrapper,
})

function SignUpFormWrapper() {
  const navigate = useNavigate()
  const router = useRouter()

  function onSuccess () {
    navigate({to: '/check-email/$emailType', params: {'emailType': 'verify'}})
  }

  async function onGoogleSuccess () {
    await router.invalidate()
    navigate({to: '/dashboard'})
  }

  return (
    <SignUpForm onSuccess={onSuccess} onGoogleSuccess={onGoogleSuccess} />
  )
}
