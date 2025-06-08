import React from 'react';

const ReviewCard = ({ review }) => {
	// Format the timestamp as a readable date
	const formattedDate = new Date(review.timestamp * 1000).toLocaleString(
		undefined,
		{
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		}
	);

	// Handle verification status (in a real app, you would verify against blockchain)
	const isVerified = true; // Placeholder - would actually check blockchain

	return (
		<div className="review-card">
			<div className="review-header">
				<span className="driver-id">Driver: {review.driver_id}</span>
				<div className="rating-container">
					<span className="rating">
						{'★'.repeat(review.rating)}
						{'☆'.repeat(5 - review.rating)}
					</span>
					<span className="rating-number">{review.rating}/5</span>
				</div>
			</div>

			<blockquote className="review-comment">
				"{review.comment}"
			</blockquote>

			<div className="review-footer">
				<div className="review-timestamp">
					<span className="timestamp-icon">🕒</span> {formattedDate}
				</div>

				<div className="verification-status">
					{isVerified ? (
						<div className="verified">
							<span className="verified-icon">✓</span> Verified on
							Blockchain
							{review.transaction && (
								<a
									href={`https://explorer.solana.com/tx/${review.transaction}?cluster=devnet`}
									target="_blank"
									rel="noopener noreferrer"
									className="explorer-link"
								>
									View Transaction
								</a>
							)}
						</div>
					) : (
						<div className="unverified">Pending Verification</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ReviewCard;
