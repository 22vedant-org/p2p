import React, { useEffect, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { useReviewProgram } from './hooks/useReviewProgram';
import { ReviewAccount } from './lib/types/review';
import { ReviewDisplay } from './review-display';

interface UserReviewsProps {
	userPublicKey: string;
}

export const UserReviews: React.FC<UserReviewsProps> = ({ userPublicKey }) => {
	const [reviews, setReviews] = useState<ReviewAccount[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { fetchUserReviews } = useReviewProgram();

	useEffect(() => {
		const loadReviews = async () => {
			try {
				setLoading(true);
				const userKey = new PublicKey(userPublicKey);
				const userReviews = await fetchUserReviews(userKey);
				setReviews(userReviews);
			} catch (err) {
				setError(
					err instanceof Error
						? err.message
						: 'Failed to load reviews'
				);
			} finally {
				setLoading(false);
			}
		};

		if (userPublicKey) {
			loadReviews();
		}
	}, [userPublicKey, fetchUserReviews]);

	if (loading) {
		return <div className="text-center py-4">Loading reviews...</div>;
	}

	if (error) {
		return (
			<div className="text-red-600 text-center py-4">Error: {error}</div>
		);
	}

	if (reviews.length === 0) {
		return (
			<div className="text-gray-500 text-center py-4">
				No reviews found
			</div>
		);
	}

	const averageRating =
		reviews.reduce((sum, review) => sum + review.rating, 0) /
		reviews.length;

	return (
		<div className="space-y-4">
			<div className="bg-gray-50 rounded-lg p-4">
				<h3 className="text-lg font-semibold mb-2">Review Summary</h3>
				<div className="flex items-center space-x-4">
					<div className="flex items-center space-x-2">
						<span className="text-2xl">★</span>
						<span className="font-medium">
							{averageRating.toFixed(1)}
						</span>
					</div>
					<span className="text-gray-600">
						({reviews.length} reviews)
					</span>
				</div>
			</div>

			<div className="space-y-3">
				{reviews.map((review, index) => (
					<ReviewDisplay
						key={`${review.rideId}-${review.reviewer}-${index}`}
						review={review}
						showReviewer={false}
					/>
				))}
			</div>
		</div>
	);
};
