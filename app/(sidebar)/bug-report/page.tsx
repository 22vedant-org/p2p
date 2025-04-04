/* eslint-disable react-hooks/rules-of-hooks */
'use client';
import React, { useState } from 'react';
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
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';

// async function handleSubmit() {}
const page = () => {
	const [area, setArea] = useState('');
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const { toast } = useToast();
	const handleSubmit = async () => {
		try {
			const response = await axios.post('api/bug-report', {
				area: area,
				title: title,
				description: description,
			});
			toast({
				title: 'Report submitted successfully',
				// description: ""
			});
		} catch (error) {
			console.error(error);
			toast({
				title: 'Error',
				description: `${error}`,
			});
		}
	};
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
						<Select onValueChange={(value) => setArea(value)}>
							<SelectTrigger>
								<SelectValue placeholder="Select an area" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="Dashboard">
									Dashboard
								</SelectItem>
								<SelectItem value="RideBooking">
									Ride Booking
								</SelectItem>
								<SelectItem value="Map">Map</SelectItem>
								<SelectItem value="Payments">
									Payments
								</SelectItem>
								<SelectItem value="ReviewS">Reviews</SelectItem>
								<SelectItem value="Settings">
									Settings
								</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="mb-2">
						<Label>Title</Label>
						<Input
							placeholder="Briefly describe the issue"
							onChange={(e) => setTitle(e.target.value)}
						/>
					</div>
					<div className="mb-2">
						<Label htmlFor="description">Description</Label>
						<Textarea
							id="description"
							placeholder="Describe the issue you are facing"
							onChange={(e) => setDescription(e.target.value)}
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
