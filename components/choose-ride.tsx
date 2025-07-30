import React, { useState, useEffect } from 'react';
import { useRideEscrow } from './../hooks/useEscrow'; // You'll need to import this from the correct path
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

const RideDetailComponent = () => {
	const [rideId, setRideId] = useState('');
	const [seats, setSeats] = useState(1);
	const [isBlockchainRideId, setIsBlockchainRideId] = useState(false);
	// const [driverSecurityDeposit, setDriverSecurityDeposit] = useState()

	const {
		loading,
		joining,
		rideDetails,
		fetchRideDetails,
		fetchRideDetailsByGet,
		joinRideWithEscrow,
		validateRideForBlockchain,
		getEscrowDetails,
	} = useRideEscrow();

	const [escrowDetails, setEscrowDetails] = useState(null);

	// Fetch ride details when rideId changes
	const handleFetchRide = async () => {
		if (!rideId.trim()) return;

		try {
			await fetchRideDetails(rideId, isBlockchainRideId);
		} catch (error) {
			console.error('Failed to fetch ride:', error);
		}
	};

	// Fetch escrow details when ride details are loaded
	useEffect(() => {
		const fetchEscrowInfo = async () => {
			if (rideDetails?.driverPublicKey && rideDetails?.rideId) {
				try {
					const escrow = await getEscrowDetails(
						rideDetails.driverPublicKey,
						rideDetails.rideId
					);
					setEscrowDetails(escrow);
				} catch (error) {
					console.error('Failed to fetch escrow details:', error);
				}
			}
		};

		fetchEscrowInfo();
	}, [rideDetails, getEscrowDetails]);

	// Handle joining the ride
	const handleJoinRide = async () => {
		if (!rideDetails) return;

		try {
			await joinRideWithEscrow(rideDetails.id, seats);
		} catch (error) {
			console.error('Failed to join ride:', error);
		}
	};

	// Validate ride for blockchain operations
	const validation = rideDetails
		? validateRideForBlockchain(rideDetails)
		: null;

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
			<Card>
				<CardHeader>
					<CardTitle>Fetch Ride Details</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex gap-4 items-end">
						<div className="flex-1">
							<label className="block text-sm font-medium mb-2">
								Ride ID
							</label>
							<Input
								placeholder="Enter ride ID or blockchain ride ID"
								value={rideId}
								onChange={(e) => setRideId(e.target.value)}
							/>
						</div>
						<div className="flex items-center space-x-2">
							<input
								type="checkbox"
								id="blockchainId"
								checked={isBlockchainRideId}
								onChange={(e) =>
									setIsBlockchainRideId(e.target.checked)
								}
								className="rounded"
							/>
							<label htmlFor="blockchainId" className="text-sm">
								Is Blockchain ID
							</label>
						</div>
						<Button
							onClick={handleFetchRide}
							disabled={loading || !rideId.trim()}
						>
							{loading && (
								<Loader2 className="w-4 h-4 mr-2 animate-spin" />
							)}
							Fetch Ride
						</Button>
					</div>
				</CardContent>
			</Card>

			{rideDetails && (
				<Card>
					<CardHeader>
						<div className="flex justify-between items-start">
							<div>
								<CardTitle className="text-xl">
									Ride Details
								</CardTitle>
								<p className="text-sm text-gray-500 mt-1">
									ID: {rideDetails.id}
								</p>
							</div>
							<div className="text-right">
								<Badge
									className={getStatusColor(
										rideDetails.status
									)}
								>
									{rideDetails.status}
								</Badge>
								{validation && (
									<div className="mt-2">
										{validation.isValid ? (
											<Badge className="bg-green-100 text-green-800">
												<CheckCircle className="w-3 h-3 mr-1" />
												Ready for Blockchain
											</Badge>
										) : (
											<Badge className="bg-red-100 text-red-800">
												<AlertCircle className="w-3 h-3 mr-1" />
												Blockchain Issues
											</Badge>
										)}
									</div>
								)}
							</div>
						</div>
					</CardHeader>
					<CardContent className="space-y-6">
						{/* Route Information */}
						<div className="grid md:grid-cols-2 gap-6">
							<div className="space-y-4">
								<h3 className="font-semibold text-lg">Route</h3>
								<div className="space-y-3">
									<div className="flex items-start gap-3">
										<MapPin className="w-5 h-5 text-green-600 mt-0.5" />
										<div>
											<p className="font-medium">From</p>
											<p className="text-gray-600">
												{rideDetails.startLocation}
											</p>
										</div>
									</div>
									<div className="flex items-start gap-3">
										<MapPin className="w-5 h-5 text-red-600 mt-0.5" />
										<div>
											<p className="font-medium">To</p>
											<p className="text-gray-600">
												{rideDetails.endLocation}
											</p>
										</div>
									</div>
								</div>
							</div>

							<div className="space-y-4">
								<h3 className="font-semibold text-lg">
									Schedule
								</h3>
								<div className="space-y-3">
									<div className="flex items-center gap-3">
										<Clock className="w-5 h-5 text-blue-600" />
										<div>
											<p className="font-medium">
												Departure
											</p>
											<p className="text-gray-600">
												{formatDate(
													rideDetails.departureTime
												)}{' '}
												at{' '}
												{formatTime(
													rideDetails.departureTime
												)}
											</p>
										</div>
									</div>
									{rideDetails.estimatedArrivalTime && (
										<div className="flex items-center gap-3">
											<Clock className="w-5 h-5 text-purple-600" />
											<div>
												<p className="font-medium">
													Estimated Arrival
												</p>
												<p className="text-gray-600">
													{formatTime(
														rideDetails.estimatedArrivalTime
													)}
												</p>
											</div>
										</div>
									)}
								</div>
							</div>
						</div>

						{/* Driver and Vehicle Info */}
						<div className="grid md:grid-cols-2 gap-6">
							<div className="space-y-4">
								<h3 className="font-semibold text-lg">
									Driver
								</h3>
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
										<User className="w-5 h-5 text-gray-600" />
									</div>
									<div>
										<p className="font-medium">
											{rideDetails.driver.name}
										</p>
										<p className="text-sm text-gray-500 capitalize">
											{rideDetails.driver.role}
										</p>
									</div>
								</div>
							</div>

							{(rideDetails.vehicleModel ||
								rideDetails.vehicleType) && (
								<div className="space-y-4">
									<h3 className="font-semibold text-lg">
										Vehicle
									</h3>
									<div className="flex items-center gap-3">
										<Car className="w-5 h-5 text-gray-600" />
										<div>
											<p className="font-medium">
												{rideDetails.vehicleModel ||
													rideDetails.vehicleType}
											</p>
											{rideDetails.vehicleColor && (
												<p className="text-sm text-gray-500">
													{rideDetails.vehicleColor}
												</p>
											)}
											{rideDetails.licensePlate && (
												<p className="text-sm font-mono text-gray-600">
													{rideDetails.licensePlate}
												</p>
											)}
										</div>
									</div>
								</div>
							)}
						</div>

						{/* Pricing and Availability */}
						<div className="grid md:grid-cols-3 gap-6">
							<div className="text-center p-4 bg-green-50 rounded-lg">
								<p className="text-2xl font-bold text-green-600">
									₹{rideDetails.pricePerSeat}
								</p>
								<p className="text-sm text-gray-600">
									Per Seat
								</p>
							</div>
							<div className="text-center p-4 bg-blue-50 rounded-lg">
								<div className="flex items-center justify-center gap-2">
									<Users className="w-5 h-5 text-blue-600" />
									<p className="text-2xl font-bold text-blue-600">
										{rideDetails.availableSeats}
									</p>
								</div>
								<p className="text-sm text-gray-600">
									Seats Available
								</p>
							</div>
							<div className="text-center p-4 bg-purple-50 rounded-lg">
								<p className="text-lg font-bold text-purple-600">
									{rideDetails.rideRequests?.filter(
										(req) => req.status === 'accepted'
									).length || 0}
								</p>
								<p className="text-sm text-gray-600">
									Passengers Joined
								</p>
							</div>
						</div>

						{/* Blockchain Information */}
						<div className="bg-gray-50 p-4 rounded-lg">
							<h3 className="font-semibold mb-3">
								Blockchain Details
							</h3>
							<div className="grid md:grid-cols-2 gap-4 text-sm">
								<div>
									<p className="font-medium">
										Blockchain Ride ID:
									</p>
									<p className="text-gray-600 font-mono">
										{rideDetails.rideId ||
											'Not initialized'}
									</p>
								</div>
								<div>
									<p className="font-medium">
										Driver Public Key:
									</p>
									<p className="text-gray-600 font-mono text-xs break-all">
										{rideDetails.driverPublicKey ||
											'Not available'}
									</p>
								</div>
							</div>

							{validation && !validation.isValid && (
								<div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
									<p className="text-red-800 font-medium mb-2">
										Blockchain Issues:
									</p>
									<ul className="text-red-700 text-sm space-y-1">
										{validation.errors.map(
											(error, index) => (
												<li key={index}>• {error}</li>
											)
										)}
									</ul>
								</div>
							)}
						</div>

						{/* Escrow Information */}
						{escrowDetails && (
							<div className="bg-blue-50 p-4 rounded-lg">
								<h3 className="font-semibold mb-3">
									Escrow Details
								</h3>
								<div className="grid md:grid-cols-2 gap-4 text-sm">
									<div>
										<p className="font-medium">
											Security Deposit (Driver):
										</p>
										<p className="text-gray-600">
											{escrowDetails.driverSecurityDeposit?.toString()}{' '}
											lamports
										</p>
									</div>
									<div>
										<p className="font-medium">
											Security Deposit (Rider):
										</p>
										<p className="text-gray-600">
											{escrowDetails.riderSecurityDeposit?.toString()}{' '}
											lamports
										</p>
									</div>
									<div>
										<p className="font-medium">
											Completion Status:
										</p>
										<p className="text-gray-600">
											{escrowDetails.isCompleted
												? 'Completed'
												: 'Active'}
										</p>
									</div>
									<div>
										<p className="font-medium">
											Current Riders:
										</p>
										<p className="text-gray-600">
											{escrowDetails.riders?.length || 0}
										</p>
									</div>
								</div>
							</div>
						)}

						{/* Join Ride Section */}
						{rideDetails.status.toLowerCase() === 'available' &&
							rideDetails.availableSeats > 0 && (
								<div className="border-t pt-6">
									<h3 className="font-semibold text-lg mb-4">
										Join This Ride
									</h3>
									<div className="flex gap-4 items-end">
										<div>
											<label className="block text-sm font-medium mb-2">
												Number of Seats
											</label>
											<Input
												type="number"
												min="1"
												max={rideDetails.availableSeats}
												value={seats}
												onChange={(e) =>
													setSeats(
														parseInt(
															e.target.value
														) || 1
													)
												}
												className="w-24"
											/>
										</div>
										<Button
											onClick={handleJoinRide}
											disabled={
												joining || !validation?.isValid
											}
											size="lg"
											className="px-8"
										>
											{joining && (
												<Loader2 className="w-4 h-4 mr-2 animate-spin" />
											)}
											{joining
												? 'Joining...'
												: `Join Ride (₹${
														rideDetails.pricePerSeat *
														seats
												  })`}
										</Button>
									</div>
								</div>
							)}
					</CardContent>
				</Card>
			)}
		</div>
	);
};

export default RideDetailComponent;
