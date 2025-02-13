import './App.css'
import { Brand } from './components/Brand'
import { Link } from "react-router"
import { buttonVariants } from "@/components/ui/button"


function App() {

  return (
    <>
      <Brand />
      <div className="flex gap-4">
        <Link className={buttonVariants({ variant: "default" }) + " basis-full"}to="/login">Log In</Link>
        <Link className={buttonVariants({ variant: "outline" })+ " basis-full"}to="/register">Sign Up</Link>
      </div>
    </>
  )
}

export default App
