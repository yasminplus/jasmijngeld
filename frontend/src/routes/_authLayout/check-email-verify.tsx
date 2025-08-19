import { Button } from '@/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'
import { Mail } from 'lucide-react'

export const Route = createFileRoute('/_authLayout/check-email-verify')({
  component: CheckEmailVerify,
})

function CheckEmailVerify() {
  return (
    <div className='center'>
      <Button className='' disabled size="icon" variant="ghost"  >
        <Mail className="size-18" />

      </Button>
      <h1 className='text-2xl pb-6 font-semibold'>Check your email</h1>
      <p>We've sent a verification link to your email. Open it to finish setting up your account.</p>
    </div>
  )
  
}
