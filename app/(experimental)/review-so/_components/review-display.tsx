import React from 'react';
import { ReviewAccount } from './lib/types/review';

interface ReviewDisplayProps {
	review: ReviewAccount;
	showReviewer?: boolean;
}

export const ReviewDisplay: React.FC<ReviewDisplayProps> = ({
	review,
	showReviewer = true,
}) => {
	const formatDate = (timestamp: number) => {
		return new Date(timestamp * 1000).toLocaleDateString();
	};

	const renderStars = (rating: number) => {
		return (
			<div className="flex">
				{[1, 2, 3, 4, 5].map((star) => (
					<span
						key={star}
						className={`text-lg ${
							star <= rating ? 'text-yellow-400' : 'text-gray-300'
						}`}
					>
						★
					</span>
				))}
			</div>
		);
	};

	return (
		<div className="border rounded-lg p-4 space-y-3">
			<div className="flex justify-between items-start">
				<div className="flex items-center space-x-3">
					{renderStars(review.rating)}
					<span className="text-sm text-gray-600">
						{formatDate(review.createdAt)}
					</span>
					{review.isVerified && (
						<span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
							Verified
						</span>
					)}
				</div>
				<span className="text-sm text-gray-500">
					{review.reviewType === 'DriverReview'
						? 'Driver Review'
						: 'Passenger Review'}
				</span>
			</div>

			{showReviewer && (
				<p className="text-sm text-gray-600">
					By: {review.reviewer.slice(0, 8)}...
					{review.reviewer.slice(-8)}
				</p>
			)}

			<p className="text-gray-800">{review.comment}</p>

			{review.isReported && (
				<div className="bg-red-50 border border-red-200 rounded p-2">
					<p className="text-red-800 text-sm">
						⚠️ This review has been reported
						{review.reportReason && `: ${review.reportReason}`}
					</p>
				</div>
			)}
		</div>
	);
};
