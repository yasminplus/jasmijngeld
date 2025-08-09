import { Plus } from "lucide-react"

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
import { sidebarItems } from "./sidebar-items"

export function AppSidebar() {
  const routerState = useRouterState()

  const isLinkActive = (url: string) => {
    return routerState.location.href.startsWith(url)
  }

  return (
    <Sidebar style={{borderRight: '0px'}}>
      <SidebarHeader className="pt-3">
        <Brand pb={"pb-1"} size={"text-4xl"} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
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
          <Link to={'/expenses/new'} >
            <Button className='w-full'>
              <Plus />Add Expense
            </Button>
          </Link>
        </SidebarFooter>
    </Sidebar>
  )
}