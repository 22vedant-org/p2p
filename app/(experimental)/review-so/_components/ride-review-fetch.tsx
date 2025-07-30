'use client';

import { useState } from 'react';
import { useReviewProgram, RideAccount } from './hooks/useReviewProgram';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Loader2, AlertCircle } from 'lucide-react';

export const RideDetails = () => {
	const { fetchRideAccount } = useReviewProgram();
	const [rideId, setRideId] = useState('');
	const [rideAccount, setRideAccount] = useState<RideAccount | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleFetchRide = async () => {
		if (!rideId) {
			setError('Please enter a Ride ID.');
			return;
		}
		setIsLoading(true);
		setError(null);
		setRideAccount(null);

		try {
			const account = await fetchRideAccount(rideId);
			if (account) {
				setRideAccount(account);
			} else {
				setError('Ride account not found.');
			}
		} catch (e) {
			console.error(e);
			setError('An error occurred while fetching the ride account.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Card className="w-full max-w-2xl mx-auto mt-8">
			<CardHeader>
				<CardTitle className="text-2xl font-bold">
					Fetch Ride Details
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex w-full items-center space-x-2 mb-4">
					<Input
						type="text"
						value={rideId}
						onChange={(e) => setRideId(e.target.value)}
						placeholder="Enter a Ride ID"
						disabled={isLoading}
					/>
					<Button onClick={handleFetchRide} disabled={isLoading}>
						{isLoading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Fetching...
							</>
						) : (
							'Fetch Ride'
						)}
					</Button>
				</div>

				{error && (
					<Alert variant="destructive" className="mb-4">
						<AlertCircle className="h-4 w-4" />
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				{rideAccount && (
					<div>
						<h3 className="text-xl font-semibold mb-4">
							Ride Information
						</h3>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Attribute</TableHead>
									<TableHead>Value</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								<TableRow>
									<TableCell className="font-medium">
										Ride ID
									</TableCell>
									<TableCell>{rideAccount.rideId}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell className="font-medium">
										Driver
									</TableCell>
									<TableCell>{rideAccount.driver}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell className="font-medium">
										Status
									</TableCell>
									<TableCell>{rideAccount.status}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell className="font-medium">
										Start Location
									</TableCell>
									<TableCell>
										{rideAccount.startLocation}
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell className="font-medium">
										End Location
									</TableCell>
									<TableCell>
										{rideAccount.endLocation}
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell className="font-medium">
										Price Per Seat
									</TableCell>
									<TableCell>
										{rideAccount.pricePerSeat}
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell className="font-medium">
										Max Passengers
									</TableCell>
									<TableCell>
										{rideAccount.maxPassengers}
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell className="font-medium">
										Current Passengers
									</TableCell>
									<TableCell>
										{rideAccount.currentPassengers}
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell className="font-medium">
										Departure Time
									</TableCell>
									<TableCell>
										{new Date(
											rideAccount.departureTime * 1000
										).toLocaleString()}
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell className="font-medium">
										Passengers
									</TableCell>
									<TableCell>
										<ul className="list-disc pl-5">
											{rideAccount.passengers.map(
												(p, index) => (
													<li key={index}>{p}</li>
												)
											)}
										</ul>
									</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</div>
				)}
			</CardContent>
		</Card>
	);
};
