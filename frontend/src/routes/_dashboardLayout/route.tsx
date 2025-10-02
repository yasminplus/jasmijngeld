import { 
  createFileRoute, 
  redirect,
  useNavigate,
  useRouter,
  Outlet
} from '@tanstack/react-router'

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

import { Header } from '@/components/dashboard/Header'
import { useAuthContext } from '@/context/auth'
import { useGlobalDataContext } from '@/context/globaldata'

export const Route = createFileRoute('/_dashboardLayout')({
  beforeLoad: ({ context, location }) => {
    if (!context.authContext.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    } else if (!context.authContext.user?.is_verified) {
      throw redirect({
        to: '/unverif',
        search: {
          redirect: location.href,
        },
      })
    }
  },
  component: DashboardLayout,
})

function DashboardLayout() {
  const router = useRouter()
  const navigate = useNavigate()
  const globalDataContext = useGlobalDataContext()

  /* if we don't do a check here, 
     the getSettings() is invoked infinitely. */
  if (globalDataContext.defaultCurrency == "") {
    globalDataContext.getSettings()
  }

  return (
    <SidebarProvider style={{
      "--sidebar-width": "16rem",
      "--sidebar-width-mobile": "16rem"
    }}>
      <AppSidebar  />
      <div id="content" className='flex flex-col flex-grow w-screen' >
        <Header />
        <main className='px-4 pb-4'>
          <Outlet>
            <SidebarTrigger />
          </Outlet>
        </main>
      </div>
    </SidebarProvider>
  )
}
