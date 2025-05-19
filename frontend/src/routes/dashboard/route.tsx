import { 
  createFileRoute, 
  redirect,
  useNavigate,
  useRouter,
  Outlet
} from '@tanstack/react-router'

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

import { useAuthContext } from '@/context/auth'
import { Header } from '@/components/dashboard/Header'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: ({ context, location }) => {
    if (!context.authContext.isAuthenticated) {
      throw redirect({
        to: '/login',
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
  const authContext = useAuthContext()

  return (
    <SidebarProvider style={{
      "--sidebar-width": "16rem",
      "--sidebar-width-mobile": "16rem"
    }}>
      <AppSidebar />
      <div id="content" className='flex flex-col flex-grow w-screen' >
        <Header />
        <main className='p-4'>

          <h1>Dashboard</h1>
          <p>This route's content is only visible to authenticated users.</p>
          <p>Hello, { authContext.user?.first_name } </p>
          <Outlet>
            <SidebarTrigger />
          </Outlet>
        </main>
      </div>
    </SidebarProvider>
  )
}
