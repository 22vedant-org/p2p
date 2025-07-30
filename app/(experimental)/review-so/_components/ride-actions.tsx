'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useReviewProgram } from '../_components/hooks/useReviewProgram';

interface RideAccount {
	rideId: string;
	driver: string;
	maxPassengers: number;
	currentPassengers: number;
	pricePerSeat: number;
	startLocation: string;
	endLocation: string;
	departureTime: number;
	status: 'active' | 'completed' | 'cancelled';
	createdAt: number;
	completedAt?: number;
	passengers: string[];
}

interface RideActionsProps {
	rideId: string;
	onRideUpdate?: (ride: RideAccount | null) => void;
}

export const RideActions: React.FC<RideActionsProps> = ({
	rideId,
	onRideUpdate,
}) => {
	const { publicKey, connected } = useWallet();
	const reviewProgram = useReviewProgram();

	// State management
	const [ride, setRide] = useState<RideAccount | null>(null);
	const [isInitialLoading, setIsInitialLoading] = useState(true);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [isJoining, setIsJoining] = useState(false);
	const [isCompleting, setIsCompleting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Stable reference for the load function
	const loadRideData = useCallback(async () => {
		if (!rideId || !reviewProgram.fetchRideAccount) {
			return;
		}

		try {
			setError(null);

			if (ride) {
				setIsRefreshing(true);
			}

			const rideData = await reviewProgram.fetchRideAccount(rideId);

			setRide(rideData);

			if (onRideUpdate) {
				onRideUpdate(rideData);
			}
		} catch (err) {
			console.error('Error loading ride:', err);
			setError('Failed to load ride data');
		} finally {
			setIsInitialLoading(false);
			setIsRefreshing(false);
		}
	}, [rideId, reviewProgram.fetchRideAccount, onRideUpdate, ride]);

	// Load ride data on component mount
	useEffect(() => {
		loadRideData();
	}, [rideId, reviewProgram.fetchRideAccount]);

	// Memoized computed values
	const computedValues = useMemo(() => {
		if (!ride || !publicKey) {
			return {
				isDriver: false,
				isPassenger: false,
				isRideFull: false,
				isRideActive: false,
				departureDate: null,
			};
		}

		return {
			isDriver: publicKey.toString() === ride.driver,
			isPassenger: ride.passengers.includes(publicKey.toString()),
			isRideFull: ride.currentPassengers >= ride.maxPassengers,
			isRideActive: ride.status === 'active',
			departureDate: new Date(ride.departureTime * 1000),
		};
	}, [ride, publicKey]);

	const handleJoinRide = async () => {
		if (!connected || !publicKey || !ride) {
			setError('Please connect your wallet first');
			return;
		}

		try {
			setIsJoining(true);
			setError(null);

			const tx = await reviewProgram.joinRide(rideId);
			console.log('Join ride transaction:', tx);

			// Refresh ride data
			await loadRideData();
		} catch (err: any) {
			console.error('Error joining ride:', err);

			let errorMessage = 'Failed to join ride';

			if (err.message) {
				if (err.message.includes('RideFull')) {
					errorMessage = 'This ride is already full';
				} else if (err.message.includes('AlreadyJoined')) {
					errorMessage = 'You have already joined this ride';
				} else if (err.message.includes('DriverCannotJoin')) {
					errorMessage = 'Drivers cannot join their own rides';
				} else if (err.message.includes('RideNotActive')) {
					errorMessage = 'This ride is no longer active';
				} else {
					errorMessage = err.message;
				}
			}

			setError(errorMessage);
		} finally {
			setIsJoining(false);
		}
	};

	const handleCompleteRide = async () => {
		if (!connected || !publicKey || !ride) {
			setError('Please connect your wallet first');
			return;
		}

		try {
			setIsCompleting(true);
			setError(null);

			const tx = await reviewProgram.completeRide(rideId);
			console.log('Complete ride transaction:', tx);

			// Refresh ride data
			await loadRideData();
		} catch (err: any) {
			console.error('Error completing ride:', err);

			let errorMessage = 'Failed to complete ride';

			if (err.message) {
				if (err.message.includes('UnauthorizedDriver')) {
					errorMessage = 'Only the driver can complete this ride';
				} else if (err.message.includes('RideNotActive')) {
					errorMessage = 'This ride is not active';
				} else {
					errorMessage = err.message;
				}
			}

			setError(errorMessage);
		} finally {
			setIsCompleting(false);
		}
	};

	// Loading state
	if (isInitialLoading) {
		return (
			<div className="bg-white rounded-lg shadow-md p-6">
				<div className="flex items-center justify-center p-8">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
					<span className="ml-2">Loading ride...</span>
				</div>
			</div>
		);
	}

	// Error state
	if (!ride && !isInitialLoading) {
		return (
			<div className="bg-white rounded-lg shadow-md p-6">
				<div className="text-red-500 p-4 text-center">
					{error || 'Ride not found or failed to load'}
				</div>
			</div>
		);
	}

	// Don't render if no ride data
	if (!ride) {
		return null;
	}

	const { isDriver, isPassenger, isRideFull, isRideActive, departureDate } =
		computedValues;

	return (
		<div className="rounded-lg shadow-md p-6">
			{/* Ride Information */}
			<div className="mb-6">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-2xl font-bold">Ride Details</h2>
					{isRefreshing && (
						<div className="flex items-center text-sm text-gray-500">
							<div className="animate-spin rounded-full h-3 w-3 border-b border-gray-400 mr-2"></div>
							Updating...
						</div>
					)}
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<p className="text-sm text-gray-600">From</p>
						<p className="font-semibold">{ride.startLocation}</p>
					</div>
					<div>
						<p className="text-sm text-gray-600">To</p>
						<p className="font-semibold">{ride.endLocation}</p>
					</div>
					<div>
						<p className="text-sm text-gray-600">Departure</p>
						<p className="font-semibold">
							{departureDate
								? departureDate.toLocaleString()
								: 'Invalid Date'}
						</p>
					</div>
					<div>
						<p className="text-sm text-gray-600">Price per seat</p>
						<p className="font-semibold">
							{(ride.pricePerSeat / 1e9).toFixed(4)} SOL
						</p>
					</div>
					<div>
						<p className="text-sm text-gray-600">Passengers</p>
						<p className="font-semibold">
							{ride.currentPassengers} / {ride.maxPassengers}
						</p>
					</div>
					<div>
						<p className="text-sm text-gray-600">Status</p>
						<span
							className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
								ride.status === 'active'
									? 'bg-green-100 text-green-800'
									: ride.status === 'completed'
									? 'bg-blue-100 text-blue-800'
									: 'bg-red-100 text-red-800'
							}`}
						>
							{ride.status.toUpperCase()}
						</span>
					</div>
				</div>
			</div>

			{/* Error Display */}
			{error && (
				<div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
					{error}
				</div>
			)}

			{/* Action Buttons */}
			<div className="space-y-3">
				{!connected && (
					<p className="text-yellow-600 text-center">
						Please connect your wallet to interact with this ride
					</p>
				)}

				{connected && isDriver && isRideActive && (
					<button
						onClick={handleCompleteRide}
						disabled={isCompleting}
						className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors"
					>
						{isCompleting ? (
							<span className="flex items-center justify-center">
								<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
								Completing Ride...
							</span>
						) : (
							'Complete Ride'
						)}
					</button>
				)}

				{connected && !isDriver && !isPassenger && isRideActive && (
					<button
						onClick={handleJoinRide}
						disabled={isJoining || isRideFull}
						className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors"
					>
						{isJoining ? (
							<span className="flex items-center justify-center">
								<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
								Joining Ride...
							</span>
						) : isRideFull ? (
							'Ride is Full'
						) : (
							`Join Ride (${(ride.pricePerSeat / 1e9).toFixed(
								4
							)} SOL)`
						)}
					</button>
				)}

				{connected && isPassenger && isRideActive && (
					<div className="text-center p-3 bg-blue-100 text-blue-800 rounded-lg">
						✅ You have joined this ride
					</div>
				)}

				{ride.status === 'completed' && (
					<div className="text-center p-3 bg-green-100 text-green-800 rounded-lg">
						🎉 This ride has been completed
					</div>
				)}

				{ride.status === 'cancelled' && (
					<div className="text-center p-3 bg-red-100 text-red-800 rounded-lg">
						❌ This ride has been cancelled
					</div>
				)}
			</div>

			{/* Driver Info */}
			<div className="mt-6 pt-4 border-t">
				<p className="text-sm text-gray-600">Driver</p>
				<p className="font-mono text-sm break-all">{ride.driver}</p>
				{isDriver && (
					<span className="inline-block mt-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
						You are the driver
					</span>
				)}
			</div>

			{/* Passengers List */}
			{ride.passengers && ride.passengers.length > 0 && (
				<div className="mt-4">
					<p className="text-sm text-gray-600 mb-2">Passengers</p>
					<div className="space-y-1">
						{ride.passengers.map((passenger, index) => (
							<div
								key={`${passenger}-${index}`}
								className="flex items-center justify-between"
							>
								<span className="font-mono text-xs break-all">
									{passenger}
								</span>
								{passenger === publicKey?.toString() && (
									<span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
										You
									</span>
								)}
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};
