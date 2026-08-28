import { Link, useRouterState } from "@tanstack/react-router"
import type { LucideProps } from "lucide-react"
import type { ForwardRefExoticComponent, RefAttributes } from "react"
import { CreditCard, Home, HandCoins, Plus, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

function BottomTab({label, tabIcon: TabIcon, url, isActive}: {
  label: string,
  tabIcon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>,
  url: string,
  isActive?: boolean
}) {
  return (
    <Link
      to={url} 
      className={cn(
        "flex flex-1 flex-col items-center gap-[4px] font-light",
        isActive? "text-gold-accent" : "text-faint"
      )}
    >
      <TabIcon strokeWidth={1.2} />
      <span className='text-[10px]'>
        { label }
      </span>
    </Link>
  )
}

export function BottomTabBar() {
  const routerState = useRouterState()
  const isLinkActive = (url: string) => routerState.location.href.startsWith(url)

  return (
    <div className='fixed h-[66px] inset-x-0 bottom-0 z-40 
                    bg-sidebar border-t border-line flex items-center px-[6px]
                    md:hidden'>
      <BottomTab label='Dashboard' tabIcon={Home} url='/dashboard' isActive={isLinkActive('/dashboard')} />
      <BottomTab label='Expenses' tabIcon={HandCoins} url='/expenses' isActive={isLinkActive('/expenses')} />
      <div className="flex-1 flex justify-center">
        <Link
          to='/expenses/new'
          className='bg-gold rounded-full flex items-center justify-center 
                    w-[54px] h-[54px] -mt-6 text-ink
                    
                    shadow-[0_0_0_5px_var(--sidebar)]'>
          <Plus className="h-7 w-7" strokeWidth={2.5} />
        </Link>
      </div>
      <BottomTab label='Accounts' tabIcon={CreditCard} url='/accountscards' isActive={isLinkActive('/accountscards')} />
      <BottomTab label='Settings' tabIcon={Settings} url='/settings' isActive={isLinkActive('/settings')} />
    </div>
  )
}