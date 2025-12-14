import { Button } from '@/components/ui/button'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { CheckCircle } from 'lucide-react'

export const Route = createFileRoute('/_authLayout/finish-reset')({
  component: FinishReset,
})

function FinishReset() {
  const navigate = useNavigate()
  return (
    <div>
      <Button className='mt-4' disabled size="icon" variant="ghost"  >
        <CheckCircle className="size-18" />
      </Button>
      <div className='mt-4 text-sm mb-3  font-normal'>
        <h1 className="text-2xl mb-7 font-semibold">
          Password changed
        </h1>
        <p>Your password has been successfully changed.</p>
        <p>Please continue logging in.</p>
        <br/>
      </div>
      <Button className="w-full" onClick={() => navigate({to: '/login'})}>
        {/* <Link className='font-semibold' to={'/login'} >Login</Link>  */}
          Login
      </Button>
    </div>
  )
}
