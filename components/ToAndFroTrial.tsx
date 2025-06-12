/* eslint-disable @typescript-eslint/no-unused-expressions */
'use client';
import { useEffect, useState } from 'react';
import { Calendar, Navigation, UserRound } from 'lucide-react';
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
import { authClient } from '@/lib/auth-client';
import { usePlaceStore } from '@/hooks/store/usePlace';
import { usePolyLineStore } from '@/hooks/store/usePolyLineCoords';
import dynamic from 'next/dynamic';

const ChooseRide = dynamic(() => import('./choose-ride'), {
	ssr: false,
	loading: () => <div className="p-6">Loading rides...</div>,
});

interface Location {
	name: string;
	address: string;
	latitude: number;
	longitude: number;
	placeId: string;
}

interface GeocodeResult {
	formatted_address: string;
	name: string;
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

interface RideSearchResult {
	success: boolean;
	rides: Ride[];
	totalRides: number;
	proximitySearch: boolean;
	radius: number;
	userLocation: any;
}

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

export default function ToAndFrom() {
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
	const [searchingRides, setSearchingRides] = useState(false);
	const [selectedPickup, setSelectedPickup] = useState<Location | null>(null);
	const [selectedDropoff, setSelectedDropoff] = useState<Location | null>(
		null
	);
	const [activeInput, setActiveInput] = useState<'pickup' | 'dropoff' | null>(
		null
	);
	const [seats, setSeats] = useState('1');
	const [selectedDate, setSelectedDate] = useState('today');
	const [rideResults, setRideResults] = useState<RideSearchResult | null>(
		null
	);
	const [expandedRides, setExpandedRides] = useState<Record<string, boolean>>(
		{}
	);
	const [showResults, setShowResults] = useState(false);

	const handleRideSearch = async () => {
		// Validate required fields
		if (!pickupQuery && !locationAName) {
			alert('Please select a pickup location');
			return;
		}

		if (!dropoffQuery && !locationBName) {
			alert('Please select a dropoff location');
			return;
		}

		setSearchingRides(true);
		try {
			const requestBody = {
				pickupQuery: pickupQuery || locationAName,
				dropoffQuery: dropoffQuery || locationBName,
				departureTime:
					selectedDate === 'today'
						? new Date().toISOString()
						: new Date(
								Date.now() + 24 * 60 * 60 * 1000
						  ).toISOString(),
				markerOrigin: markerOrigin,
				markerDestination: markerDestination,
				proximityRadius: 5, // 5km default radius
				seats: Number.parseInt(seats),
			};

			console.log('Searching rides with params:', requestBody);

			const response = await axios.post('/api/find-ride', requestBody, {
				headers: {
					'Content-Type': 'application/json',
				},
			});

			const data: RideSearchResult = response.data;
			setRideResults(data);

			console.log('Ride search results:', data);

			// You can handle the results here - maybe navigate to a results page
			// or update a global state to show the results
			if (data.success) {
				setShowResults(true);
			} else {
				alert('No rides found for your search criteria');
			}
		} catch (error) {
			console.error('Error searching for rides:', error);

			if (axios.isAxiosError(error)) {
				const errorMessage =
					error.response?.data?.error || 'Failed to search for rides';
				alert(`Error: ${errorMessage}`);
			} else {
				alert('An unexpected error occurred while searching for rides');
			}
		} finally {
			setSearchingRides(false);
		}
	};

	const toggleRideExpansion = (rideId: string) => {
		setExpandedRides((prev) => ({
			...prev,
			[rideId]: !prev[rideId],
		}));
	};

	const handleJoinRide = async (rideId: string, ride: Ride) => {
		try {
			// TODO: Implement join ride API call
			console.log('Joining ride:', rideId, 'with seats:', seats);
			alert(`Requesting to join ride to ${ride.endLocation}`);
		} catch (error) {
			console.error('Error joining ride:', error);
			alert('Failed to join ride. Please try again.');
		}
	};

	const formatTime = (dateString: string) => {
		return new Date(dateString).toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: '2-digit',
			hour12: true,
		});
	};

	const calculateDistance = (coords: number[]) => {
		if (!coords || coords.length < 2) return 'Unknown';
		// You can implement actual distance calculation here if needed
		return `${Math.round(Math.random() * 10 + 1)} km`;
	};

	const forwardGeocoding = async (
		searchQuery: string,
		inputType: 'pickup' | 'dropoff'
	) => {
		setLoading(true); // Start loading before the conditional check

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
		let pickupTimeoutId: NodeJS.Timeout | null = null;
		let dropoffTimeoutId: NodeJS.Timeout | null = null;

		if (pickupQuery && activeInput === 'pickup') {
			pickupTimeoutId = setTimeout(() => {
				forwardGeocoding(pickupQuery, 'pickup');
			}, 500);
		}

		if (dropoffQuery && activeInput === 'dropoff') {
			dropoffTimeoutId = setTimeout(() => {
				forwardGeocoding(dropoffQuery, 'dropoff');
			}, 500);
		}

		return () => {
			if (pickupTimeoutId) clearTimeout(pickupTimeoutId);
			if (dropoffTimeoutId) clearTimeout(dropoffTimeoutId);
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

	return (
		<div className="max-w-xl mx-auto space-y-8">
			{/* Search Form Section */}
			<div className="p-6 space-y-8">
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
													key={
														result.place_id || index
													}
													onClick={() =>
														handleSelectLocation(
															result,
															'pickup'
														)
													}
													className="p-2 hover:bg-gray-100 cursor-pointer"
												>
													<div className="font-medium text-black">
														{
															result.formatted_address
														}
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
													key={
														result.place_id || index
													}
													onClick={() =>
														handleSelectLocation(
															result,
															'dropoff'
														)
													}
													className="p-2 hover:bg-gray-100 cursor-pointer"
												>
													<div className="font-medium text-black">
														{
															result.formatted_address
														}
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
						<Select
							defaultValue="today"
							onValueChange={setSelectedDate}
							value={selectedDate}
						>
							<SelectTrigger className="h-14 border">
								<Calendar className="w-5 h-5 mr-2" />
								<SelectValue placeholder="Select date" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="today">Today</SelectItem>
								<SelectItem value="tomorrow">
									Tomorrow
								</SelectItem>
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
					disabled={searchingRides}
				>
					{searchingRides ? 'Searching...' : 'Find Rides'}
				</Button>
			</div>

			{/* Results Section */}
			{showResults && rideResults && rideResults.success && (
				<div className="border-t pt-6">
					<div className="flex items-center justify-between px-6 pb-4">
						<h2 className="text-2xl font-bold">Available Rides</h2>
						<Button
							variant="outline"
							onClick={() => setShowResults(false)}
							className="text-sm"
						>
							Clear Results
						</Button>
					</div>
					<ChooseRide
						rides={rideResults.rides}
						onJoinRide={handleJoinRide}
					/>
				</div>
			)}
		</div>
	);
}
