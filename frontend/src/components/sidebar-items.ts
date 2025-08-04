import { Calendar, Home, Inbox, Settings } from "lucide-react"

// Sidebar menu items
export const sidebarItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Expenses",
    url: "/expenses",
    icon: Inbox,
  },
  {
    title: "Accounts & Cards",
    url: "/accountscards",
    icon: Calendar,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
]