import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'

import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'


import './index.css'
import { AuthProvider, useAuthContext } from './context/auth'

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
