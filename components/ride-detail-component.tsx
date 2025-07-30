import React, { useState, useEffect } from 'react';
import { useRideEscrow } from './../hooks/useEscrow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
	Loader2,
	MapPin,
	Clock,
	Users,
	Car,
	User,
	AlertCircle,
	CheckCircle,
} from 'lucide-react';

interface RideDetailComponentProps {
	rideIds: string[];
	onJoinRide?: (rideId: string, seats: number) => void;
}

const RideDetailComponent: React.FC<RideDetailComponentProps> = ({
	rideIds,
	onJoinRide,
}) => {
	const [seats, setSeats] = useState(1);
	const [rideDetailsMap, setRideDetailsMap] = useState<Record<string, any>>(
		{}
	);
	const [escrowDetailsMap, setEscrowDetailsMap] = useState<
		Record<string, any>
	>({});
	const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
		{}
	);
	const [joiningStates, setJoiningStates] = useState<Record<string, boolean>>(
		{}
	);

	const {
		fetchRideDetails,
		joinRideWithEscrow,
		validateRideForBlockchain,
		getEscrowDetails,
	} = useRideEscrow();

	// Fetch ride details for all ride IDs
	useEffect(() => {
		const fetchAllRideDetails = async () => {
			const newLoadingStates = {};
			rideIds.forEach((rideId) => {
				newLoadingStates[rideId] = true;
			});
			setLoadingStates(newLoadingStates);

			const rideDetailsPromises = rideIds.map(async (rideId) => {
				try {
					const rideDetail = await fetchRideDetails(rideId, false);
					return { rideId, rideDetail };
				} catch (error) {
					console.error(
						`Failed to fetch ride details for ${rideId}:`,
						error
					);
					return { rideId, rideDetail: null };
				}
			});

			const results = await Promise.all(rideDetailsPromises);

			const newRideDetailsMap = {};
			const newLoadingStates2 = {};

			results.forEach(({ rideId, rideDetail }) => {
				newRideDetailsMap[rideId] = rideDetail;
				newLoadingStates2[rideId] = false;
			});

			setRideDetailsMap(newRideDetailsMap);
			setLoadingStates(newLoadingStates2);
		};

		if (rideIds.length > 0) {
			fetchAllRideDetails();
		}
	}, [rideIds, fetchRideDetails]);

	// Fetch escrow details when ride details are loaded
	useEffect(() => {
		const fetchEscrowInfo = async () => {
			const escrowPromises = Object.entries(rideDetailsMap).map(
				async ([rideId, rideDetail]) => {
					if (rideDetail?.driverPublicKey && rideDetail?.rideId) {
						try {
							const escrow = await getEscrowDetails(
								rideDetail.driverPublicKey,
								rideDetail.rideId
							);
							return { rideId, escrow };
						} catch (error) {
							console.error(
								`Failed to fetch escrow details for ${rideId}:`,
								error
							);
							return { rideId, escrow: null };
						}
					}
					return { rideId, escrow: null };
				}
			);

			const escrowResults = await Promise.all(escrowPromises);
			const newEscrowDetailsMap = {};

			escrowResults.forEach(({ rideId, escrow }) => {
				newEscrowDetailsMap[rideId] = escrow;
			});

			setEscrowDetailsMap(newEscrowDetailsMap);
		};

		if (Object.keys(rideDetailsMap).length > 0) {
			fetchEscrowInfo();
		}
	}, [rideDetailsMap, getEscrowDetails]);

	// Handle joining a specific ride
	const handleJoinRide = async (rideId: string) => {
		const rideDetail = rideDetailsMap[rideId];
		if (!rideDetail) return;

		setJoiningStates((prev) => ({ ...prev, [rideId]: true }));

		try {
			await joinRideWithEscrow(rideDetail.id, seats);
			if (onJoinRide) {
				onJoinRide(rideId, seats);
			}
		} catch (error) {
			console.error('Failed to join ride:', error);
		} finally {
			setJoiningStates((prev) => ({ ...prev, [rideId]: false }));
		}
	};

	const formatTime = (dateString: string) => {
		return new Date(dateString).toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: '2-digit',
			hour12: true,
		});
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		});
	};

	const getStatusColor = (status: string) => {
		switch (status?.toLowerCase()) {
			case 'available':
				return 'bg-green-100 text-green-800';
			case 'full':
				return 'bg-red-100 text-red-800';
			case 'cancelled':
				return 'bg-gray-100 text-gray-800';
			case 'completed':
				return 'bg-blue-100 text-blue-800';
			default:
				return 'bg-yellow-100 text-yellow-800';
		}
	};

	return (
		<div className="max-w-4xl mx-auto p-6 space-y-6">
			{/* <div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">Available Rides</h1>
				<div className="flex items-center gap-4">
					<label className="text-sm font-medium">Seats needed:</label>
					<Input
						type="number"
						min="1"
						max="4"
						value={seats}
						onChange={(e) =>
							setSeats(parseInt(e.target.value) || 1)
						}
						className="w-20"
					/>
				</div>
			</div> */}

			{rideIds.length === 0 ? (
				<Card>
					<CardContent className="text-center py-8">
						<p className="text-gray-500">
							No rides available at the moment.
						</p>
					</CardContent>
				</Card>
			) : (
				<div className="space-y-4">
					{rideIds.map((rideId) => {
						const rideDetail = rideDetailsMap[rideId];
						const escrowDetail = escrowDetailsMap[rideId];
						const isLoading = loadingStates[rideId];
						const isJoining = joiningStates[rideId];
						const validation = rideDetail
							? validateRideForBlockchain(rideDetail)
							: null;

						return (
							<Card key={rideId} className="w-full">
								{isLoading ? (
									<CardContent className="flex items-center justify-center py-8">
										<Loader2 className="w-6 h-6 animate-spin mr-2" />
										<span>Loading ride details...</span>
									</CardContent>
								) : !rideDetail ? (
									<CardContent className="text-center py-8">
										<p className="text-red-500">
											Failed to load ride details for ID:{' '}
											{rideId}
										</p>
									</CardContent>
								) : (
									<>
										<CardHeader>
											<div className="flex justify-between items-start">
												<div>
													<CardTitle className="text-lg">
														{
															rideDetail.startLocation
														}{' '}
														→{' '}
														{rideDetail.endLocation}
													</CardTitle>
													<p className="text-sm text-gray-500 mt-1">
														ID: {rideDetail.id}
													</p>
												</div>
												<div className="text-right">
													<Badge
														className={getStatusColor(
															rideDetail.status
														)}
													>
														{rideDetail.status}
													</Badge>
													{validation && (
														<div className="mt-2">
															{validation.isValid ? (
																<Badge className="bg-green-100 text-green-800">
																	<CheckCircle className="w-3 h-3 mr-1" />
																	Blockchain
																	Ready
																</Badge>
															) : (
																<Badge className="bg-red-100 text-red-800">
																	<AlertCircle className="w-3 h-3 mr-1" />
																	Blockchain
																	Issues
																</Badge>
															)}
														</div>
													)}
												</div>
											</div>
										</CardHeader>
										<CardContent className="space-y-4">
											{/* Route and Schedule */}
											<div className="grid md:grid-cols-2 gap-4">
												<div className="space-y-2">
													<div className="flex items-center gap-2">
														<Clock className="w-4 h-4 text-blue-600" />
														<span className="text-sm">
															{formatDate(
																rideDetail.departureTime
															)}{' '}
															at{' '}
															{formatTime(
																rideDetail.departureTime
															)}
														</span>
													</div>
													<div className="flex items-center gap-2">
														<User className="w-4 h-4 text-gray-600" />
														<span className="text-sm">
															{
																rideDetail
																	.driver.name
															}
														</span>
													</div>
												</div>
												<div className="space-y-2">
													<div className="flex items-center gap-2">
														<Users className="w-4 h-4 text-green-600" />
														<span className="text-sm">
															{
																rideDetail.availableSeats
															}{' '}
															seats available
														</span>
													</div>
													<div className="flex space-x-2">
														<div className="text-lg font-bold text-green-600">
															₹
														</div>
														<div>
															{
																rideDetail.pricePerSeat
															}{' '}
															per seat
														</div>
													</div>
												</div>
											</div>

											{/* Vehicle Info */}
											{(rideDetail.vehicleModel ||
												rideDetail.vehicleType) && (
												<div className="flex items-center gap-2 text-sm text-gray-600">
													<Car className="w-4 h-4" />
													<span>
														{rideDetail.vehicleModel ||
															rideDetail.vehicleType}
														{rideDetail.vehicleColor &&
															` - ${rideDetail.vehicleColor}`}
														{rideDetail.licensePlate &&
															` (${rideDetail.licensePlate})`}
													</span>
												</div>
											)}

											{/* Blockchain Issues */}
											{validation &&
												!validation.isValid && (
													<div className="p-3 bg-red-50 border border-red-200 rounded text-sm">
														<p className="text-red-800 font-medium mb-1">
															Issues:
														</p>
														<ul className="text-red-700 space-y-1">
															{validation.errors.map(
																(
																	error,
																	index
																) => (
																	<li
																		key={
																			index
																		}
																	>
																		•{' '}
																		{error}
																	</li>
																)
															)}
														</ul>
													</div>
												)}

											{/* Join Ride Button */}
											{rideDetail.status.toLowerCase() ===
												'available' &&
												rideDetail.availableSeats >=
													seats && (
													<div className="flex justify-between items-center pt-4 border-t">
														<div className="text-sm text-gray-600">
															Total: ₹
															{rideDetail.pricePerSeat *
																seats}{' '}
															for {seats} seat(s)
														</div>
														<Button
															onClick={() =>
																handleJoinRide(
																	rideId
																)
															}
															disabled={
																isJoining ||
																!validation?.isValid
															}
															className="px-6"
														>
															{isJoining && (
																<Loader2 className="w-4 h-4 mr-2 animate-spin" />
															)}
															{isJoining
																? 'Joining...'
																: 'Join Ride'}
														</Button>
													</div>
												)}
										</CardContent>
									</>
								)}
							</Card>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default RideDetailComponent;
