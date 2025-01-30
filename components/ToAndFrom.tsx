'use client';
import React, { useEffect, useState } from 'react';
import {
	Car,
	Package,
	Calendar,
	Clock,
	Navigation,
	Circle,
	Square,
	Search,
} from 'lucide-react';
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
	const [pickupQuery, setPickupQuery] = useState('');
	const [dropoffQuery, setDropoffQuery] = useState('');
	const [geocodeResults, setGeocodeResults] = useState<GeocodeResult[]>([]);
	const [loading, setLoading] = useState(false);
	const [selected, setSelected] = useState<Location | null>(null);

	const forwardGeocoding = async (searchQuery: string) => {
		if (!searchQuery) {
			setGeocodeResults([]);
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

			setGeocodeResults(response.data.geocodingResults || []);
		} catch (error) {
			console.error('Geocoding error:', error);
			setGeocodeResults([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			if (query) {
				forwardGeocoding(query);
			}
		}, 500);

		return () => clearTimeout(timeoutId);
	}, [query]);
	const handlePickUpLocation = (result: GeocodeResult) => {
		const location: Location = {
			name: result.formatted_address,
			address: result.formatted_address,
			latitude: result.geometry.location.lat,
			longitude: result.geometry.location.lng,
			placeId: result.place_id,
		};

		setSelected(location);
		setQuery(location.name);
		setGeocodeResults([]);
	};
	const handleDropoffLocation = (result: GeocodeResult) => {
		const location: Location = {
			name: result.formatted_address,
			address: result.formatted_address,
			latitude: result.geometry.location.lat,
			longitude: result.geometry.location.lng,
			placeId: result.place_id,
		};

		setSelected(location);
		setQuery(location.name);
		setGeocodeResults([]);
	};
	return (
		<div className="max-w-xl mx-auto p-6 space-y-8">
			<div className="text-4xl font-bold tracking-tight">
				Commute Smart, Share the Ride.
			</div>
			<div className="space-y-4">
				<div className="relative">
					{/* <div className="absolute left-4 top-0 bottom-0 flex flex-col items-center justify-between py-[1.125rem]">
						<Circle className="w-3 h-3 fill-current" />
						<div className="w-0.5 h-full bg-gray-200 my-1" />
						<Square className="w-3 h-3 fill-current" />
					</div> */}

					<div className="space-y-4">
						<div className="relative">
							<Input
								placeholder="Pickup location"
								className="pl-12 pr-12 h-14 bg-gray-100 border-0 text-black"
								value={query}
								onChange={(e) => setQuery(e.target.value)}
							/>
							<Navigation className="w-5 h-5 absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
						</div>
						{loading && (
							<div className="absolute w-full mt-1 p-2 bg-white border rounded-md shadow-lg">
								Loading...
							</div>
						)}

						{geocodeResults.length > 0 && (
							<ul className="absolute w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto z-50">
								{geocodeResults.map((result, index) => (
									<li
										key={result.place_id || index}
										onClick={() =>
											handlePickUpLocation(result)
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
								))}
							</ul>
						)}
						<Input
							placeholder="Dropoff location"
							className="pl-12 pr-4 h-14 bg-gray-100 border-0"
						/>
					</div>
				</div>
				{loading && (
					<div className="absolute w-full mt-1 p-2 bg-white border rounded-md shadow-lg">
						Loading...
					</div>
				)}

				{geocodeResults.length > 0 && (
					<ul className="absolute w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto z-50">
						{geocodeResults.map((result, index) => (
							<li
								key={result.place_id || index}
								onClick={() => handleDropoffLocation(result)}
								className="p-2 hover:bg-gray-100 cursor-pointer"
							>
								<div className="font-medium text-black">
									{result.formatted_address}
								</div>
								<div className="text-sm text-gray-600">
									{result.address_components
										.map((component) => component.long_name)
										.join(', ')}
								</div>
							</li>
						))}
					</ul>
				)}

				<div className="grid grid-cols-2 gap-4">
					<Select defaultValue="today">
						<SelectTrigger className="h-14 bg-gray-100 border-0 text-black">
							<Calendar className="w-5 h-5 mr-2" />
							<SelectValue placeholder="Select date" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="today">Today</SelectItem>
							<SelectItem value="tomorrow">Tomorrow</SelectItem>
						</SelectContent>
					</Select>

					<Select defaultValue="now">
						<SelectTrigger className="h-14 bg-gray-100 border-0">
							<Clock className="w-5 h-5 mr-2" />
							<SelectValue placeholder="Select time" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem className="text-black" value="now">
								Now
							</SelectItem>
							<SelectItem value="later">
								Schedule for later
							</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<Button className="w-full h-14 text-lg font-semibold rounded-lg">
				See prices
			</Button>
		</div>
	);
}
