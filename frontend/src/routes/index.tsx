import { 
  createFileRoute,
  redirect
 } from '@tanstack/react-router'
import { Brand } from '@/components/Brand'
import { buttonVariants } from "@/components/ui/button"
import '@/App.css'

export const Route = createFileRoute('/')({
  beforeLoad: ({ context, location }) => {
    if (!context.authContext.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    } else {
      throw redirect({
        to: '/dashboard/home'
      })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="container mx-auto p-4">
      <Brand />
      <div className="flex gap-4 mb-4">
        <a className={buttonVariants({ variant: "default" }) + " basis-full"} href="/login">Log In</a>
        <a className={buttonVariants({ variant: "outline" })+ " basis-full"} href="/signup">Sign Up</a>
      </div>
    </div>
  )
}
