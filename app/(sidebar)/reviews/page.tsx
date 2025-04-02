import type { Metadata } from 'next';
import ReviewsList from './review-list';
export default function ReviewsPage() {
	return (
		<div className="container mx-auto py-8 px-4">
			<h1 className="text-3xl font-bold mb-6">Reviews</h1>
			<ReviewsList />
		</div>
	);
}
