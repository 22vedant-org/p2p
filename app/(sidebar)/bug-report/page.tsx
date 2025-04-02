'use client';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

// async function handleSubmit() {}
const page = () => {
	const handleSubmit = async () => {};
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
					<div className="mb-2">
						<Label>Area</Label>
						{/* <Input></Input> */}
						<Select>
							<SelectTrigger>
								<SelectValue placeholder="Select an area" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="dashboard">
									Dashboard
								</SelectItem>
								<SelectItem value="rideBooking">
									Ride Booking
								</SelectItem>
								<SelectItem value="map">Map</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="mb-2">
						<Label>Title</Label>
						<Input placeholder="Briefly describe the issue" />
					</div>
					<div className="mb-2">
						<Label htmlFor="description">Description</Label>
						<Textarea
							id="description"
							placeholder="Describe the issue you are facing"
						/>
					</div>
					<Button className="w-full" onClick={handleSubmit}>
						Submit
					</Button>
				</CardContent>
			</Card>
		</div>
	);
};

export default page;
