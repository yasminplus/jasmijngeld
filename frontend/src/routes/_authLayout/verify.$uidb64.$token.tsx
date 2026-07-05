import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { AxiosError } from 'axios'
import ResendVerifLink from '@/components/auth/resend-verif-link'
import { verifySignupToken } from '@/services/signup'
import TimerProgress from '@/components/TimerProgress'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'


export const Route = createFileRoute('/_authLayout/verify/$uidb64/$token')({
  component: VerifyEmailSignup,
  loader: async ({ params }) => {
    try {
      const res = await verifySignupToken(params.uidb64, params.token)
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

function VerifyEmailSignup() {
  const { status } = Route.useLoaderData()
  const params = Route.useParams()
  const navigate = useNavigate()

  function redirectToLogin() {
    navigate({to: '/login'})
  }

  if (status == 410) {
    // inform that token is expired. show component to send verification token again.
    return (
      <>
        <p className='text-left mb-6'>Your verification link is expired. Please request a new one.</p>
        <ResendVerifLink uidb64={params.uidb64} />
      </>
    )
  } else {
    return (
      // inform that verification is complete, now login
      <div>
        <Button className='mt-4' disabled size="icon" variant="ghost"  >
          <CheckCircle className="size-18" />
        </Button>
        <div className='mt-4'>
          <p>Your email has been verified.</p>
          <p>Please continue logging in.</p>
          <br/>
          <p>Redirecting to <Link className='font-semibold' to={'/login'} >Login</Link> in <TimerProgress duration={5} callback={redirectToLogin} /> seconds...</p>
        </div>
        
      </div>

    )
  }
}
