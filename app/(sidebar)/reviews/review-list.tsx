'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReviewCard from './review-card';
import { Filter, Search } from 'lucide-react';

// Mock data for reviews
const mockReviews = [
	{
		id: 1,
		user: {
			name: 'Alex Johnson',
			avatar: '/placeholder.svg?height=40&width=40',
			verified: true,
		},
		rating: 5,
		title: 'Game-changing platform',
		content:
			'This blockchain app has completely transformed how I manage my digital assets. The interface is intuitive and the transaction speeds are impressive.',
		date: '2023-12-15',
		likes: 42,
		comments: [
			{
				id: 101,
				user: {
					name: 'Maria Garcia',
					avatar: '/placeholder.svg?height=32&width=32',
				},
				content:
					'I completely agree! The gas fees are also very reasonable.',
				date: '2023-12-16',
			},
			{
				id: 102,
				user: {
					name: 'Sam Wilson',
					avatar: '/placeholder.svg?height=32&width=32',
				},
				content: 'Have you tried the new staking feature?',
				date: '2023-12-17',
			},
		],
	},
	{
		id: 2,
		user: {
			name: 'Taylor Swift',
			avatar: '/placeholder.svg?height=40&width=40',
			verified: true,
		},
		rating: 4,
		title: 'Great potential, some minor issues',
		content:
			"I've been using this app for 3 months now and I'm impressed with the security features. The only downside is occasional lag during peak hours.",
		date: '2023-12-10',
		likes: 28,
		comments: [
			{
				id: 103,
				user: {
					name: 'Chris Brown',
					avatar: '/placeholder.svg?height=32&width=32',
				},
				content:
					'I noticed the same lag issues. Hope they fix it soon!',
				date: '2023-12-11',
			},
		],
	},
	{
		id: 3,
		user: {
			name: 'David Chen',
			avatar: '/placeholder.svg?height=40&width=40',
			verified: false,
		},
		rating: 5,
		title: "Best DeFi platform I've used",
		content:
			'The yield farming options are incredible and the risk assessment tools have helped me make informed decisions. Highly recommend!',
		date: '2023-12-05',
		likes: 56,
		comments: [],
	},
	{
		id: 4,
		user: {
			name: 'Sophia Rodriguez',
			avatar: '/placeholder.svg?height=40&width=40',
			verified: true,
		},
		rating: 3,
		title: 'Good but needs more features',
		content:
			"The core functionality works well, but I'd like to see more integration with other chains and better analytics dashboards.",
		date: '2023-11-28',
		likes: 15,
		comments: [
			{
				id: 104,
				user: {
					name: 'Jake Thompson',
					avatar: '/placeholder.svg?height=32&width=32',
				},
				content:
					'The team mentioned cross-chain support is coming next quarter!',
				date: '2023-11-29',
			},
		],
	},
	{
		id: 5,
		user: {
			name: 'Michael Kim',
			avatar: '/placeholder.svg?height=40&width=40',
			verified: false,
		},
		rating: 2,
		title: 'Promising but unstable',
		content:
			'I like the concept but have experienced several crashes when trying to connect my hardware wallet. Customer support was helpful though.',
		date: '2023-11-20',
		likes: 8,
		comments: [
			{
				id: 105,
				user: {
					name: 'Support Team',
					avatar: '/placeholder.svg?height=32&width=32',
				},
				content:
					"We've released a fix for the hardware wallet issue in version 2.3.4. Please update and let us know if you still experience problems.",
				date: '2023-11-21',
			},
		],
	},
];

