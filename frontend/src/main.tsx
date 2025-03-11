import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import './index.css'
import App from './App.tsx'
import LoginForm from './components/auth/LoginForm.tsx';
import RegisterForm from './components/auth/RegisterForm.tsx';
import AuthLayout from './components/auth/AuthLayout.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      {/* <App /> */}
      <Routes>
        <Route index element={<App />} />
        <Route element={<AuthLayout />}>
          <Route path="login" element={<LoginForm />} />
          <Route path="signup" element={<RegisterForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
