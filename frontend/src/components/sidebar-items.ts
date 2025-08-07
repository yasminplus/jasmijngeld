import { CreditCard, Home, HandCoins, Settings } from "lucide-react"

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
    icon: HandCoins,
  },
  {
    title: "Accounts & Cards",
    url: "/accountscards",
    icon: CreditCard,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
]