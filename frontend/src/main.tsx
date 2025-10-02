import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'

import { ErrorComponent, RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

import './index.css'
import { AuthProvider, useAuthContext } from './context/auth'
import { GlobalDataProvider, useGlobalDataContext } from './context/globaldata'

const router = createRouter({ 
  routeTree,
  defaultErrorComponent: ({ error }) => <ErrorComponent error={error} />,
  context: {
    authContext: undefined!,
    globalDataContext: undefined!
  },
})

// // Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }

  interface HistoryState {
    message: string
  }
} 

function InnerApp() {
  const authContext = useAuthContext()
  const globalDataContext = useGlobalDataContext()
  return <RouterProvider router={router} context={{ authContext, globalDataContext }} />
}

function App() {
  return (
    <AuthProvider>
      <GlobalDataProvider>
        <InnerApp />
      </GlobalDataProvider>
    </AuthProvider>
  )
}

const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    // <StrictMode>
      <App />
    // </StrictMode>,
  )
}
