import './App.css'

import { buttonVariants } from "@/components/ui/button"
import { Brand } from './components/Brand'

function App() {

  return (
    <div className="container mx-auto p-4">
      <Brand />
      <div className="flex gap-4 mb-4">
        <a className={buttonVariants({ variant: "default" }) + " basis-full"} href="/login">Log In</a>
        <a className={buttonVariants({ variant: "outline" })+ " basis-full"} href="/register">Sign Up</a>
      </div>
    </div>
  )
}

export default App
