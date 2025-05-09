import { Calendar, Home, Inbox, Plus, Settings } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "./ui/button"
import { Brand } from "./Brand"
import { 
  Link, 
  useRouterState 
} from "@tanstack/react-router"


// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Expenses",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Accounts & Cards",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
]

export function AppSidebar() {
  const routerState = useRouterState()

  const isLinkActive = (url: string) => {
    return routerState.location.href == url
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <Brand pb={"pb-0"} size={"text-4xl"} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isLinkActive(item.url)}>
                    <Link 
                      to={item.url} 
                      className="sidebar-link" 
                      activeProps={{color: "hsl(38.8, 100%, 50%)"}}
                      activeOptions={{ exact: true }}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
        
        {/* Do we put it as footer or simply below other sidebar menu? */}
        <SidebarFooter>
          <Button>
            <Plus /> Add Expense
          </Button>
        </SidebarFooter>
    </Sidebar>
  )
}