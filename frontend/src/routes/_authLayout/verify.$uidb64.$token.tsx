import InsertEmailVerify from '@/components/auth/insert-email-verify'
import { verifySignupToken } from '@/services/signup'
import { createFileRoute } from '@tanstack/react-router'
import { AxiosError } from 'axios'

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
  console.log(status)
  if (status == 410) {
    // inform that token is expired. show component to send verification token again.
    return (
      <>
        <h1>Your verification link is expired. Please request a new one.</h1>
        <InsertEmailVerify />
      </>
    )
  } else {
    // inform that verification is complete, now login
    <p>Your email has been verified. Please continue logging in.</p>
  }
}
