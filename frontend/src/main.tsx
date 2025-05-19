import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'

import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import axios from "axios"

import './index.css'
import { 
  AuthProvider, 
  useAuthContext,
  BE_BASE_URL,
  getToken,
  setStoredUser
} from './context/auth'

let isRefreshing = false
axios.interceptors.response.use( 
  response => response, 
  async error => {
    const refreshToken = getToken('refresh')
    if (error.response.status === 401 && refreshToken && !isRefreshing) {
      isRefreshing = true

      const data = {
        refresh: refreshToken
      }

      await axios
      .post(`${BE_BASE_URL}/api/auth/token/`, data)
      .then((res) => {
        console.log(res) // res.data should be of type Token
        setStoredUser(res.data)
        axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`
      })
      
      error.config.headers.Authorization = "Bearer " + getToken('access')
      return axios(error.config)
    }
    isRefreshing = false
    return Promise.reject(error)
  }
)

const router = createRouter({ 
  routeTree,
  context: {
    authContext: undefined!
  }
})

// // Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
} 

function InnerApp() {
  const authContext = useAuthContext()
  return <RouterProvider router={router} context={{ authContext }} />
}

function App() {
  return (
    <AuthProvider>
      <InnerApp />
    </AuthProvider>
  )
}

const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
