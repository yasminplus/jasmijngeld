import { createFileRoute } from '@tanstack/react-router'
import { Brand } from '@/components/Brand'
import { buttonVariants } from "@/components/ui/button"
import '@/App.css'

export const Route = createFileRoute('/')({
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
