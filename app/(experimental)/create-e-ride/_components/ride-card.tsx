import { useState, useEffect } from 'react';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRideEscrow } from './hooks/useEscrow';
import { RideEscrow } from './lib/ride-escrow';

interface Props {
	escrowAddress: PublicKey;
}

export function RideCard({ escrowAddress }: Props) {
	const [escrow, setEscrow] = useState<RideEscrow | null>(null);
	const { publicKey } = useWallet();
	const {
		fetchEscrow,
		joinRide,
		completeRide,
		returnRiderSecurity,
		cancelRide,
		loading,
	} = useRideEscrow();

	useEffect(() => {
		const loadEscrow = async () => {
			const data = await fetchEscrow(escrowAddress);
			setEscrow(data);
		};
		loadEscrow();
	}, [escrowAddress, fetchEscrow]);

	if (!escrow) {
		return <div>Loading...</div>;
	}

	const isDriver = publicKey?.equals(escrow.driver);
	const isRider = publicKey
		? escrow.riders.some((rider) => rider.equals(publicKey))
		: false;

	const handleJoinRide = async () => {
		try {
			await joinRide(escrowAddress);
			// Refresh escrow data
			const data = await fetchEscrow(escrowAddress);
			setEscrow(data);
			alert('Successfully joined ride!');
		} catch (err) {
			console.error('Error joining ride:', err);
		}
	};

	const handleCompleteRide = async () => {
		try {
			await completeRide(escrowAddress);
			const data = await fetchEscrow(escrowAddress);
			setEscrow(data);
			alert('Ride completed!');
		} catch (err) {
			console.error('Error completing ride:', err);
		}
	};

	const handleReturnSecurity = async () => {
		try {
			await returnRiderSecurity(escrowAddress);
			const data = await fetchEscrow(escrowAddress);
			setEscrow(data);
			alert('Security deposit returned!');
		} catch (err) {
			console.error('Error returning security:', err);
		}
	};

	const handleCancelRide = async () => {
		try {
			await cancelRide(escrowAddress);
			const data = await fetchEscrow(escrowAddress);
			setEscrow(data);
			alert('Ride cancelled!');
		} catch (err) {
			console.error('Error cancelling ride:', err);
		}
	};

	return (
		<div className="border rounded-lg p-4 space-y-3">
			<h3 className="text-lg font-semibold">
				Ride #{escrow.rideId.toString()}
			</h3>

			<div className="text-sm space-y-1">
				<p>
					<strong>Driver:</strong> {escrow.driver.toString()}
				</p>
				<p>
					<strong>Per Seat Price:</strong>{' '}
					{(
						escrow.perSeatPrice.toNumber() / LAMPORTS_PER_SOL
					).toFixed(3)}{' '}
					SOL
				</p>
				<p>
					<strong>Riders:</strong> {escrow.riders.length}/4
				</p>
				<p>
					<strong>Status:</strong>{' '}
					{escrow.isCompleted ? 'Completed' : 'Active'}
				</p>
			</div>

			<div className="space-y-2">
				{!escrow.isCompleted &&
					!isDriver &&
					!isRider &&
					escrow.riders.length < 4 && (
						<button
							onClick={handleJoinRide}
							disabled={loading}
							className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
						>
							Join Ride
						</button>
					)}

				{isDriver && !escrow.isCompleted && (
					<div className="space-y-2">
						<button
							onClick={handleCompleteRide}
							disabled={loading}
							className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
						>
							Complete Ride
						</button>
						<button
							onClick={handleCancelRide}
							disabled={loading}
							className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 disabled:opacity-50"
						>
							Cancel Ride
						</button>
					</div>
				)}

				{isRider && escrow.isCompleted && (
					<button
						onClick={handleReturnSecurity}
						disabled={loading}
						className="w-full bg-yellow-600 text-white py-2 px-4 rounded hover:bg-yellow-700 disabled:opacity-50"
					>
						Claim Security Deposit
					</button>
				)}
			</div>
		</div>
	);
}
