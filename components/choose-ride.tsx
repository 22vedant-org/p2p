'use client';

import type React from 'react';
import { useState } from 'react';
import { Users, ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import Image from 'next/image';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';

interface Ride {
	id: string;
	startLocation: string;
	endLocation: string;
	startLocationCoord: number[];
	endLocationCoord: number[];
	departureTime: string;
	estimatedArrivalTime: string;
	availableSeats: number;
	pricePerSeat: number;
	status: string;
	vehicleType: string;
	vehicleModel?: string;
	vehicleColor?: string;
	licensePlate?: string;
	polyLineCoords?: any[];
	distanceFromUser?: number;
	driver: {
		id: string;
		name: string;
		image?: string;
		role: string;
	};
	rideRequests: {
		id: string;
		seats: number;
		status: string;
	}[];
}

interface ChooseRideProps {
	rides: Ride[];
	onJoinRide: (rideId: string, ride: Ride) => void;
}

const ChooseRide: React.FC<ChooseRideProps> = ({ rides, onJoinRide }) => {
	const [expandedRides, setExpandedRides] = useState<Record<string, boolean>>(
		{}
	);

	const toggleRideExpansion = (rideId: string) => {
		setExpandedRides((prev) => ({
			...prev,
			[rideId]: !prev[rideId],
		}));
	};

	const formatTime = (dateString: string) => {
		return new Date(dateString).toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: '2-digit',
			hour12: true,
		});
	};

	const getVehicleImage = (vehicleType?: string) => {
		// Default fallback image
		const defaultImage = '/placeholder.svg?height=48&width=48';

		if (!vehicleType) {
			return defaultImage;
		}

		try {
			switch (vehicleType.toLowerCase()) {
				case 'sedan':
				case 'car':
					return 'https://k1fe7q2u22.ufs.sh/f/DgxaonI3rzDhl4oD7XGscZbn5fMeuoYqdk82z3rOyC9FEVmK';
				case 'suv':
					return defaultImage;
				case 'hatchback':
					return defaultImage;
				default:
					return defaultImage;
			}
		} catch (error) {
			console.error('Error in getVehicleImage:', error);
			return defaultImage;
		}
	};

	const calculateEstimatedTime = (ride: Ride) => {
		if (ride.distanceFromUser) {
			return `${Math.round(ride.distanceFromUser * 2)} min away`;
		}
		return '5 min away';
	};

	return (
		<div className="p-6 mx-auto space-y-6 w-full">
			<div className="mb-6">
				<h2 className="text-xl mb-3">
					{rides.length > 0 ? 'Recommended' : 'No rides available'}
				</h2>

				{rides.length === 0 ? (
					<div className="text-center py-8 text-gray-500">
						<p>No rides found matching your criteria.</p>
						<p className="text-sm mt-2">
							Try adjusting your search parameters.
						</p>
					</div>
				) : (
					<div className="space-y-4">
						{rides.map((ride, index) => (
							<Collapsible
								key={ride.id}
								open={expandedRides[ride.id] || false}
								onOpenChange={() =>
									toggleRideExpansion(ride.id)
								}
								className="border rounded-xl overflow-hidden"
							>
								<CollapsibleTrigger asChild>
									<div className="p-4 flex items-center gap-4 cursor-pointer transition-colors">
										<div className="relative flex-shrink-0">
											<Image
												src={
													getVehicleImage(
														ride.vehicleType
													) || '/placeholder.svg'
												}
												alt={
													ride.vehicleType ||
													'Vehicle'
												}
												width={48}
												height={48}
												className="object-contain"
												onError={(e) => {
													e.currentTarget.src =
														'/placeholder.svg?height=48&width=48';
												}}
											/>
										</div>

										<div className="flex-grow">
											<div className="flex items-center gap-2">
												<h3 className="font-medium">
													{ride.vehicleType || 'Car'}
												</h3>
												<div className="flex items-center text-sm text-gray-600">
													<Users className="w-4 h-4 mr-1" />
													<span>
														{ride.availableSeats}
													</span>
												</div>
											</div>

											<div className="text-sm text-gray-600">
												<p className="flex items-center gap-1">
													<MapPin className="w-3 h-3" />
													{ride.startLocation} →{' '}
													{ride.endLocation}
												</p>
												<p>
													{calculateEstimatedTime(
														ride
													)}{' '}
													•{' '}
													{formatTime(
														ride.departureTime
													)}
												</p>
												<p>
													Driver: {ride.driver.name}
												</p>
											</div>
										</div>

										<div className="flex flex-col items-end">
											<div className="font-medium">
												₹{ride.pricePerSeat}
											</div>
											<div className="text-sm text-gray-500">
												per seat
											</div>
											{expandedRides[ride.id] ? (
												<ChevronUp className="w-5 h-5 text-gray-500" />
											) : (
												<ChevronDown className="w-5 h-5 text-gray-500" />
											)}
										</div>
									</div>
								</CollapsibleTrigger>

								<CollapsibleContent className="p-4 space-y-4">
									<div className="space-y-2">
										<h4 className="font-medium">
											Driver Details
										</h4>
										<div className="flex items-center gap-3">
											{ride.driver.image && (
												<img
													src={
														ride.driver.image ||
														'/placeholder.svg'
													}
													alt={ride.driver.name}
													className="w-10 h-10 rounded-full object-cover"
												/>
											)}
											<div>
												<p className="font-medium">
													{ride.driver.name}
												</p>
												<p className="text-sm text-gray-600">
													Rating: 4.8 ⭐
												</p>
											</div>
										</div>
									</div>

									<div className="space-y-2">
										<h4 className="font-medium">
											Vehicle Details
										</h4>
										<p>Type: {ride.vehicleType}</p>
										{ride.vehicleModel && (
											<p>Model: {ride.vehicleModel}</p>
										)}
										{ride.vehicleColor && (
											<p>Color: {ride.vehicleColor}</p>
										)}
										{ride.licensePlate && (
											<p>
												License Plate:{' '}
												{ride.licensePlate}
											</p>
										)}
									</div>

									<div className="space-y-2">
										<h4 className="font-medium">
											Ride Details
										</h4>
										<p>
											Departure:{' '}
											{formatTime(ride.departureTime)}
										</p>
										{ride.estimatedArrivalTime && (
											<p>
												Estimated Arrival:{' '}
												{formatTime(
													ride.estimatedArrivalTime
												)}
											</p>
										)}
										<p>
											Available Seats:{' '}
											{ride.availableSeats}
										</p>
										{ride.distanceFromUser && (
											<p>
												Distance:{' '}
												{ride.distanceFromUser.toFixed(
													1
												)}{' '}
												km
											</p>
										)}
										<p>
											Fare: ₹{ride.pricePerSeat} per seat
										</p>
									</div>

									<Button
										className="w-full"
										onClick={() =>
											onJoinRide(ride.id, ride)
										}
									>
										Book Now
									</Button>
								</CollapsibleContent>
							</Collapsible>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default ChooseRide;
