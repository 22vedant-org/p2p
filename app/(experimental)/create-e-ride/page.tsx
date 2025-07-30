'use client';

import { useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { CreateRideForm } from './_components/create-ride-form';
import { RideCard } from './_components/ride-card';

export default function Home() {
	const { connected } = useWallet();
	const [escrowAddresses, setEscrowAddresses] = useState<PublicKey[]>([]);
	const [addressInput, setAddressInput] = useState('');

	const addEscrowAddress = () => {
		try {
			const pubkey = new PublicKey(addressInput);
			setEscrowAddresses([...escrowAddresses, pubkey]);
			setAddressInput('');
		} catch (err) {
			alert('Invalid public key');
		}
	};

	return (
		<div className="container mx-auto p-4">
			<header className="flex justify-between items-center mb-8">
				<h1 className="text-3xl font-bold">Ride Escrow DApp</h1>
				<WalletMultiButton />
			</header>

			{connected ? (
				<div className="space-y-8">
					<CreateRideForm />

					<div className="space-y-4">
						<h2 className="text-xl font-bold">
							View Existing Rides
						</h2>
						<div className="flex space-x-2">
							<input
								type="text"
								placeholder="Enter escrow address"
								value={addressInput}
								onChange={(e) =>
									setAddressInput(e.target.value)
								}
								className="flex-1 rounded-md border-gray-300 shadow-sm"
							/>
							<button
								onClick={addEscrowAddress}
								className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
							>
								Add Ride
							</button>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{escrowAddresses.map((address, index) => (
								<RideCard key={index} escrowAddress={address} />
							))}
						</div>
					</div>
				</div>
			) : (
				<div className="text-center py-12">
					<p className="text-gray-600 mb-4">
						Please connect your wallet to use the app
					</p>
				</div>
			)}
		</div>
	);
}
