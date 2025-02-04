import React from 'react';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
const page = () => {
	return (
		<div className="grow flex items-center justify-center p-4">
			<Card className="w-[50%] max-w-md">
				<CardHeader className="text-2xl font-bold text-center">
					<CardTitle>Report an issue</CardTitle>
					<CardDescription>
						What area are you having problems with?
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Label>Area</Label>
					{/* <Input></Input> */}
					<Select>
						<SelectTrigger>
							<SelectValue placeholder="Select an area" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="dashboard">Dashboard</SelectItem>
							<SelectItem value="rideBooking">
								Ride Booking
							</SelectItem>
							<SelectItem value="map">Map</SelectItem>
						</SelectContent>
					</Select>
				</CardContent>
			</Card>
		</div>
	);
};

export default page;
