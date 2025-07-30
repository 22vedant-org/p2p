import { useState, useCallback } from 'react';
import { useEscrowProgram } from '../app/(experimental)/escrow/_components/hooks/useEscrowProgram';
import { BN } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import { toast } from 'sonner';
import axios from 'axios';

interface Driver {
	id: string;
	name: string;
	image?: string;
	role: string;
}

interface RideRequest {
	id: string;
	seats: number;
	status: string;
}

interface RideDetails {
	id: string;
	startLocation: string;
	endLocation: string;
	startLocationCoord: number[];
	endLocationCoord: number[];
	departureTime: string;
	estimatedArrivalTime?: string;
	availableSeats: number;
	pricePerSeat: number;
	status: string;
	vehicleType?: string;
	vehicleModel?: string;
	vehicleColor?: string;
	licensePlate?: string;
	polyLineCoords?: any[];
	rideId: string | null;
	driverPublicKey: string | null;
	driver: Driver;
	rideRequests: RideRequest[];
}

interface FetchRideResponse {
	success: boolean;
	ride: RideDetails;
}

export const useRideEscrow = () => {
	const [loading, setLoading] = useState(false);
	const [joining, setJoining] = useState(false);
	const [rideDetails, setRideDetails] = useState<RideDetails | null>(null);

	const {
		joinRide: joinEscrowRide,
		fetchEscrowAccount,
		...escrowProgram
	} = useEscrowProgram();

	// Fetch ride details from API
	const fetchRideDetails = useCallback(
		async (rideId: string, isBlockchainRideId: boolean = false) => {
			setLoading(true);
			try {
				const requestBody = isBlockchainRideId
					? { rideId } // Use blockchain rideId
					: { id: rideId }; // Use database id

				const response = await axios.post(
					'/api/fetch-ride',
					requestBody
				);
				const data: FetchRideResponse = response.data;

				if (data.success) {
					setRideDetails(data.ride);
					return data.ride;
				} else {
					throw new Error('Failed to fetch ride details');
				}
			} catch (error) {
				console.error('Error fetching ride details:', error);
				toast.error('Failed to fetch ride details');
				throw error;
			} finally {
				setLoading(false);
			}
		},
		[]
	);

	// Fetch ride details using GET method
	const fetchRideDetailsByGet = useCallback(
		async (rideId: string, isBlockchainRideId: boolean = false) => {
			setLoading(true);
			try {
				const queryParam = isBlockchainRideId
					? `rideId=${rideId}`
					: `id=${rideId}`;

				const response = await axios.get(
					`/api/fetch-ride?${queryParam}`
				);
				const data: FetchRideResponse = response.data;

				if (data.success) {
					setRideDetails(data.ride);
					return data.ride;
				} else {
					throw new Error('Failed to fetch ride details');
				}
			} catch (error) {
				console.error('Error fetching ride details:', error);
				toast.error('Failed to fetch ride details');
				throw error;
			} finally {
				setLoading(false);
			}
		},
		[]
	);

	// Join a ride with blockchain integration
	const joinRideWithEscrow = useCallback(
		async (rideId: string, seats: number = 1) => {
			setJoining(true);

			try {
				// First, fetch the latest ride details
				const ride = await fetchRideDetails(rideId);

				if (!ride) {
					throw new Error('Ride not found');
				}

				// Validate ride data
				if (!ride.driverPublicKey) {
					throw new Error(
						'Driver public key is missing. This ride cannot be joined.'
					);
				}

				if (!ride.rideId) {
					throw new Error(
						'Ride ID is missing. This ride is not properly initialized on the blockchain.'
					);
				}

				// Validate seat availability
				if (ride.availableSeats < seats) {
					throw new Error(
						`Not enough seats available. Only ${ride.availableSeats} seats left.`
					);
				}

				// Check ride status
				if (ride.status.toLowerCase() !== 'available') {
					throw new Error(
						`This ride is ${ride.status.toLowerCase()} and cannot be joined.`
					);
				}

				console.log('Joining ride with blockchain integration:', {
					rideId: ride.rideId,
					driverPublicKey: ride.driverPublicKey,
					seats,
				});

				// Convert to blockchain format
				const driverPublicKey = new PublicKey(ride.driverPublicKey);
				const rideIdBN = new BN(ride.rideId);

				// Execute blockchain transaction
				const txSignature = await joinEscrowRide(
					driverPublicKey,
					rideIdBN
				);

				console.log('Blockchain transaction successful:', txSignature);
				toast.success(
					`Successfully joined ride! Transaction: ${txSignature.slice(
						0,
						8
					)}...`
				);

				// Refresh ride details after successful join
				await fetchRideDetails(rideId);

				return {
					success: true,
					transaction: txSignature,
					ride,
				};
			} catch (error) {
				console.error('Error joining ride:', error);

				let errorMessage = 'An unknown error occurred';

				if (error instanceof Error) {
					errorMessage = error.message;
				} else if (typeof error === 'string') {
					errorMessage = error;
				}

				// Provide specific error messages
				if (errorMessage.includes('insufficient funds')) {
					toast.error(
						'Insufficient funds to join this ride. Please check your wallet balance.'
					);
				} else if (
					errorMessage.includes('Driver public key is missing')
				) {
					toast.error(
						'This ride has incomplete driver information. Please try another ride.'
					);
				} else if (errorMessage.includes('Ride ID is missing')) {
					toast.error(
						'This ride is not properly initialized on the blockchain. Please try another ride.'
					);
				} else if (errorMessage.includes('Not enough seats')) {
					toast.error(errorMessage);
				} else if (errorMessage.includes('cannot be joined')) {
					toast.error(errorMessage);
				} else {
					toast.error(`Failed to join ride: ${errorMessage}`);
				}

				throw error;
			} finally {
				setJoining(false);
			}
		},
		[fetchRideDetails, joinEscrowRide]
	);

	// Get escrow details for a ride
	const getEscrowDetails = useCallback(
		async (driverPublicKey: string, rideId: string) => {
			try {
				const driverPK = new PublicKey(driverPublicKey);
				const rideIdBN = new BN(rideId);

				const escrowAccount = await fetchEscrowAccount(
					driverPK,
					rideIdBN
				);
				return escrowAccount;
			} catch (error) {
				console.error('Error fetching escrow details:', error);
				return null;
			}
		},
		[fetchEscrowAccount]
	);

	// Validate ride for blockchain operations
	const validateRideForBlockchain = useCallback((ride: RideDetails) => {
		const validationErrors: string[] = [];

		if (!ride.driverPublicKey) {
			validationErrors.push('Driver public key is missing');
		}

		if (!ride.rideId) {
			validationErrors.push('Blockchain ride ID is missing');
		}

		if (ride.status.toLowerCase() !== 'available') {
			validationErrors.push(`Ride status is ${ride.status}`);
		}

		if (ride.availableSeats <= 0) {
			validationErrors.push('No seats available');
		}

		return {
			isValid: validationErrors.length === 0,
			errors: validationErrors,
		};
	}, []);

	return {
		// State
		loading,
		joining,
		rideDetails,

		// Actions
		fetchRideDetails,
		fetchRideDetailsByGet,
		joinRideWithEscrow,
		getEscrowDetails,
		validateRideForBlockchain,

		// Escrow program methods
		...escrowProgram,
	};
};
