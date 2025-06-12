import React, { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useReviewProgram } from './hooks/useReviewProgram';
import { RideAccount } from './lib/types/review';
import { ReviewForm } from './review-form';

interface RideReviewSectionProps {
	rideId: string;
	onReviewSubmitted?: () => void;
}

export const RideReviewSection: React.FC<RideReviewSectionProps> = ({
	rideId,
	onReviewSubmitted,
}) => {
	const [ride, setRide] = useState<RideAccount | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const { publicKey } = useWallet();
	const { fetchRideAccount } = useReviewProgram();

	useEffect(() => {
		const loadRide = async () => {
			try {
				setLoading(true);
				const rideData = await fetchRideAccount(rideId);
				setRide(rideData);
			} catch (err) {
				setError(
					err instanceof Error ? err.message : 'Failed to load ride'
				);
			} finally {
				setLoading(false);
			}
		};

		if (rideId) {
			loadRide();
		}
	}, [rideId, fetchRideAccount]);

	const handleReviewSuccess = () => {
		setSuccessMessage('Review submitted successfully!');
		onReviewSubmitted?.();
		setTimeout(() => setSuccessMessage(null), 5000);
	};

	const handleReviewError = (errorMsg: string) => {
		setError(errorMsg);
		setTimeout(() => setError(null), 5000);
	};

	if (loading) {
		return <div className="text-center py-4">Loading ride details...</div>;
	}

	if (!ride) {
		return (
			<div className="text-red-600 text-center py-4">Ride not found</div>
		);
	}

	if (!publicKey) {
		return (
			<div className="text-center py-4">
				Please connect your wallet to leave a review
			</div>
		);
	}

	if (ride.status !== 'completed') {
		return (
			<div className="text-center py-4 text-gray-600">
				Reviews can only be submitted after the ride is completed
			</div>
		);
	}

	const userPublicKeyStr = publicKey.toString();
	const isDriver = ride.driver === userPublicKeyStr;
	const isPassenger = ride.passengers.includes(userPublicKeyStr);

	if (!isDriver && !isPassenger) {
		return (
			<div className="text-center py-4 text-gray-600">
				Only ride participants can leave reviews
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{successMessage && (
				<div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
					{successMessage}
				</div>
			)}

			{error && (
				<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
					{error}
				</div>
			)}

			<div className="rounded-lg p-4">
				<h3 className="font-semibold mb-2">Ride Details</h3>
				<p>
					<strong>From:</strong> {ride.startLocation}
				</p>
				<p>
					<strong>To:</strong> {ride.endLocation}
				</p>
				<p>
					<strong>Date:</strong>{' '}
					{new Date(ride.departureTime * 1000).toLocaleDateString()}
				</p>
				<p>
					<strong>Status:</strong> {ride.status}
				</p>
			</div>

			{isPassenger && (
				<ReviewForm
					rideId={rideId}
					reviewType="DriverReview"
					onSuccess={handleReviewSuccess}
					onError={handleReviewError}
				/>
			)}

			{isDriver && ride.passengers.length > 0 && (
				<div className="space-y-4">
					<h3 className="text-lg font-semibold">Review Passengers</h3>
					{ride.passengers.map((passenger, index) => (
						<div key={passenger} className="border rounded-lg p-4">
							<p className="mb-3 text-sm text-gray-600">
								Passenger {index + 1}: {passenger.slice(0, 8)}
								...{passenger.slice(-8)}
							</p>
							<ReviewForm
								rideId={rideId}
								reviewType="PassengerReview"
								onSuccess={handleReviewSuccess}
								onError={handleReviewError}
							/>
						</div>
					))}
				</div>
			)}
		</div>
	);
};
