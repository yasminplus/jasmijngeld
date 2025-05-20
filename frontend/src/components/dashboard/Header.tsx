import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "../ui/button"
import { useAuthContext } from '@/context/auth'
import { useNavigate } from "@tanstack/react-router"


export function Header() {
  const authContext = useAuthContext()
  const navigate = useNavigate()

  function logout() {
    authContext.logout_i()
    navigate({to: '/'})
  }

  return (
    <header className=" w-full bg-gray-500 p-4 shadow-md" >
      <div className="flex flex-row justify-end">

      <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">{ authContext.user?.first_name }</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuItem>
          Profile / Account
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
      </div>
    </header>
  )
}