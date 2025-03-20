'use client';

import { useState } from 'react';
import { DollarSign, TrendingUp, Ticket, Car } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
export default function Dashboard() {
	const [timeframe, setTimeframe] = useState('last-week');
	const { data } = authClient.useSession();
	const session = data;
	// Mock data - empty for this example
	const orders = [
		{
			id: '100',
			number: '001',
			date: '23/01/2312',
			customer: 'Bonnie',
			event: 'Boneheads',
			amount: '1000',
		},
	];

	return (
		<div className="flex flex-col min-h-screen">
			<div className="flex-1 space-y-8 p-8 pt-6">
				<div className="flex items-center justify-between">
					<h1 className="text-3xl font-bold tracking-tight">
						Good afternoon, {session ? session?.user.name : ''}
					</h1>
					<div className="flex items-center gap-2">
						<Select value={timeframe} onValueChange={setTimeframe}>
							<SelectTrigger className="w-[180px] bg-gray-900 border-gray-800">
								<SelectValue placeholder="Select timeframe" />
							</SelectTrigger>
							<SelectContent className="bg-gray-900 border-gray-800">
								<SelectItem value="today">Today</SelectItem>
								<SelectItem value="yesterday">
									Yesterday
								</SelectItem>
								<SelectItem value="last-week">
									Last week
								</SelectItem>
								<SelectItem value="last-month">
									Last month
								</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				<div className="grid gap-4 md:grid-cols-3">
					<Card className="bg-gray-900 border-gray-800 text-white">
						<CardHeader className="flex flex-row items-center justify-between pb-2">
							<CardTitle className="text-sm font-medium text-gray-400">
								Total revenue
							</CardTitle>
							<DollarSign className="h-4 w-4 text-gray-400" />
						</CardHeader>
						<CardContent>
							<div className="text-3xl font-bold">$0.00</div>
						</CardContent>
					</Card>

					<Card className="bg-gray-900 border-gray-800 text-white">
						<CardHeader className="flex flex-row items-center justify-between pb-2">
							<CardTitle className="text-sm font-medium text-gray-400">
								Average order value
							</CardTitle>
							<TrendingUp className="h-4 w-4 text-gray-400" />
						</CardHeader>
						<CardContent>
							<div className="text-3xl font-bold">$0.00</div>
						</CardContent>
					</Card>

					<Card className="bg-gray-900 border-gray-800 ">
						<CardHeader className="flex flex-row items-center justify-between pb-2">
							<CardTitle className="text-sm font-medium text-gray-400">
								Completed Rides
							</CardTitle>
							<Car className="h-4 w-4 text-gray-400" />
						</CardHeader>
						<CardContent>
							<div className="text-3xl font-bold">0</div>
						</CardContent>
					</Card>
				</div>

				<div className="space-y-4">
					<h2 className="text-2xl font-bold tracking-tight">
						Recent orders
					</h2>
					<div className="rounded-md border border-gray-800 bg-gray-950">
						<Table>
							<TableHeader>
								<TableRow className="border-gray-800 hover:bg-gray-900">
									<TableHead className="text-gray-400">
										Order number
									</TableHead>
									<TableHead className="text-gray-400">
										Purchase date
									</TableHead>
									<TableHead className="text-gray-400">
										Customer
									</TableHead>
									<TableHead className="text-gray-400">
										Event
									</TableHead>
									<TableHead className="text-gray-400">
										Amount
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{orders.length > 0 ? (
									orders.map((order) => (
										<TableRow
											key={order.id}
											className="border-gray-800 hover:bg-gray-900"
										>
											<TableCell>
												{order.number}
											</TableCell>
											<TableCell>{order.date}</TableCell>
											<TableCell>
												{order.customer}
											</TableCell>
											<TableCell>{order.event}</TableCell>
											<TableCell className="">
												{order.amount}
											</TableCell>
										</TableRow>
									))
								) : (
									<TableRow className="border-gray-800 hover:bg-gray-900">
										<TableCell
											colSpan={5}
											className="h-24 text-center text-gray-400"
										>
											No results.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
							<TableFooter>
								<TableRow>
									<TableCell colSpan={4}>Total</TableCell>
									<TableCell className="">
										$2,500.00
									</TableCell>
								</TableRow>
							</TableFooter>
						</Table>
					</div>
					{/* 
					<div className="flex items-center justify-end space-x-2 py-4">
						<Button
							variant="outline"
							className="bg-transparent border-gray-800 text-gray-400 hover:bg-gray-900 hover:text-white"
							disabled={true}
						>
							Previous
						</Button>
						<Button
							variant="outline"
							className="bg-transparent border-gray-800 text-gray-400 hover:bg-gray-900 hover:text-white"
							disabled={true}
						>
							Next
						</Button>
					</div> */}
				</div>
			</div>
		</div>
	);
}
