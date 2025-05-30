/* eslint-disable @typescript-eslint/no-unused-expressions */
'use client';
import React, { useEffect, useState } from 'react';
import { IndianRupee, Navigation, UserRound } from 'lucide-react';
import Solana from '@/components/icon/solana';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { useMarkerPositionsStore } from '@/hooks/store/useLocation';
import { DateTimePicker24hForm } from './pick-date-time';
import { Textarea } from '@/components/ui/textarea';
import { authClient } from '@/lib/auth-client';
import { DatePicker } from './pick-date';
import { usePlaceStore } from '@/hooks/store/usePlace';
import { useDateTimeStore } from '@/hooks/store/useDateTime';
import { usePolyLineStore } from '@/hooks/store/usePolyLineCoords';

interface Location {
	name: string;
	address: string;
	latitude: number;
	longitude: number;
	placeId: string;
}

interface GeocodeResult {
	name: string;
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

export default function ToFrom() {
	const { toast } = useToast();
	const { data } = authClient.useSession();
	const session = data;
	const {
		markerOrigin,
		markerDestination,
		setMarkerDestination,
		setMarkerOrigin,
	} = useMarkerPositionsStore();
	const { polyCords } = usePolyLineStore();
	const { locationAName, locationBName } = usePlaceStore();
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
	const [seats, setSeats] = useState('1');
	const [rideDetails, setRideDetails] = useState('');
	const [initialDeposit, setInitialDeposit] = useState(0.0);
	const { date } = useDateTimeStore();
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
			name: result.name,
			address: result.formatted_address,
			latitude: result.geometry.location.lat,
			longitude: result.geometry.location.lng,
			placeId: result.place_id,
		};

		if (inputType === 'pickup') {
			setSelectedPickup(location);
			setPickupQuery(location.name);
			setMarkerOrigin({
				lng: location.longitude,
				lat: location.latitude,
			});
			setPickupGeocodeResults([]);
			setActiveInput(null);
		} else {
			setSelectedDropoff(location);
			setDropoffQuery(location.name);
			setMarkerDestination({
				lng: location.longitude,
				lat: location.latitude,
			});
			setDropoffGeocodeResults([]);
			setActiveInput(null);
		}
	};

	const onCreateRide = async () => {
		try {
			const response = await axios.post('/api/create-ride', {
				rideMarkerOrigin: pickupQuery || locationAName,
				rideMarkerDestination: dropoffQuery || locationBName,
				departureTime: date,
				availableSeats: seats,
				// pricePerSeat: 10,
				initialDeposit: initialDeposit,
				driverId: session?.user.id,
				rideBio: rideDetails,
				polyLineCoords: polyCords,
			});

			if (response.status == 201) {
				toast({
					title: 'Ride Created Successfully',
					description: 'Your ride has been added to the platform.',
					variant: 'default',
				});
			}
		} catch (error) {
			toast({
				title: 'Ride Creation Failed',
				description:
					'There was an error creating your ride. Please try again.',
				variant: 'destructive',
			});
		}
	};

	return (
		<div className="max-w-xl mx-auto p-6 space-y-8 overflow-y-scroll">
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
								value={pickupQuery || locationAName}
								onChange={(e) => {
									setPickupQuery(e.target.value);
									setActiveInput('pickup');
								}}
								onFocus={() => setActiveInput('pickup')}
							/>
							<Navigation className="w-5 h-5 absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
						</div>
						{activeInput === 'pickup' && loading && (
							<div className="absolute w-full mt-1 p-2 bg-white border rounded-md shadow-lg">
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
							value={dropoffQuery || locationBName}
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
											</li>
										)
									)}
								</ul>
							)}
					</div>
				</div>

				<div className="grid grid-cols-2 gap-4">
					{/* <Select defaultValue="today">
						<SelectTrigger className="h-14 bg-gray-100 border-0 text-black">
							<Calendar className="w-5 h-5 mr-2" />
							<SelectValue placeholder="Select date" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="today">Today</SelectItem>
							<SelectItem value="tomorrow">Tomorrow</SelectItem>
						</SelectContent>
					</Select> */}
					{/* <DateTimePicker24hForm /> */}
					<DatePicker />

					<Select
						defaultValue="1"
						onValueChange={setSeats}
						value={seats}
					>
						<SelectTrigger className="h-14 border">
							<UserRound className="w-5 h-5 mr-2" />
							<SelectValue placeholder="Number of Passengers" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="1">1</SelectItem>
							<SelectItem value="2">2</SelectItem>
							<SelectItem value="3">3</SelectItem>
							<SelectItem value="4">4</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className="grid grid-cols-2 gap-4">
					<Input
						placeholder="Initial Deposit"
						className="h-14 pl-12 pr-12"
						onChange={(e) =>
							setInitialDeposit(parseFloat(e.target.value))
						}
					/>
					<Select defaultValue="SOL">
						<SelectTrigger className="h-14 border">
							<IndianRupee className="w-5 h-5 mr-2" />

							<SelectValue placeholder="Security Deposit" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="SOL">SOL</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<Textarea
					placeholder="Write details related to the ride."
					onChange={(e) => {
						setRideDetails(e.target.value);
					}}
					value={rideDetails}
				/>
			</div>

			<Button
				className="w-full h-14 text-lg font-semibold rounded-lg"
				onClick={onCreateRide}
			>
				Create Ride
			</Button>
			{/* <p>{pickupQuery}</p> */}
		</div>
	);
}
