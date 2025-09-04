import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useAuthContext } from '@/context/auth'
import { Link, useNavigate, useRouterState } from "@tanstack/react-router"
import { sidebarItems } from "@/components/sidebar-items"
import { ModeToggle } from "@/components/mode-toggle"


export function Header() {
  const authContext = useAuthContext()
  const navigate = useNavigate()
  const routerState = useRouterState()

  const currentMenu = sidebarItems.find(item => routerState.location.pathname.startsWith(item.url))

  function logout() {
    authContext.logout_i()
    navigate({to: '/'})
  }

  return (
    <header className="w-full p-4" >
      <div className="flex flex-row justify-between">
        <h1 className="text-3xl font-semibold">{ currentMenu?.title }</h1>
        <div className="flex space-x-2">

          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary">{ authContext.user?.first_name }</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuItem>
                <Link to="/profile">
                  Profile / Account
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}