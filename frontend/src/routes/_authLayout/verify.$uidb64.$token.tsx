import { createFileRoute } from '@tanstack/react-router'
import { AxiosError } from 'axios'
import ResendVerifLink from '@/components/auth/resend-verif-link'
import { verifySignupToken } from '@/services/signup'


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

  if (status == 410) {
    // inform that token is expired. show component to send verification token again.
    return (
      <>
        <p className='text-left mb-6'>Your verification link is expired. Please request a new one.</p>
        <ResendVerifLink uidb64={params.uidb64} />
      </>
    )
  } else {
    // inform that verification is complete, now login
    <p>Your email has been verified. Please continue logging in.</p>
  }
}
