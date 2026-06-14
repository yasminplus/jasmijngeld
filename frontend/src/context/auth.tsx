import { jwtDecode, type JwtPayload } from 'jwt-decode';
import * as React from 'react';
import type { z } from 'zod';

import login_service, { type Token } from '@/services/login';
import { loginSchema } from '@/schemas/auth';
import { AxiosError } from 'axios';
import { getUserAccountData, type UserAccount } from '@/services/users';
import { useNavigate } from '@tanstack/react-router';

type UserPayload = JwtPayload & {
  first_name: string,
  last_name: string,
  is_verified: boolean
}

export interface User {
  first_name: string;
  last_name: string;
  is_verified: boolean;
  access: string;
  refresh: string;
}

// export interface AuthContextI extends Partial<User> {
export interface AuthContextI {
  login_i: (credentials: z.infer<typeof loginSchema>) => Promise<void>
  logout_i: () => Promise<void>
  isAuthenticated: boolean
  user: User | null
}

const AuthContext = React.createContext<AuthContextI | null>(null)

export const base_key = 'jasmijngeld.auth.user'

function getStoredUser(): User | null {
  const first_name = localStorage.getItem(base_key + '.first_name')
  const last_name = localStorage.getItem(base_key + '.last_name') || ""
  const is_verified = localStorage.getItem(base_key + '.is_verified') == "true"
  const access = localStorage.getItem(base_key + '.access')
  const refresh = localStorage.getItem(base_key + '.refresh')

  if (first_name && access && refresh) {
    return {
      first_name,
      last_name,
      is_verified,
      access,
      refresh,
    };
  }

  return null; // Return null if any of the required fields are missing
}

export function getToken(type: string) {
  return localStorage.getItem(`${base_key}.${type}`)
}

export function setStoredUser(token: Token | null) {
  if (token) {
    const data = jwtDecode<UserPayload>(token.access)
    getUserAccountData()
    .then((response) => {
      const userData: UserAccount = response.data;
      // TODO: can we compare if old names are the same as new names?
      localStorage.setItem(base_key + '.first_name', userData.first_name);
      localStorage.setItem(base_key + '.last_name', userData.last_name || '');
      window.dispatchEvent(new CustomEvent('auth:user:changed'))
    })
    .catch(err => {
      console.error(err)
    })

    localStorage.setItem(base_key + '.is_verified', data.is_verified.toString())
    localStorage.setItem(base_key + '.access', token.access)
    localStorage.setItem(base_key + '.refresh', token.refresh)
  } else {
    localStorage.removeItem(base_key + '.is_verified')
    localStorage.removeItem(base_key + '.access')
    localStorage.removeItem(base_key + '.refresh')
    console.log("removing user")
  }
}

export function AuthProvider({ children}: {children: React.ReactNode}) {
  const [user, setUser] = React.useState<User | null>(getStoredUser());
  const isAuthenticated = !!user;
  const navigate = useNavigate()

  const login_i = async function(credentials: z.infer<typeof loginSchema>): Promise<void> {
    try {
      const response = await login_service(credentials)
      setStoredUser(response)
      const cur_user = getStoredUser()
      setUser(cur_user)
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status == 401) {
          throw new Error('Wrong email or password. Please try again.')
        } else {
          throw new Error('A problem is occurred when logging in')
        }
      }
    }
  }

  const logout_i = async function() {
    setStoredUser(null)
    setUser(null)
  }

  React.useEffect(() => {
    const handleSessionExpired = () => {
      setUser(null)
      navigate({to: '/login'})
    }
    window.addEventListener('auth:session:expired', handleSessionExpired)
    return () => window.removeEventListener('auth:session:expired', handleSessionExpired)
  }, [navigate])

  React.useEffect(() => {
    const handleSessionExpired = () => {
      setUser(null)
      navigate({to: '/login'})
    }
    window.addEventListener('auth:session:expired', handleSessionExpired)
    return () => window.removeEventListener('auth:session:expired', handleSessionExpired)
  }, [navigate])

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login_i, logout_i }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = React.useContext(AuthContext)

  if (!context) {
    throw new Error('useAuthContext must be used with an AuthProvider');
  }

  return context
}