import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router";

import { buttonVariants } from "@/components/ui/button"
import { Brand } from './components/Brand'
import LoginForm from './components/auth/LoginForm.tsx';
import RegisterForm from './components/auth/RegisterForm.tsx';
import AuthLayout from './components/auth/AuthLayout.tsx';
import DashboardLayout from './components/dashboard/DashboardLayout.tsx';
import Home from './components/dashboard/Home.tsx';

function App() {

  return (
    <Router>
      <div className="container mx-auto p-4">
        <Brand />
        <div className="flex gap-4">
          <Link className={buttonVariants({ variant: "default" }) + " basis-full"}to="/login">Log In</Link>
          <Link className={buttonVariants({ variant: "outline" })+ " basis-full"}to="/register">Sign Up</Link>
        </div>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="login" element={<LoginForm />} />
            <Route path="signup" element={<RegisterForm />} />
          </Route>
          <Route element={<DashboardLayout />}>
            <Route path="home" element={<Home />} />
          </Route>
        </Routes>
      </div>
    </Router>
  )
}

export default App
