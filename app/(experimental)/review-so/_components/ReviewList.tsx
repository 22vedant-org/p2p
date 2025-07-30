'use client';

import { useEffect, useState } from 'react';
import { useReviewProgram, ReviewAccount } from './hooks/useReviewProgram'; // Adjust the import path as needed

export const ReviewList = () => {
	const { fetchAllReviews, program } = useReviewProgram();
	// const {fetchUserReviews, program} = useReviewProgram()
	const [reviews, setReviews] = useState<ReviewAccount[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const getReviews = async () => {
			if (program) {
				setIsLoading(true);
				const fetchedReviews = await fetchAllReviews();
				setReviews(fetchedReviews);
				setIsLoading(false);
			}
		};

		getReviews();
	}, [program, fetchAllReviews]);

	if (isLoading) {
		return <div>Loading reviews...</div>;
	}

	if (reviews.length === 0) {
		return <div>No reviews found.</div>;
	}

	return (
		<div>
			<h2 style={{ fontSize: '24px', marginBottom: '16px' }}>
				All Reviews
			</h2>
			<div style={{ display: 'grid', gap: '16px' }}>
				{reviews.map((review, index) => (
					<div
						key={index}
						style={{
							border: '1px solid #ccc',
							padding: '16px',
							borderRadius: '8px',
						}}
					>
						<p>
							<strong>Ride ID:</strong> {review.rideId}
						</p>
						<p>
							<strong>Reviewer:</strong> {review.reviewer}
						</p>
						<p>
							<strong>Reviewee:</strong> {review.reviewee}
						</p>
						<p>
							<strong>Rating:</strong> {review.rating} / 5
						</p>
						<p>
							<strong>Comment:</strong> {review.comment}
						</p>
						<p>
							<strong>Review Type:</strong> {review.reviewType}
						</p>
					</div>
				))}
			</div>
		</div>
	);
};
