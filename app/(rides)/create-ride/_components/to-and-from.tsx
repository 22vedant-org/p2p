/* eslint-disable @typescript-eslint/no-unused-expressions */
'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRideMarkerPositionStore } from '@/hooks/store/useRideLocation';
import { Navigation, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { DatePicker } from './pick-date';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
import { useMarkerPositionsStore } from '@/hooks/store/useLocation';

interface Location {
	name: string;
	address: string;
	latitude: number;
	longitude: number;
	placeId: string;
}

interface GeocodeResult {
	formatted_address: string;
	place_id: string;
	geometry: {
		location: {
			lat: number;
			lng: number;
		};
	};
	address_components: {
		long_name: string;
		short_name: string;
		types: string[];
	}[];
}

interface rideDataProps {
	rideMarkerOrigin: string;
	startLocationCoord: [number, number];
	rideMarkerDestination: string;
	endLocationCoord: [number, number];
	departureTime: string;
	availableSeats: number;
	pricePerSeat: number;
}
async function createRide(rideData: rideDataProps, userId: string | undefined) {
	if (!userId) {
		toast('You must sign-in before trying to create a ride');
		return;
	}

	try {
		const response = await axios.post('/api/create-ride', {
			rideMarkerOrigin: rideData.rideMarkerOrigin,
			startLocationCoord: rideData.startLocationCoord,
			rideMarkerDestination: rideData.rideMarkerDestination,
			endLocationCoord: rideData.endLocationCoord,
			departureTime: rideData.departureTime,
			availableSeats: rideData.availableSeats,
			pricePerSeat: rideData.pricePerSeat,
			driverId: userId,
		});

		if (!response) {
			throw new Error('Ride Creation Failed');
		}
		// const newRide = await response.json();
		// return newRide;
		toast('Ride is successfully created');
	} catch (error) {
		toast('Ride creation failed miserably!! 🤣🤣');
		console.error(error);
	}
}

// async function getCreateRide(user: User) {
// 		const ridedata = {
// 			rideMarkerOrigin: ,
// 			rideMarkerDestination,
// 			departureTime: new Date(),
// 			availableSeats: 3,
// 			pricePerSeat: 40.9,
// 			driver: {
// 				connect: {id: user.id}
// 			}
// 		};

// 		try {
// 			const rides = await createRide(ridedata);
// 		} catch (error) {
// 			console.error(error);
// 		}
// 	}

export default function ToAndFrom() {
	const {
		rideMarkerOrigin,
		rideMarkerDestination,
		setRideMarkerDestination,
		setRideMarkerOrigin,
	} = useRideMarkerPositionStore();
	const {
		markerOrigin,
		markerDestination,
		setMarkerDestination,
		setMarkerOrigin,
	} = useMarkerPositionsStore();
	const { data } = authClient.useSession();
	const session = data;
	const [pickupQuery, setPickupQuery] = useState('');
	const [dropoffQuery, setDropoffQuery] = useState('');
	const [pickupGeocodeResults, setPickupGeocodeResults] = useState<
		GeocodeResult[]
	>([]);
	const [dropoffGeocodeResults, setDropoffGeocodeResults] = useState<
		GeocodeResult[]
	>([]);
	const [loading, setLoading] = useState(false);
	const [selectedPickup, setSelectedPickup] = useState<Location | null>(null);
	const [selectedDropoff, setSelectedDropoff] = useState<Location | null>(
		null
	);
	const [activeInput, setActiveInput] = useState<'pickup' | 'dropoff' | null>(
		null
	);

	const forwardGeocoding = async (
		searchQuery: string,
		inputType: 'pickup' | 'dropoff'
	) => {
		if (!searchQuery) {
			inputType === 'pickup'
				? setPickupGeocodeResults([])
				: setDropoffGeocodeResults([]);
			return;
		}

		setLoading(true);
		try {
			const response = await axios.get(
				'https://api.olamaps.io/places/v1/geocode',
				{
					params: {
						api_key: process.env.NEXT_PUBLIC_OLA_API_KEY,
						address: searchQuery,
					},
				}
			);

			if (inputType === 'pickup') {
				setPickupGeocodeResults(response.data.geocodingResults || []);
			} else {
				setDropoffGeocodeResults(response.data.geocodingResults || []);
			}
		} catch (error) {
			console.error('Geocoding error:', error);
			inputType === 'pickup'
				? setPickupGeocodeResults([])
				: setDropoffGeocodeResults([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const pickupTimeoutId = setTimeout(() => {
			if (pickupQuery && activeInput === 'pickup') {
				forwardGeocoding(pickupQuery, 'pickup');
			}
		}, 500);

		const dropoffTimeoutId = setTimeout(() => {
			if (dropoffQuery && activeInput === 'dropoff') {
				forwardGeocoding(dropoffQuery, 'dropoff');
			}
		}, 500);

		return () => {
			clearTimeout(pickupTimeoutId);
			clearTimeout(dropoffTimeoutId);
		};
	}, [pickupQuery, dropoffQuery, activeInput]);

	const handleSelectLocation = (
		result: GeocodeResult,
		inputType: 'pickup' | 'dropoff'
	) => {
		const location: Location = {
			name: result.formatted_address,
			address: result.formatted_address,
			latitude: result.geometry.location.lat,
			longitude: result.geometry.location.lng,
			placeId: result.place_id,
		};

		if (inputType === 'pickup') {
			setSelectedPickup(location);
			setPickupQuery(location.name);
			setRideMarkerOrigin({
				lng: location.longitude,
				lat: location.latitude,
			});
			setPickupGeocodeResults([]);
			setActiveInput(null);
		} else {
			setSelectedDropoff(location);
			setDropoffQuery(location.name);
			setRideMarkerDestination({
				lng: location.longitude,
				lat: location.latitude,
			});
			setDropoffGeocodeResults([]);
			setActiveInput(null);
		}
	};

	return (
		<div className="max-w-xl mx-auto p-6 space-y-8">
			<div className="text-4xl font-bold tracking-tight">
				Commute Smart, Share the Ride.
			</div>
			<div className="space-y-4">
				<div className="relative">
					<div className="space-y-4">
						<div className="relative">
							<Input
								placeholder="Pickup location"
								className="pl-12 pr-12 h-14 border"
								value={pickupQuery}
								onChange={(e) => {
									setPickupQuery(e.target.value);
									setActiveInput('pickup');
								}}
								onFocus={() => setActiveInput('pickup')}
							/>
							<Navigation className="w-5 h-5 absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
						</div>
						{activeInput === 'pickup' && loading && (
							<div className="absolute w-full mt-1 p-2  border rounded-md shadow-lg">
								Loading...
							</div>
						)}

						{activeInput === 'pickup' &&
							pickupGeocodeResults.length > 0 && (
								<ul className="absolute w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto z-50">
									{pickupGeocodeResults.map(
										(result, index) => (
											<li
												key={result.place_id || index}
												onClick={() =>
													handleSelectLocation(
														result,
														'pickup'
													)
												}
												className="p-2 hover:bg-gray-100 cursor-pointer"
											>
												<div className="font-medium text-black">
													{result.formatted_address}
												</div>
												<div className="text-sm text-gray-600">
													{result.address_components
														.map(
															(component) =>
																component.long_name
														)
														.join(', ')}
												</div>
											</li>
										)
									)}
								</ul>
							)}

						<Input
							placeholder="Dropoff location"
							className="pl-12 pr-4 h-14 border"
							value={dropoffQuery}
							onChange={(e) => {
								setDropoffQuery(e.target.value);
								setActiveInput('dropoff');
							}}
							onFocus={() => setActiveInput('dropoff')}
						/>
						{activeInput === 'dropoff' && loading && (
							<div className="absolute w-full mt-1 p-2 bg-white border rounded-md shadow-lg">
								Loading...
							</div>
						)}

						{activeInput === 'dropoff' &&
							dropoffGeocodeResults.length > 0 && (
								<ul className="absolute w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto z-50">
									{dropoffGeocodeResults.map(
										(result, index) => (
											<li
												key={result.place_id || index}
												onClick={() =>
													handleSelectLocation(
														result,
														'dropoff'
													)
												}
												className="p-2 hover:bg-gray-100 cursor-pointer"
											>
												<div className="font-medium text-black">
													{result.formatted_address}
												</div>
												<div className="text-sm text-gray-600">
													{result.address_components
														.map(
															(component) =>
																component.long_name
														)
														.join(', ')}
												</div>
											</li>
										)
									)}
								</ul>
							)}
					</div>
				</div>

				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<DatePicker className="h-14" />

					<Select defaultValue="1">
						<SelectTrigger className="h-14 border">
							<UserRound className="w-5 h-5 mr-2" />
							<SelectValue placeholder="number of passengers" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="1">1</SelectItem>
							<SelectItem value="2">2</SelectItem>
							<SelectItem value="3">3</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<Button
				className="w-full h-14 text-lg font-semibold rounded-lg"
				onClick={async () => {
					const rideData: rideDataProps = {
						rideMarkerOrigin:
							rideMarkerOrigin.lat.toString() +
							', ' +
							rideMarkerOrigin.lng.toString(),
						startLocationCoord: [
							markerOrigin.lng,
							markerOrigin.lat,
						],
						rideMarkerDestination:
							rideMarkerDestination.lat.toString() +
							', ' +
							rideMarkerDestination.lng.toString(),
						endLocationCoord: [
							markerDestination.lng,
							markerDestination.lat,
						],
						availableSeats: 3,
						departureTime: Date().toString(),
						pricePerSeat: 123,
					};

					try {
						const rides = await createRide(
							rideData,
							session?.user.id
						);
					} catch (error) {
						console.error('This is the error', error);
					}
				}}
			>
				Create Ride
			</Button>
		</div>
	);
}
