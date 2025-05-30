'use client';
import { useEffect } from 'react';
import { useSessionStateStore } from '@/hooks/store/useSessionStore';

import {
	BadgeCheck,
	Bell,
	ChevronsUpDown,
	CreditCard,
	LogOut,
	Sparkles,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from '@/components/ui/sidebar';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
export function NavUser({
	user,
}: {
	user: {
		name: string;
		email: string;
		avatar: string;
	};
}) {
	const router = useRouter();
	const { isMobile } = useSidebar();
	const { data } = authClient.useSession();
	const session = data;

	// const session = useSessionStateStore((state) => state.session);
	// useEffect(() => {
	// 	console.log(session);
	// });
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<Avatar className="h-8 w-8 rounded-lg">
								<AvatarImage
									src={
										session
											? session?.user.image!
											: user.avatar
									}
									alt={
										session ? session?.user.name : user.name
									}
								/>
								<AvatarFallback className="rounded-lg">
									JS
								</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-semibold">
									{session ? session?.user.name : user.name}
								</span>
								<span className="truncate text-xs">
									{session ? session?.user.email : user.email}
								</span>
							</div>
							<ChevronsUpDown className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
						side={isMobile ? 'bottom' : 'right'}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar className="h-8 w-8 rounded-lg">
									<AvatarImage
										src={
											session
												? session?.user.image!
												: user.avatar
										}
										alt={
											session
												? session?.user.name
												: user.name
										}
									/>
									<AvatarFallback className="rounded-lg">
										{session?.user.name?.charAt(0)}
									</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">
										{session
											? session?.user.name
											: user.name}
									</span>
									<span className="truncate text-xs">
										{session
											? session?.user.email
											: user.email}
									</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						{/* <DropdownMenuGroup>
							<DropdownMenuItem>
								<Sparkles />
								Upgrade to Pro
							</DropdownMenuItem>
						</DropdownMenuGroup> */}
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem>
								<BadgeCheck />
								Account
							</DropdownMenuItem>
							<DropdownMenuItem>
								<CreditCard />
								Payments
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => {
									router.push('/messages');
								}}
							>
								<Bell />
								Notifications
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={async () => {
								try {
									await authClient.signOut({
										fetchOptions: {
											onSuccess: () => {
												router.push('/landing');
												router.refresh();
												authClient.revokeSessions();
											},
										},
									});
								} catch (error) {
									console.error(error);
								}
							}}
						>
							<LogOut />
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
