import { createFileRoute, redirect, useNavigate, useRouter, useRouterState } from '@tanstack/react-router'

import LoginForm from '@/components/auth/login-form'

export const Route = createFileRoute('/_authLayout/login')({
  component: LoginFormWrapper,
  beforeLoad: ({ context }) => {
    if (context.authContext.isAuthenticated && context.authContext.user?.is_verified) {
      throw redirect({ to: '/dashboard' })
    }
  },
})


function LoginFormWrapper() {
  const state = useRouterState({ select: s => s.location.state })
  const navigate = useNavigate()
  const router = useRouter()

  function onSuccess () {
    router.invalidate()
    navigate({to: '/dashboard'})
  }

  return (
    <LoginForm onSuccess={onSuccess} arrivalMessage={state.message} />
  )
}