import { createFileRoute, useNavigate } from '@tanstack/react-router'

import SignUpForm from '@/components/auth/SignupForm'

export const Route = createFileRoute('/_authLayout/signup')({
  component: SignUpFormWrapper,
})

function SignUpFormWrapper() {
  const navigate = useNavigate()

  function onSuccess () {
    navigate({to: '/check-email/$emailType', params: {'emailType': 'verify'}})
  }

  return (
    <SignUpForm onSuccess={onSuccess} />
  )
}
