'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import {
	ConnectionProvider,
	WalletProvider,
} from '@solana/wallet-adapter-react';
import {
	WalletModalProvider,
	WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';
import {
	PhantomWalletAdapter,
	SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { RideActions } from '../../_components/ride-actions';
import Link from 'next/link';

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

// Configure wallets

// You can change this to 'mainnet-beta' for production
const network = clusterApiUrl('devnet');

export default function RidePage() {
	const params = useParams();
	const rideId = params?.rideId as string;
	const [currentRide, setCurrentRide] = useState<RideAccount | null>(null);

	const handleRideUpdate = (ride: RideAccount | null) => {
		setCurrentRide(ride);
	};

	if (!rideId) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-red-500 text-xl">Invalid ride ID</div>
			</div>
		);
	}

	return (
		<ConnectionProvider endpoint={network}>
			<div className="min-h-screen">
				{/* Header */}
				<header className="shadow-sm">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex justify-between items-center py-4">
							<div>
								<h1 className="text-2xl font-bold">
									Carpooling App
								</h1>
								<p className="text-sm text-gray-500">
									Ride ID: {rideId}
								</p>
							</div>
							{/* <WalletMultiButton className="!bg-blue-500 hover:!bg-blue-600" /> */}
						</div>
					</div>
				</header>

				{/* Main content */}
				<main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div className="space-y-6">
						{/* Navigation breadcrumb */}
						<nav className="flex" aria-label="Breadcrumb">
							<ol className="flex items-center space-x-4">
								<li>
									<Link
										href="/"
										className="text-blue-500 hover:text-blue-700"
									>
										Home
									</Link>
								</li>
								<li>
									<span className="text-gray-500">/</span>
								</li>
								<li>
									<span className="text-gray-500">
										Ride {rideId}
									</span>
								</li>
							</ol>
						</nav>

						{/* Ride Actions Component */}
						<RideActions
							rideId={rideId}
							onRideUpdate={handleRideUpdate}
						/>

						{/* Additional Information */}
						<div className=" rounded-lg shadow-md p-6">
							<h3 className="text-lg font-semibold mb-4">
								How it works
							</h3>
							<div className="space-y-3 text-sm text-gray-600">
								<div className="flex items-start space-x-2">
									<span className="text-blue-500 font-bold">
										1.
									</span>
									<p>
										Connect your Solana wallet to interact
										with the ride
									</p>
								</div>
								<div className="flex items-start space-x-2">
									<span className="text-blue-500 font-bold">
										2.
									</span>
									<p>
										Join the ride by clicking &quot;Join
										Ride&quot; if you&apos;re a passenger
									</p>
								</div>
								<div className="flex items-start space-x-2">
									<span className="text-blue-500 font-bold">
										3.
									</span>
									<p>
										The driver can complete the ride when
										the journey is finished
									</p>
								</div>
								<div className="flex items-start space-x-2">
									<span className="text-blue-500 font-bold">
										4.
									</span>
									<p>
										After completion, participants can leave
										reviews for each other
									</p>
								</div>
							</div>
						</div>

						{/* Transaction Info */}
						<div className=" border border-yellow-200 rounded-lg p-4">
							<div className="flex items-start space-x-2">
								<span className="text-yellow-500 text-xl">
									⚠️
								</span>
								<div>
									<p className="text-yellow-800 font-semibold">
										Transaction Fees
									</p>
									<p className="text-yellow-700 text-sm">
										All transactions on Solana require a
										small fee (typically ~0.00025 SOL). Make
										sure you have enough SOL in your wallet
										for transaction fees.
									</p>
								</div>
							</div>
						</div>

						{/* Debug Info (remove in production) */}
						{process.env.NODE_ENV === 'development' &&
							currentRide && (
								<div className="border rounded-lg p-4">
									<h4 className="font-semibold mb-2">
										Debug Info
									</h4>
									<pre className="text-xs overflow-auto">
										{JSON.stringify(currentRide, null, 2)}
									</pre>
								</div>
							)}
					</div>
				</main>
			</div>
		</ConnectionProvider>
	);
}
