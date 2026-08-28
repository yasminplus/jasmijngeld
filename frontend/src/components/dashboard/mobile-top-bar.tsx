import { Link, useNavigate } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuthContext } from "@/context/auth"
import { useProfile } from "@/context/profile"
import { ModeToggle } from "@/components/mode-toggle"

export function MobileTopBar() {
	const authContext = useAuthContext()
	const navigate = useNavigate()
	const { firstName } = useProfile()

	function logout() {
		authContext.logout_i()
		navigate({to: '/'})
	}
	
	return (
		<div className="h-[56px] flex-none bg-sidebar border-b flex items-center justify-between px-[16px] md:hidden">
			<div className="font-display text-[20px] text-sidebar-foreground">
				Jasmijn<span className="text-gold">geld</span>
			</div>
			<div className="flex gap-2 items-center justify-center 
											text-dim text-[14px]">
				<ModeToggle 
					className="h-[32px] w-[32px] rounded-[8px] border bg-transparent dark:bg-transparent text-dim" />

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button 
							variant="secondary" 
							className="h-auto rounded-[8px] border bg-transparent
												 shadow-none py-[6px] px-[10px] text-[12.5px] 
												 font-normal text-dim hover:bg-transparent"
						>
							{ firstName }
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-48">
						<DropdownMenuItem>
							<Link to="/profile">
								Profile
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
	)
}