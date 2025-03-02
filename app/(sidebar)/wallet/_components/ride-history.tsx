import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight, Car, User } from 'lucide-react';

export function TransactionHistory() {
	const transactions = [
		{
			id: 'tx1',
			type: 'earned',
			amount: '15',
			symbol: 'RTC',
			from: 'Morning Commute',
			to: 'Your Wallet',
			date: '2023-04-12T10:23:42Z',
			status: 'completed',
			role: 'driver',
			distance: '15.2 km',
		},
		{
			id: 'tx2',
			type: 'spent',
			amount: '25',
			symbol: 'RTC',
			from: 'Your Wallet',
			to: 'Weekend Trip',
			date: '2023-04-10T14:45:12Z',
			status: 'completed',
			role: 'passenger',
			distance: '32.5 km',
		},
		{
			id: 'tx3',
			type: 'earned',
			amount: '20',
			symbol: 'RTC',
			from: 'Evening Return',
			to: 'Your Wallet',
			date: '2023-04-08T09:12:34Z',
			status: 'completed',
			role: 'driver',
			distance: '18.5 km',
		},
		{
			id: 'tx4',
			type: 'spent',
			amount: '15',
			symbol: 'RTC',
			from: 'Your Wallet',
			to: 'Morning Commute',
			date: '2023-04-05T16:32:21Z',
			status: 'completed',
			role: 'passenger',
			distance: '15.2 km',
		},
	];

	return (
		<Card>
			<CardHeader>
				<CardTitle>Ride History</CardTitle>
				<CardDescription>
					Your recent carpooling activity and transactions
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<div className="rounded-md border">
						<div className="grid grid-cols-6 gap-4 p-4 font-medium text-sm text-muted-foreground md:grid-cols-7">
							<div>Type</div>
							<div>Credits</div>
							<div>Role</div>
							<div className="hidden md:block">Distance</div>
							<div className="hidden md:block">Ride</div>
							<div>Date</div>
							<div>Status</div>
						</div>
						{transactions.map((tx) => (
							<div
								key={tx.id}
								className="grid grid-cols-6 gap-4 border-t p-4 text-sm md:grid-cols-7"
							>
								<div className="flex items-center">
									{tx.type === 'earned' ? (
										<ArrowDownRight className="mr-2 h-4 w-4 text-green-500" />
									) : (
										<ArrowUpRight className="mr-2 h-4 w-4 text-blue-500" />
									)}
									<span className="capitalize">
										{tx.type}
									</span>
								</div>
								<div
									className={
										tx.type === 'earned'
											? 'text-green-500'
											: 'text-red-500'
									}
								>
									{tx.type === 'earned' ? '+' : '-'}
									{tx.amount} {tx.symbol}
								</div>
								<div className="flex items-center">
									{tx.role === 'driver' ? (
										<Car className="mr-2 h-4 w-4 text-blue-500" />
									) : (
										<User className="mr-2 h-4 w-4 text-green-500" />
									)}
									<span className="capitalize">
										{tx.role}
									</span>
								</div>
								<div className="hidden md:block">
									{tx.distance}
								</div>
								<div className="hidden truncate md:block">
									{tx.from === 'Your Wallet'
										? tx.to
										: tx.from}
								</div>
								<div>
									{new Date(tx.date).toLocaleDateString()}
								</div>
								<div>
									<span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-100">
										{tx.status}
									</span>
								</div>
							</div>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
