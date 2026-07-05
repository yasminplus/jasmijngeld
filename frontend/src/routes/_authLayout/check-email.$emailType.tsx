import { createFileRoute } from '@tanstack/react-router'
import { Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { emailTypeSchema } from '@/schemas/auth'

export const Route = createFileRoute('/_authLayout/check-email/$emailType')({
  component: CheckEmail,
  params: {
    parse: emailTypeSchema.parse
  }
})

function CheckEmail() {
  const { emailType } = Route.useParams()

  return (
    <div className='center'>
      <Button className='' disabled size="icon" variant="ghost">
        <Mail className="size-18" />

      </Button>
      <h1 className='text-2xl pb-6 font-semibold'>Check your email</h1>
      { emailType == 'verify' && <p>We've sent a verification link to your email. Open it to finish setting up your account.</p> }
      { emailType == 'reset' && <p>We've sent a link to reset your password if your email is registered with us.</p> }

    </div>
  )
}
