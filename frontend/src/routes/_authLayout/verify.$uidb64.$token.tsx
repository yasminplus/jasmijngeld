import { Button } from '@/components/ui/button'
import { resendVerificationLink, verifySignupToken } from '@/services/signup'
import { createFileRoute } from '@tanstack/react-router'
import { AxiosError } from 'axios'
import { toast } from "sonner"


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
  console.log(status)

  async function onSubmitResend() {
    try {
      await resendVerificationLink(params.uidb64, params.token)
      toast.success("Successfully resent verification link.")
    } catch (error) {
      console.error(error)
      toast.error("Uh oh, we could not resend you the verification link.")
    }
    
  }

  if (status == 410) {
    // inform that token is expired. show component to send verification token again.
    return (
      <>
        <p className='text-left mb-6'>Your verification link is expired. Please request a new one.</p>
        {/* 
        TODO: if the link is legit (only expired, not made up links, 
        allow the BE to return user id and make a resend request. 
        or make a resend request based on the verif token or the auth token (Bearer etc)) */}
        <Button onClick={onSubmitResend} className="w-full">Resend email</Button>
      </>
    )
  } else {
    // inform that verification is complete, now login
    <p>Your email has been verified. Please continue logging in.</p>
  }
}