export default function ReviewsList() {
	const [filter, setFilter] = useState('all');
	const [sort, setSort] = useState('recent');
	const [searchQuery, setSearchQuery] = useState('');

	// Filter reviews based on current filters and search
	const filteredReviews = mockReviews
		.filter((review) => {
			if (filter === 'all') return true;
			if (filter === 'positive') return review.rating >= 4;
			if (filter === 'negative') return review.rating <= 2;
			if (filter === 'neutral') return review.rating === 3;
			if (filter === 'verified') return review.user.verified;
			return true;
		})
		.filter((review) => {
			if (!searchQuery) return true;
			return (
				review.title
					.toLowerCase()
					.includes(searchQuery.toLowerCase()) ||
				review.content
					.toLowerCase()
					.includes(searchQuery.toLowerCase()) ||
				review.user.name
					.toLowerCase()
					.includes(searchQuery.toLowerCase())
			);
		})
		.sort((a, b) => {
			if (sort === 'recent') {
				return new Date(b.date).getTime() - new Date(a.date).getTime();
			}
			if (sort === 'oldest') {
				return new Date(a.date).getTime() - new Date(b.date).getTime();
			}
			if (sort === 'highest') {
				return b.rating - a.rating;
			}
			if (sort === 'lowest') {
				return a.rating - b.rating;
			}
			if (sort === 'mostLiked') {
				return b.likes - a.likes;
			}
			return 0;
		});

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div className="relative w-full md:w-72">
					<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						type="search"
						placeholder="Search reviews..."
						className="pl-8 w-full"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
				<div className="flex flex-wrap items-center gap-2">
					<div className="flex items-center gap-2">
						<Filter className="h-4 w-4 text-muted-foreground" />
						<span className="text-sm font-medium">Filter:</span>
					</div>
					<Select value={filter} onValueChange={setFilter}>
						<SelectTrigger className="w-[130px]">
							<SelectValue placeholder="Filter reviews" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Reviews</SelectItem>
							<SelectItem value="positive">
								Positive (4-5★)
							</SelectItem>
							<SelectItem value="neutral">
								Neutral (3★)
							</SelectItem>
							<SelectItem value="negative">
								Negative (1-2★)
							</SelectItem>
							<SelectItem value="verified">
								Verified Users
							</SelectItem>
						</SelectContent>
					</Select>
					<Select value={sort} onValueChange={setSort}>
						<SelectTrigger className="w-[130px]">
							<SelectValue placeholder="Sort by" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="recent">Most Recent</SelectItem>
							<SelectItem value="oldest">Oldest First</SelectItem>
							<SelectItem value="highest">
								Highest Rated
							</SelectItem>
							<SelectItem value="lowest">Lowest Rated</SelectItem>
							<SelectItem value="mostLiked">
								Most Liked
							</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<Tabs defaultValue="all" className="w-full">
				<TabsList className="grid w-full grid-cols-4">
					<TabsTrigger value="all">All</TabsTrigger>
					<TabsTrigger value="5star">5 Star</TabsTrigger>
					<TabsTrigger value="4star">4 Star</TabsTrigger>
					<TabsTrigger value="3star">3 Star & Below</TabsTrigger>
				</TabsList>
				<TabsContent value="all" className="mt-6">
					<div className="grid gap-6">
						{filteredReviews.length > 0 ? (
							filteredReviews.map((review) => (
								<ReviewCard key={review.id} review={review} />
							))
						) : (
							<Card className="p-6 text-center">
								<p className="text-muted-foreground">
									No reviews match your criteria
								</p>
							</Card>
						)}
					</div>
				</TabsContent>
				<TabsContent value="5star" className="mt-6">
					<div className="grid gap-6">
						{filteredReviews
							.filter((review) => review.rating === 5)
							.map((review) => (
								<ReviewCard key={review.id} review={review} />
							))}
					</div>
				</TabsContent>
				<TabsContent value="4star" className="mt-6">
					<div className="grid gap-6">
						{filteredReviews
							.filter((review) => review.rating === 4)
							.map((review) => (
								<ReviewCard key={review.id} review={review} />
							))}
					</div>
				</TabsContent>
				<TabsContent value="3star" className="mt-6">
					<div className="grid gap-6">
						{filteredReviews
							.filter((review) => review.rating <= 3)
							.map((review) => (
								<ReviewCard key={review.id} review={review} />
							))}
					</div>
				</TabsContent>
			</Tabs>

			<div className="flex justify-center mt-8">
				<Button variant="outline">Load More Reviews</Button>
			</div>
		</div>
	);
}
