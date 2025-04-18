'use client';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight, Copy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'sonner';

export function WalletOverview() {
	const [walletAddress, setWalletAddress] = useState('');
	const { data } = authClient.useSession();
	const session = data;
	const { connection } = useConnection();
	const { publicKey } = useWallet();

	// useEffect(() => {
	// 	setWalletAddress(
	// 		(publicKey as NonNullable<typeof publicKey>).toBase58()
	// 	);
	// }, []);

	async function handleCopy() {
		if (!publicKey) {
			toast.error('No wallet found');
			return;
		}
		try {
			await navigator.clipboard.writeText(
				(publicKey as NonNullable<typeof publicKey>).toBase58()
			);
			setWalletAddress(
				(publicKey as NonNullable<typeof publicKey>).toBase58()
			);
		} catch (error) {
			toast.error('Failed to copy address');
		}
	}

	return (
		<Card className="col-span-1">
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<div className="space-y-1">
					<CardTitle>Wallet Overview</CardTitle>
					<CardDescription>
						Your ride credits and wallet address
					</CardDescription>
				</div>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<div>
						<div className="text-sm font-medium text-muted-foreground">
							Total Ride Credits
						</div>
						<div className="text-3xl font-bold">3 SOL</div>
						<div className="flex items-center text-sm text-green-500">
							<ArrowUpRight className="mr-1 h-4 w-4" />
							<span>+15 credits this week</span>
						</div>
					</div>
					<div>
						<div className="text-sm font-medium text-muted-foreground">
							Wallet Address
						</div>
						<div className="flex items-center gap-2 rounded-md bg-muted p-2 text-xs font-mono">
							<span className="truncate">{walletAddress}</span>
							{/* <span className="truncate"> */}
							{/* {publicKey!.toBase58()} */}
							{/* </span> */}
							<button className="ml-auto" onClick={handleCopy}>
								<Copy className="h-4 w-4 text-muted-foreground hover:text-foreground" />
							</button>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<button className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
							<ArrowUpRight className="mr-2 h-4 w-4" />
							Offer Ride
						</button>
						<button className="inline-flex items-center justify-center whitespace-nowrap rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
							<ArrowDownRight className="mr-2 h-4 w-4" />
							Book Ride
						</button>
					</div>
					{/* <div className="mt-4 space-y-2">
						<div className="flex justify-between text-sm">
							<span className="text-muted-foreground">
								Total Distance
							</span>
							<span className="font-medium">1,245 km</span>
						</div>
						<div className="flex justify-between text-sm">
							<span className="text-muted-foreground">
								Carbon Saved
							</span>
							<span className="font-medium">324 kg CO₂</span>
						</div>
						<div className="flex justify-between text-sm">
							<span className="text-muted-foreground">
								Rides Completed
							</span>
							<span className="font-medium">42</span>
						</div>
					</div> */}
				</div>
			</CardContent>
		</Card>
	);
}
