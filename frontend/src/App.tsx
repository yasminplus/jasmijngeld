import './App.css'

import { buttonVariants } from "@/components/ui/button"
import { Brand } from './components/Brand'
import LoginForm from './components/auth/LoginForm.tsx';
import RegisterForm from './components/auth/RegisterForm.tsx';
import AuthLayout from './components/auth/AuthLayout.tsx';
import DashboardLayout from './components/dashboard/DashboardLayout.tsx';
import Home from './components/dashboard/Home.tsx';

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
