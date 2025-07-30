'use client';
import React, { useState, useEffect } from 'react';
import { BN } from '@coral-xyz/anchor';
import {
	useEscrowProgram,
	RideEscrowAccount,
	EscrowError,
} from '@/app/(experimental)/escrow/_components/hooks/useEscrowProgram';
import {
	CheckCircle,
	Clock,
	AlertCircle,
	Loader2,
	Car,
	Users,
} from 'lucide-react';
import { PublicKey } from '@solana/web3.js';
// PublicKey
interface CompleteRideProps {
	rideId?: string;
	onSuccess?: (transactionId: string) => void;
	onError?: (error: string) => void;
}

const CompleteRide: React.FC<CompleteRideProps> = ({
	rideId: propRideId,
	onSuccess,
	onError,
}) => {
	const [rideId, setRideId] = useState(propRideId || '');
	const [isLoading, setIsLoading] = useState(false);
	const [escrowAccount, setEscrowAccount] =
		useState<RideEscrowAccount | null>(null);
	const [error, setError] = useState<string>('');
	const [success, setSuccess] = useState<string>('');
	const [isLoadingEscrow, setIsLoadingEscrow] = useState(false);

	const {
		completeRide,
		fetchEscrowAccount,
		isConnected,
		walletAddress,
		getWalletBalance,
	} = useEscrowProgram();

	const [walletBalance, setWalletBalance] = useState(0);

	// Fetch wallet balance
	useEffect(() => {
		const fetchBalance = async () => {
			const balance = await getWalletBalance();
			setWalletBalance(balance);
		};

		if (isConnected) {
			fetchBalance();
		}
	}, [isConnected, getWalletBalance]);

	// Fetch escrow account when rideId changes
	useEffect(() => {
		const fetchEscrow = async () => {
			if (!rideId || !isConnected || !walletAddress) return;

			setIsLoadingEscrow(true);
			setError('');

			try {
				const rideIdBN = new BN(rideId);
				const account = await fetchEscrowAccount(
					new PublicKey(walletAddress),
					rideIdBN
				);
				setEscrowAccount(account);

				if (!account) {
					setError('Ride not found. Please check the ride ID.');
				}
			} catch (err) {
				console.error('Error fetching escrow:', err);
				setError('Failed to fetch ride details.');
			} finally {
				setIsLoadingEscrow(false);
			}
		};

		fetchEscrow();
	}, [rideId, isConnected, walletAddress, fetchEscrowAccount]);

	const handleCompleteRide = async () => {
		if (!rideId || !isConnected) return;

		setIsLoading(true);
		setError('');
		setSuccess('');

		try {
			const rideIdBN = new BN(rideId);
			const transactionId = await completeRide(rideIdBN);

			setSuccess(
				`Ride completed successfully! Transaction: ${transactionId}`
			);
			onSuccess?.(transactionId);

			// Refresh escrow account
			const updatedAccount = await fetchEscrowAccount(
				new PublicKey(walletAddress!),
				rideIdBN
			);
			setEscrowAccount(updatedAccount);
		} catch (err) {
			console.error('Complete ride error:', err);

			let errorMessage = 'Failed to complete ride. Please try again.';

			if (err instanceof EscrowError) {
				switch (err.code) {
					case 'WALLET_NOT_CONNECTED':
						errorMessage = 'Please connect your wallet first.';
						break;
					case 'COMPLETE_RIDE_FAILED':
						errorMessage =
							'Unable to complete ride. Please check if you are the driver.';
						break;
					default:
						errorMessage = err.message;
				}
			}

			setError(errorMessage);
			onError?.(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	const canCompleteRide = () => {
		return (
			escrowAccount &&
			!escrowAccount.isCompleted &&
			escrowAccount.riders.length > 0 &&
			isConnected
		);
	};

	const formatSOL = (lamports: BN | number) => {
		const value =
			typeof lamports === 'number' ? lamports : lamports.toNumber();
		return (value / 1e9).toFixed(4);
	};

	if (!isConnected) {
		return (
			<div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
				<div className="text-center">
					<AlertCircle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
					<h3 className="text-lg font-semibold text-gray-900 mb-2">
						Wallet Not Connected
					</h3>
					<p className="text-gray-600">
						Please connect your Solana wallet to complete rides.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
			<div className="mb-6">
				<h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
					<Car className="mr-3 h-6 w-6 text-blue-600" />
					Complete Ride
				</h2>
				<p className="text-gray-600">
					Complete your ride and distribute payments to riders
				</p>
			</div>

			{/* Wallet Info */}
			<div className="mb-6 p-4 bg-gray-50 rounded-lg">
				<div className="flex justify-between items-center">
					<span className="text-sm text-gray-600">
						Wallet Balance:
					</span>
					<span className="font-semibold text-gray-900">
						{walletBalance.toFixed(4)} SOL
					</span>
				</div>
				<div className="flex justify-between items-center mt-2">
					<span className="text-sm text-gray-600">Address:</span>
					<span className="text-xs font-mono text-gray-700">
						{walletAddress?.slice(0, 8)}...
						{walletAddress?.slice(-8)}
					</span>
				</div>
			</div>

			{/* Ride ID Input */}
			{!propRideId && (
				<div className="mb-6">
					<label
						htmlFor="rideId"
						className="block text-sm font-medium text-gray-700 mb-2"
					>
						Ride ID
					</label>
					<input
						type="text"
						id="rideId"
						value={rideId}
						onChange={(e) => setRideId(e.target.value)}
						placeholder="Enter your ride ID"
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					/>
				</div>
			)}

			{/* Escrow Account Details */}
			{isLoadingEscrow && (
				<div className="mb-6 p-4 bg-blue-50 rounded-lg flex items-center">
					<Loader2 className="animate-spin h-5 w-5 text-blue-500 mr-3" />
					<span className="text-blue-700">
						Loading ride details...
					</span>
				</div>
			)}

			{escrowAccount && (
				<div className="mb-6 p-4 bg-gray-50 rounded-lg">
					<h3 className="font-semibold text-gray-900 mb-3 flex items-center">
						<Users className="mr-2 h-5 w-5 text-gray-600" />
						Ride Details
					</h3>
					<div className="space-y-2 text-sm">
						<div className="flex justify-between">
							<span className="text-gray-600">Status:</span>
							<span
								className={`font-semibold ${
									escrowAccount.isCompleted
										? 'text-green-600'
										: 'text-yellow-600'
								}`}
							>
								{escrowAccount.isCompleted
									? 'Completed'
									: 'Active'}
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-600">
								Riders Joined:
							</span>
							<span className="font-semibold text-gray-900">
								{escrowAccount.riders.length}/4
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-600">
								Price per Seat:
							</span>
							<span className="font-semibold text-gray-900">
								{formatSOL(escrowAccount.perSeatPrice)} SOL
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-600">
								Driver Security Deposit:
							</span>
							<span className="font-semibold text-gray-900">
								{formatSOL(escrowAccount.driverSecurityDeposit)}{' '}
								SOL
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-600">
								Total Escrow Value:
							</span>
							<span className="font-semibold text-green-600">
								{formatSOL(
									escrowAccount.perSeatPrice.toNumber() *
										escrowAccount.riders.length +
										escrowAccount.driverSecurityDeposit.toNumber() +
										escrowAccount.riderSecurityDeposit.toNumber() *
											escrowAccount.riders.length
								)}{' '}
								SOL
							</span>
						</div>
					</div>
				</div>
			)}

			{/* Status Messages */}
			{error && (
				<div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
					<AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
					<div>
						<h4 className="text-red-800 font-semibold">Error</h4>
						<p className="text-red-700 text-sm">{error}</p>
					</div>
				</div>
			)}

			{success && (
				<div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
					<CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
					<div>
						<h4 className="text-green-800 font-semibold">
							Success!
						</h4>
						<p className="text-green-700 text-sm">{success}</p>
					</div>
				</div>
			)}

			{/* Completion Warnings */}
			{escrowAccount && escrowAccount.riders.length === 0 && (
				<div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start">
					<Clock className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
					<div>
						<h4 className="text-yellow-800 font-semibold">
							No Riders Yet
						</h4>
						<p className="text-yellow-700 text-sm">
							You cannot complete a ride with no riders. Wait for
							riders to join before completing.
						</p>
					</div>
				</div>
			)}

			{escrowAccount && escrowAccount.isCompleted && (
				<div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
					<CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
					<div>
						<h4 className="text-green-800 font-semibold">
							Ride Already Completed
						</h4>
						<p className="text-green-700 text-sm">
							This ride has already been completed and payments
							have been distributed.
						</p>
					</div>
				</div>
			)}

			{/* Complete Ride Button */}
			<button
				onClick={handleCompleteRide}
				disabled={!canCompleteRide() || isLoading || isLoadingEscrow}
				className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center transition-colors ${
					canCompleteRide() && !isLoading && !isLoadingEscrow
						? 'bg-green-600 hover:bg-green-700 text-white'
						: 'bg-gray-300 text-gray-500 cursor-not-allowed'
				}`}
			>
				{isLoading ? (
					<>
						<Loader2 className="animate-spin h-5 w-5 mr-2" />
						Completing Ride...
					</>
				) : (
					<>
						<CheckCircle className="h-5 w-5 mr-2" />
						Complete Ride
					</>
				)}
			</button>

			{/* Help Text */}
			<div className="mt-4 text-xs text-gray-500">
				<p>
					• Only the driver can complete a ride
					<br />
					• At least one rider must have joined
					<br />
					• Completing will distribute payments and return security
					deposits
					<br />• This action cannot be undone
				</p>
			</div>
		</div>
	);
};

export default CompleteRide;
