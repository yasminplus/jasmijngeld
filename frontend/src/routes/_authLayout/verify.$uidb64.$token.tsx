import { verifySignupToken } from '@/services/signup'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authLayout/verify/$uidb64/$token')({
  component: VerifyEmailSignup,
  loader: async ({ params }) => {
    try {
      const res = await verifySignupToken(params.uidb64, params.token)
      return {status: res}
    } catch (error) {
      return {status: error.status}
    }
  },
})

function VerifyEmailSignup() {
  const { status } = Route.useLoaderData()
  if (status == 410) {
    // inform that token is expired. show component to send verification token again.
  } else {
    // inform that verification is complete, now login
  }
}
