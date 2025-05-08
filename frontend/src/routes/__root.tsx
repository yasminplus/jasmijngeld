import * as React from 'react'
import {   createRootRouteWithContext,
  Outlet,
 } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { AuthContextI } from '@/context/auth'

interface MyRouterContext {
  authContext: AuthContextI
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
})

function RootComponent() {
  return (
    <React.Fragment>
      <Outlet />
      <TanStackRouterDevtools />
    </React.Fragment>
  )
}
