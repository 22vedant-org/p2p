/* eslint-disable @typescript-eslint/no-unused-expressions */
'use client';
import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Navigation, UserRound } from 'lucide-react';
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
import { useMarkerPositionsStore } from '@/hooks/store/useLocation';
import prisma from '@/lib/prisma';
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

export default function ToAndFrom() {
	const {
		markerOrigin,
		markerDestination,
		setMarkerDestination,
		setMarkerOrigin,
	} = useMarkerPositionsStore();
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

	const handleRideSearch = async () => {};

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

				<div className="grid grid-cols-2 gap-4">
					<Select defaultValue="today">
						<SelectTrigger className="h-14 border">
							<Calendar className="w-5 h-5 mr-2" />
							<SelectValue placeholder="Select date" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="today">Today</SelectItem>
							<SelectItem value="tomorrow">Tomorrow</SelectItem>
						</SelectContent>
					</Select>

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
			</div>

			<Button
				className="w-full h-14 text-lg font-semibold rounded-lg"
				onClick={handleRideSearch}
			>
				See prices
			</Button>
		</div>
	);
}
