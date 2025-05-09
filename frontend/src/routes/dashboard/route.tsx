import { 
  createFileRoute, 
  redirect,
  useNavigate,
  useRouter,
  Outlet
} from '@tanstack/react-router'

import { useAuthContext } from '@/context/auth'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

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

  console.log(authContext)

  return (
    <SidebarProvider>
      <AppSidebar />
      <div>
        <h1>Dashboard</h1>
        <p>This route's content is only visible to authenticated users.</p>
        <p>Hello, { authContext.user?.first_name } </p>
        <Outlet>
          <SidebarTrigger />
        </Outlet>
      </div>     
    </SidebarProvider>
    
  )
}
