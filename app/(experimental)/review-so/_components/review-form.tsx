import React, { useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { useReviewProgram } from './hooks/useReviewProgram';

interface ReviewFormProps {
	rideId: string;
	reviewType: 'DriverReview' | 'PassengerReview';
	onSuccess?: () => void;
	onError?: (error: string) => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
	rideId,
	reviewType,
	onSuccess,
	onError,
}) => {
	const [rating, setRating] = useState(5);
	const [comment, setComment] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { submitReview } = useReviewProgram();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (comment.length > 500) {
			onError?.('Comment is too long (max 500 characters)');
			return;
		}

		setIsSubmitting(true);
		try {
			await submitReview(rideId, rating, comment, reviewType);
			onSuccess?.();
			setRating(5);
			setComment('');
		} catch (error) {
			onError?.(
				error instanceof Error
					? error.message
					: 'Failed to submit review'
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="space-y-4 p-4 border rounded-lg"
		>
			<h3 className="text-lg font-semibold">
				Leave a Review for{' '}
				{reviewType === 'DriverReview' ? 'Driver' : 'Passenger'}
			</h3>

			<div>
				<label className="block text-sm font-medium mb-2">Rating</label>
				<div className="flex space-x-1">
					{[1, 2, 3, 4, 5].map((star) => (
						<button
							key={star}
							type="button"
							onClick={() => setRating(star)}
							className={`text-2xl ${
								star <= rating
									? 'text-yellow-400'
									: 'text-gray-300'
							} hover:text-yellow-400 transition-colors`}
						>
							★
						</button>
					))}
				</div>
			</div>

			<div>
				<label
					htmlFor="comment"
					className="block text-sm font-medium mb-2"
				>
					Comment
				</label>
				<textarea
					id="comment"
					value={comment}
					onChange={(e) => setComment(e.target.value)}
					rows={4}
					maxLength={500}
					className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
					placeholder="Share your experience..."
					required
				/>
				<p className="text-sm text-gray-500 mt-1">
					{comment.length}/500 characters
				</p>
			</div>

			<button
				type="submit"
				disabled={isSubmitting || !comment.trim()}
				className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
			>
				{isSubmitting ? 'Submitting...' : 'Submit Review'}
			</button>
		</form>
	);
};
