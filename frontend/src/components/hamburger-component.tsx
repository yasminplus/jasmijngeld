"use client"

// originally from https://github.com/shadcn-ui/ui/issues/761#issuecomment-2401074153
import * as React from "react"
import { Menu, ChevronDown, ChevronRight, type LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import { Link } from "@tanstack/react-router"
import { sidebarItems } from "./sidebar-items"
import { useAuthContext } from "@/context/auth"
import { useNavigate } from "@tanstack/react-router"

type MenuItem = {
  title: string
  url?: string
  icon?: LucideIcon
  submenu?: MenuItem[]
}

// TODO: styling needs a lot of refining
const MenuItemComponent: React.FC<{ item: MenuItem; depth?: number }> = ({ item, depth = 0 }) => {
  const [isOpen, setIsOpen] = React.useState(false)

  if (item.submenu) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <button
            className={cn(
              "flex w-full items-center justify-between py-2 text-lg font-medium transition-colors hover:text-primary pl-8",
              depth > 0 && "pl-4"
            )}
          >
            {/* TODO: show icon here */}
            {item.title}
            {isOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          {item.submenu.map((subItem) => (
            <MenuItemComponent key={subItem.title} item={subItem} depth={depth + 1} />
          ))}
        </CollapsibleContent>
      </Collapsible>
    )
  }

  return (
    <Link
      to={item.url}
      className={cn(
        "block py-2 text-lg font-medium transition-colors hover:text-primary",
        depth > 0 && "pl-4",
        item.url === "/" && "text-primary"
      )}
    >
      {item.title}
    </Link>
  )
}

export default function HamburgerMenu() {
  const authContext = useAuthContext()
  const navigate = useNavigate()
  const [open, setOpen] = React.useState(false)

  function logout() {
    authContext.logout_i()
    navigate({to: '/'})
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[240px] sm:w-[300px]">
        <nav className="flex flex-col space-y-4 p-4">
          <div>
            <div className="font-bold text-xl">
              { authContext.user?.first_name }
            </div>
            <Link to="/profile">
              View Profile
            </Link>
          </div>
          <hr/>
          <div>
            {sidebarItems.filter(item => item.title !== 'Profile').map((item) => (
              <MenuItemComponent key={item.title} item={item} />
            ))}
          </div>
          {/* TODO: drag Logout to the bottom of the sheet, use justify-between */}
          <div>
            <Link to="/" onClick={logout}>
            Log out
            </Link>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}