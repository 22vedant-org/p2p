'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
	AlertCircle,
	Copy,
	ExternalLink,
	Plus,
	Trash2,
	Wallet,
} from 'lucide-react';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

const walletFormSchema = z.object({
	walletAddress: z.string().min(42, {
		message: 'Wallet address must be a valid Ethereum address.',
	}),
	walletName: z.string().min(1, {
		message: 'Please provide a name for this wallet.',
	}),
});

type WalletFormValues = z.infer<typeof walletFormSchema>;

// Mock data for connected wallets
const connectedWallets = [
	{
		id: '1',
		name: 'Main Wallet',
		address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
		isDefault: true,
		network: 'Ethereum',
	},
	{
		id: '2',
		name: 'Savings Wallet',
		address: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
		isDefault: false,
		network: 'Polygon',
	},
];

export default function WalletSettings() {
	const [isLoading, setIsLoading] = useState(false);
	const [wallets, setWallets] = useState(connectedWallets);
	const [isAddWalletOpen, setIsAddWalletOpen] = useState(false);

	const form = useForm<WalletFormValues>({
		resolver: zodResolver(walletFormSchema),
		defaultValues: {
			walletAddress: '',
			walletName: '',
		},
		mode: 'onChange',
	});

	function onSubmit(data: WalletFormValues) {
		setIsLoading(true);

		// Simulate API call
		setTimeout(() => {
			setIsLoading(false);
			setIsAddWalletOpen(false);

			// Add new wallet to the list
			const newWallet = {
				id: (wallets.length + 1).toString(),
				name: data.walletName,
				address: data.walletAddress,
				isDefault: wallets.length === 0,
				network: 'Ethereum',
			};

			setWallets([...wallets, newWallet]);

			form.reset();

			toast({
				title: 'Wallet added',
				description: 'Your new wallet has been connected successfully.',
			});
		}, 1000);
	}

	function setDefaultWallet(id: string) {
		setWallets(
			wallets.map((wallet) => ({
				...wallet,
				isDefault: wallet.id === id,
			}))
		);

		toast({
			title: 'Default wallet updated',
			description: 'Your default wallet has been updated successfully.',
		});
	}

	function removeWallet(id: string) {
		setWallets(wallets.filter((wallet) => wallet.id !== id));

		toast({
			title: 'Wallet removed',
			description: 'The wallet has been disconnected successfully.',
		});
	}

	function copyAddress(address: string) {
		navigator.clipboard.writeText(address);

		toast({
			title: 'Address copied',
			description: 'Wallet address copied to clipboard.',
		});
	}

	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-medium">Blockchain Wallet</h3>
				<p className="text-sm text-muted-foreground">
					Manage your blockchain wallets for payments and
					transactions.
				</p>
			</div>

			<Alert>
				<AlertCircle className="h-4 w-4" />
				<AlertTitle>Important</AlertTitle>
				<AlertDescription>
					Your wallet is used for ride payments, rewards, and carbon
					credits. Always verify transactions before confirming.
				</AlertDescription>
			</Alert>

			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h4 className="text-sm font-medium">Connected Wallets</h4>
					<Dialog
						open={isAddWalletOpen}
						onOpenChange={setIsAddWalletOpen}
					>
						<DialogTrigger asChild>
							<Button size="sm" variant="outline">
								<Plus className="mr-2 h-4 w-4" />
								Add Wallet
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Connect a new wallet</DialogTitle>
								<DialogDescription>
									Add a blockchain wallet to use for payments
									and transactions.
								</DialogDescription>
							</DialogHeader>

							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className="space-y-4"
								>
									<FormField
										control={form.control}
										name="walletName"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Wallet Name
												</FormLabel>
												<FormControl>
													<Input
														placeholder="e.g., Main Wallet"
														{...field}
													/>
												</FormControl>
												<FormDescription>
													A friendly name to identify
													this wallet.
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="walletAddress"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Wallet Address
												</FormLabel>
												<FormControl>
													<Input
														placeholder="0x..."
														{...field}
													/>
												</FormControl>
												<FormDescription>
													Your Ethereum or compatible
													blockchain wallet address.
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormItem>
										<FormLabel>Network</FormLabel>
										<Select defaultValue="ethereum">
											<SelectTrigger>
												<SelectValue placeholder="Select network" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="ethereum">
													Ethereum
												</SelectItem>
												<SelectItem value="polygon">
													Polygon
												</SelectItem>
												<SelectItem value="optimism">
													Optimism
												</SelectItem>
												<SelectItem value="arbitrum">
													Arbitrum
												</SelectItem>
											</SelectContent>
										</Select>
										<FormDescription>
											Select the blockchain network for
											this wallet.
										</FormDescription>
									</FormItem>

									<DialogFooter>
										<Button
											type="button"
											variant="outline"
											onClick={() =>
												setIsAddWalletOpen(false)
											}
										>
											Cancel
										</Button>
										<Button
											type="submit"
											disabled={isLoading}
										>
											{isLoading
												? 'Adding...'
												: 'Add Wallet'}
										</Button>
									</DialogFooter>
								</form>
							</Form>
						</DialogContent>
					</Dialog>
				</div>

				{wallets.length === 0 ? (
					<div className="rounded-lg border border-dashed p-8 text-center">
						<Wallet className="mx-auto h-10 w-10 text-muted-foreground" />
						<h3 className="mt-2 text-sm font-medium">
							No wallets connected
						</h3>
						<p className="mt-1 text-sm text-muted-foreground">
							Connect a blockchain wallet to start using the
							platform.
						</p>
						<Button
							variant="outline"
							className="mt-4"
							onClick={() => setIsAddWalletOpen(true)}
						>
							<Plus className="mr-2 h-4 w-4" />
							Add Wallet
						</Button>
					</div>
				) : (
					<div className="space-y-4">
						{wallets.map((wallet) => (
							<Card key={wallet.id}>
								<CardHeader className="pb-3">
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-2">
											<CardTitle className="text-base">
												{wallet.name}
											</CardTitle>
											{wallet.isDefault && (
												<Badge
													variant="outline"
													className="text-xs"
												>
													Default
												</Badge>
											)}
										</div>
										<Badge>{wallet.network}</Badge>
									</div>
									<CardDescription className="flex items-center mt-1">
										<span className="truncate max-w-[240px] sm:max-w-[320px]">
											{wallet.address}
										</span>
										<Button
											variant="ghost"
											size="icon"
											className="h-6 w-6 ml-1"
											onClick={() =>
												copyAddress(wallet.address)
											}
										>
											<Copy className="h-3.5 w-3.5" />
										</Button>
										<Button
											variant="ghost"
											size="icon"
											className="h-6 w-6"
											asChild
										>
											<a
												href={`https://etherscan.io/address/${wallet.address}`}
												target="_blank"
												rel="noopener noreferrer"
											>
												<ExternalLink className="h-3.5 w-3.5" />
											</a>
										</Button>
									</CardDescription>
								</CardHeader>
								<CardContent className="pb-2">
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-2">
											<span className="text-sm">
												Set as default
											</span>
											<Switch
												checked={wallet.isDefault}
												onCheckedChange={() =>
													setDefaultWallet(wallet.id)
												}
												disabled={wallet.isDefault}
											/>
										</div>
									</div>
								</CardContent>
								<CardFooter>
									<Button
										variant="destructive"
										size="sm"
										className="ml-auto"
										onClick={() => removeWallet(wallet.id)}
									>
										<Trash2 className="mr-2 h-4 w-4" />
										Remove
									</Button>
								</CardFooter>
							</Card>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
