/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import * as React from 'react';
import {
	AudioWaveform,
	Lock,
	BookOpen,
	Bot,
	Command,
	Frame,
	GalleryVerticalEnd,
	Map,
	PieChart,
	Settings2,
	SquareTerminal,
	Gauge,
	Car,
	Bug,
	IndianRupee,
	Star,
} from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import { NavProjects } from '@/components/nav-projects';
import { NavUser } from '@/components/nav-user';
import { TeamSwitcher } from '@/components/team-switcher';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
	SidebarTrigger,
	useSidebar,
} from '@/components/ui/sidebar';
import { authClient } from '@/lib/auth-client';
import { Session } from '@/lib/auth';
import { useSessionStateStore } from '@/hooks/store/useSessionStore';
const data = {
	user: {
		name: 'shadcn',
		//from session data
		email: 'm@example.com',
		//from session data
		avatar: '/avatars/shadcn.jpg',
		//fetch user img either IPFS or Cloudflare object store
	},
	teams: [
		{
			name: 'Acme Inc',
			logo: GalleryVerticalEnd,
			plan: 'Enterprise',
		},
		{
			name: 'Acme Corp.',
			logo: AudioWaveform,
			plan: 'Startup',
		},
		{
			name: 'Evil Corp.',
			logo: Command,
			plan: 'Free',
		},
	],
	navMain: [
		{
			title: 'Dashboard',
			url: '/dashboard',
			icon: Gauge,
			isActive: true,
			items: [
				{
					title: 'History',
					url: 'dashboard/#history',
				},
				{
					title: 'Starred',
					url: 'dashboard/#starred',
				},
				{
					title: 'Settings',
					url: 'dashboard/#settings',
				},
			],
		},
		{
			title: 'Rides',
			url: '#',
			icon: Car,
			items: [
				{
					title: 'Offer a Ride',
					url: '/create',
				},
				{
					title: 'Find a Ride',
					url: '',
				},
				{
					title: 'Ride History',
					url: '/profile/#history',
				},
			],
		},
		{
			title: 'Payments',
			url: '#',
			icon: IndianRupee,
			items: [
				{
					title: 'My Wallet',
					url: '/wallet',
				},
				{
					title: 'Payment Methods',
					url: '/wallet/#preferences',
				},
			],
		},
		{
			title: 'Reviews',
			url: '#',
			icon: Star,
			items: [
				{
					title: 'My Reviews',
					url: '/reviews',
				},
				{
					title: 'Post a Review',
					url: '/reviews/#post',
				},
				{
					title: 'Verify Reviews',
					url: '#/reviews/#verify',
				},
			],
		},
		{
			title: 'Settings',
			url: '#',
			icon: Settings2,
			items: [
				{
					title: 'General',
					url: '/settings/#general',
				},
				{
					title: 'Team',
					url: '/settings/#teams',
				},
				{
					title: 'Billing',
					url: '/settings/#billing',
				},
			],
		},
		{
			title: 'Bugs',
			url: '#',
			icon: Bug,
			items: [
				{
					title: 'Report a bug',
					url: '/bug-report',
				},
			],
		},
	],
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
	session: Session | null;
}

export function AppSidebar({ session, ...props }: AppSidebarProps) {
	const { open } = useSidebar();
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<div className="flex items-center">
					<TeamSwitcher teams={data.teams} />
					{/* {sidebarStatus === 'true' ? <SidebarTrigger /> : null} */}
					{open && <SidebarTrigger />}
				</div>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
				{/* <NavProjects projects={data.projects} /> */}
			</SidebarContent>
			<SidebarFooter>
				{/* {sidebarStatus === 'false' ? <SidebarTrigger /> : null} */}
				{!open && <SidebarTrigger />}
				{/* <SidebarTrigger /> */}
				<NavUser user={data.user} />
			</SidebarFooter>
		</Sidebar>
	);
}
