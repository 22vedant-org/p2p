'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { RideReviewSection } from '../../_components/ride-review-section';

export default function RideReviewPage() {
	const params = useParams();
	const rideId = params.rideId as string;

	if (!rideId) {
		return <div>Invalid ride ID</div>;
	}

	return (
		<div className="max-w-2xl mx-auto p-4">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">Leave a Review</h1>
				{/* <WalletMultiButton /> */}
			</div>

			<RideReviewSection
				rideId={rideId}
				onReviewSubmitted={() => {
					// Optionally redirect or show success message
					console.log('Review submitted successfully');
				}}
			/>
		</div>
	);
}
