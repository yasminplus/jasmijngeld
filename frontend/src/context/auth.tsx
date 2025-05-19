import axios from "axios";
import { jwtDecode, JwtPayload } from "jwt-decode";
import * as React from 'react'
import { z } from "zod"

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().trim().min(8),
})

interface Token {
  access: string;
  refresh: string;
}

type UserPayload = JwtPayload & {
  first_name: string,
  last_name: string,
}

export interface User {
  first_name: string;
  last_name: string;
  access: string;
  refresh: string;
}

// export interface AuthContextI extends Partial<User> {
export interface AuthContextI {
  login_i: (credentials: z.infer<typeof formSchema>) => Promise<Token>
  logout_i: () => Promise<void>
  isAuthenticated: boolean
  isAuthenticated_i: () => Promise<boolean>
  user: User | null
}

const AuthContext = React.createContext<AuthContextI | null>(null)

export const base_key = 'jasminegeld.auth.user'

function getStoredUser(): User | null {
  const first_name = localStorage.getItem(base_key + '.first_name')
  const last_name = localStorage.getItem(base_key + '.last_name') || ""
  const access = localStorage.getItem(base_key + '.access')
  const refresh = localStorage.getItem(base_key + '.refresh')

  if (first_name && access && refresh) {
    return {
      first_name,
      last_name,
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
    localStorage.setItem(base_key + '.first_name', data.first_name)
    localStorage.setItem(base_key + '.last_name', data.last_name)
    localStorage.setItem(base_key + '.access', token.access)
    localStorage.setItem(base_key + '.refresh', token.refresh)
  } else {
    localStorage.removeItem(base_key + '.first_name')
    localStorage.removeItem(base_key + '.last_name')
    localStorage.removeItem(base_key + '.access')
    localStorage.removeItem(base_key + '.refresh')
    console.log("removing user")
  }
}

export const BE_BASE_URL = 'http://localhost:8007'

export function AuthProvider({ children}: {children: React.ReactNode}) {
  const [user, setUser] = React.useState<User | null>(getStoredUser());
  const isAuthenticated = !!user;

  const login_i = async function(credentials: z.infer<typeof formSchema>): Promise<Token> {
    console.log(credentials)
    // TODO: replace fetch with axios and add Bearer token for the default header 
    return fetch(BE_BASE_URL + "/api/auth/token/", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })
    .then(response => {
      if (response.status == 401) {
        // throw error here
        throw new Error(`${response.status}`);
      } else {
        return response.json()
      }
    })
    .then(data => {
      const token: Token = {
        access: data.access,
        refresh: data.refresh
      }
      setStoredUser(token)
      const cur_user = getStoredUser()
      setUser(cur_user)
    })
    .catch(error => {
      console.log(error)
      throw error
    })
  }

  const logout_i = async function() {
    setStoredUser(null)
    setUser(null)
    // TODO: something with isAuthenticated
    // isAuthenticated = false
  }

  const isAuthenticated_i = () => {
    // TODO: to replace the const isAuthenticated
  }

  React.useEffect(() => {
    setUser(getStoredUser())
  }, [])

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