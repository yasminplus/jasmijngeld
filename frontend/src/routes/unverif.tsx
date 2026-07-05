import { 
  createFileRoute
} from '@tanstack/react-router'
import { Header } from '@/components/dashboard/Header'
import { Button } from '@/components/ui/button'
import { Mail } from 'lucide-react'
import ResendVerifLink from '@/components/auth/resend-verif-link'

export const Route = createFileRoute('/unverif')({
  component: Unverif,
})

function Unverif() {
  return (
    <>
      <div id="content" className='flex flex-col flex-grow w-screen' >
        <Header />
        <main className='px-4 pb-4'>
          <div className="max-w-sm mx-auto my-0 text-center">
            <Button className='mt-4' disabled size="icon" variant="ghost"  >
              <Mail className="size-18" />
            </Button>
            <h1 className='text-2xl font-semibold mb-3'>Verify your email address</h1>
            <p className='text-md mb-6'>Please check your inbox and verify your email address.</p>
            {/* <p className='text-sm mb-4'>Didn't get an email?</p> */}
            <ResendVerifLink uidb64='' />
          </div>
        </main>
      </div>
    </>
  )
}
