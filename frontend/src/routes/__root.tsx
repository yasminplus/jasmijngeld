import * as React from 'react';

import { 
  createRootRouteWithContext, 
  Outlet 
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from "@/components/theme-provider"
import { type AuthContextI } from '@/context/auth';
import type { GlobalDataContextI } from '@/context/globaldata';
import PageNotFound from '@/components/page-not-found';
import { ProfileProvider } from '@/context/profile';

interface MyRouterContext {
  authContext: AuthContextI
  globalDataContext: GlobalDataContextI
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
  notFoundComponent: PageNotFound
})

function RootComponent() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ProfileProvider>
        <React.Fragment>
          <Outlet />
          <Toaster position="top-center"/>
          <TanStackRouterDevtools position="top-left" />
        </React.Fragment>
      </ProfileProvider>
    </ThemeProvider>
  )
}
