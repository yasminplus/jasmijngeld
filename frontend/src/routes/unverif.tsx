import { 
  createFileRoute
} from '@tanstack/react-router'
import { Header } from '@/components/dashboard/Header'
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

            <h1>Please check your inbox and verify your email address.</h1>
            <h2>If you haven't received any email, you can request to resend them.</h2>
            <ResendVerifLink uidb64='' token='' />
          </div>
        </main>
      </div>
    </>
  )
}
