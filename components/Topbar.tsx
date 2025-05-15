'use client';
import React, { useEffect, useState } from 'react';
import localFont from 'next/font/local';
import { Anton } from 'next/font/google';
import { ModeToggle } from './mode-toggle';
import { Button } from './ui/button';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';

import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuItem,
} from './ui/dropdown-menu';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useRouter } from 'next/navigation';
import { Session } from '@/lib/auth';

import ConnectWalletButton from './ConnectionWalletButton';
const anton = Anton({
	subsets: ['latin'],
	weight: ['400'],
	display: 'swap',
});
const Topbar = ({ session }: { session: Session | null }) => {
	const router = useRouter();

	const handleLogOut = async () => {
		try {
			await authClient.signOut({
				fetchOptions: {
					onSuccess: () => {
						router.push('/sign-in');
						router.refresh();
						// authClient.revokeSessions();
					},
				},
			});
		} catch (error) {
			console.error(error);
		}
	};
	return (
		<header className=" backdrop-blur-sm border rounded-lg flex items-center sticky top-0 z-50">
			<div className="flex justify-between px-4 h-14 items-center w-full ">
				<div className="flex items-center">
					<span className={`${anton.className}`}>Ride Shares</span>
					{/* <span>Ride Shares</span> */}
				</div>
				<div className="flex items-center justify-around gap-3 ">
					{/* <WalletMultiButton /> */}
					<ConnectWalletButton />
					<ModeToggle />

					{/* <DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								className="flex w-9 h-9 items-center justify-center rounded-full border-2"
								variant={'ghost'}
							>
								{session ? session?.user.name.charAt(0) : 'U'}
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem>
								<Link href={'/profile'}>Profile</Link>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Link href={'/dashboard'}>Dashboard</Link>
							</DropdownMenuItem>
							<DropdownMenuItem onClick={handleLogOut}>
								Sign out
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu> */}
				</div>
			</div>
		</header>
	);
};

export default Topbar;
