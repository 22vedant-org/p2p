'use client';
import React from 'react';
import { Navigation } from 'lucide-react';
import { ModeToggle } from './mode-toggle';
import { Button } from './ui/button';
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuItem,
} from './ui/dropdown-menu';
import Link from 'next/link';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
export type childrenProps = {
	children: React.ReactNode;
};
const Topbar = ({ children }: childrenProps) => {
	return (
		<header className="backdrop-blur-xl border rounded-lg flex items-center sticky top-0 z-50">
			{children}
			<div className="flex justify-between px-4 h-14 items-center w-full ">
				<div className="flex items-center">
					{/* <div className=""> */}

					<span>Ride Shares</span>
					{/* <Navigation size={'20px'} strokeWidth={'1px'} /> */}
				</div>
				<div className="flex items-center justify-around gap-3 ">
					{/* <div>Dashboard</div> */}
					{/* <div className="">
						<Link href={'/dashboard'}>Dashboard</Link>
					</div> */}
					{/* <Button variant={'secondary'}>Solana</Button> */}
					<WalletMultiButton />
					<ModeToggle />
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								className="flex w-9 h-9 items-center justify-center rounded-full border-2"
								variant={'ghost'}
							>
								N
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							{/* <DropdownMenuLabel>Settings</DropdownMenuLabel>
							<DropdownMenuSeparator></DropdownMenuSeparator> */}
							<DropdownMenuItem>
								<Link href={'/profile'}>Profile</Link>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Link href={'/dashboard'}>Dashboard</Link>
							</DropdownMenuItem>
							<DropdownMenuItem>Sign out</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	);
};

export default Topbar;

// const Topbar = () => {
// 	return (
// 		<header className="backdrop-blur-xl bg-orange-400 flex justify-between">
// 			<div className="flex items-center mx-4 sm:mx-8 h-14 ">
// 				<div className="flex items-center space-x-4 lg:space-x-0">
// 					RideShares
// 				</div>
// 				<div className="flex items-center space-x-2">
// 					<div>Profile</div>
// 					<ModeToggle />
// 				</div>
// 			</div>
// 		</header>
// 	);
// };

// export default Topbar;
