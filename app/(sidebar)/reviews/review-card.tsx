'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
	ChevronDown,
	ChevronUp,
	MessageSquare,
	ThumbsUp,
	VerifiedIcon,
} from 'lucide-react';

type ReviewProps = {
	review: {
		id: number;
		user: {
			name: string;
			avatar: string;
			verified?: boolean;
		};
		rating: number;
		title: string;
		content: string;
		date: string;
		likes: number;
		comments: {
			id: number;
			user: {
				name: string;
				avatar: string;
			};
			content: string;
			date: string;
		}[];
	};
};

function formatDate(dateString: string): string {
	const date = new Date(dateString);
	const now = new Date();
	const diffTime = Math.abs(now.getTime() - date.getTime());
	const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

	if (diffDays === 0) {
		return 'today';
	} else if (diffDays === 1) {
		return 'yesterday';
	} else if (diffDays < 7) {
		return `${diffDays} days ago`;
	} else if (diffDays < 30) {
		return `${Math.floor(diffDays / 7)} weeks ago`;
	} else {
		return `${Math.floor(diffDays / 30)} months ago`;
	}
}

export default function ReviewCard({ review }: ReviewProps) {
	const [liked, setLiked] = useState(false);
	const [likesCount, setLikesCount] = useState(review.likes);
	const [showComments, setShowComments] = useState(false);
	const [newComment, setNewComment] = useState('');
	const [comments, setComments] = useState(review.comments);

	const handleLike = () => {
		if (liked) {
			setLikesCount(likesCount - 1);
		} else {
			setLikesCount(likesCount + 1);
		}
		setLiked(!liked);
	};

	const handleAddComment = () => {
		if (newComment.trim()) {
			const comment = {
				id: Date.now(),
				user: {
					name: 'You',
					avatar: '/placeholder.svg?height=32&width=32',
				},
				content: newComment,
				date: new Date().toISOString().split('T')[0],
			};
			setComments([...comments, comment]);
			setNewComment('');
		}
	};

	// Generate stars based on rating
	const renderStars = () => {
		const stars = [];
		for (let i = 0; i < 5; i++) {
			stars.push(
				<svg
					key={i}
					className={`h-5 w-5 ${
						i < review.rating ? 'text-yellow-400' : 'text-gray-300'
					}`}
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
				</svg>
			);
		}
		return stars;
	};

	return (
		<Card>
			<CardHeader className="flex flex-row items-start gap-4 pb-2">
				<Avatar className="h-10 w-10 border">
					<AvatarImage
						src={review.user.avatar}
						alt={review.user.name}
					/>
					<AvatarFallback>
						{review.user.name.charAt(0)}
					</AvatarFallback>
				</Avatar>
				<div className="grid gap-1">
					<div className="flex items-center gap-2">
						<span className="font-semibold">
							{review.user.name}
						</span>
						{review.user.verified && (
							<Badge
								variant="outline"
								className="flex items-center gap-1 text-xs"
							>
								<VerifiedIcon className="h-3 w-3" />
								Verified User
							</Badge>
						)}
					</div>
					<div className="flex items-center gap-2">
						<div className="flex">{renderStars()}</div>
						<span className="text-sm text-muted-foreground">
							{formatDate(review.date)}
						</span>
					</div>
				</div>
			</CardHeader>
			<CardContent className="pb-3">
				<h3 className="text-lg font-semibold mb-2">{review.title}</h3>
				<p className="text-muted-foreground">{review.content}</p>
			</CardContent>
			<CardFooter className="flex flex-col items-start pt-0">
				<div className="flex items-center gap-4 w-full">
					<Button
						variant="ghost"
						size="sm"
						className={`flex items-center gap-1 ${
							liked ? 'text-primary' : ''
						}`}
						onClick={handleLike}
					>
						<ThumbsUp className="h-4 w-4" />
						<span>{likesCount}</span>
					</Button>
					<Button
						variant="ghost"
						size="sm"
						className="flex items-center gap-1"
						onClick={() => setShowComments(!showComments)}
					>
						<MessageSquare className="h-4 w-4" />
						<span>{comments.length}</span>
						{showComments ? (
							<ChevronUp className="h-4 w-4 ml-1" />
						) : (
							<ChevronDown className="h-4 w-4 ml-1" />
						)}
					</Button>
				</div>

				{showComments && (
					<div className="w-full mt-4">
						<Separator className="my-4" />
						<div className="space-y-4">
							{comments.map((comment) => (
								<div key={comment.id} className="flex gap-3">
									<Avatar className="h-8 w-8">
										<AvatarImage
											src={comment.user.avatar}
											alt={comment.user.name}
										/>
										<AvatarFallback>
											{comment.user.name.charAt(0)}
										</AvatarFallback>
									</Avatar>
									<div className="grid gap-1">
										<div className="flex items-center gap-2">
											<span className="text-sm font-medium">
												{comment.user.name}
											</span>
											<span className="text-xs text-muted-foreground">
												{formatDate(comment.date)}
											</span>
										</div>
										<p className="text-sm">
											{comment.content}
										</p>
									</div>
								</div>
							))}

							<div className="flex gap-3 mt-4">
								<Avatar className="h-8 w-8">
									<AvatarImage
										src="/placeholder.svg?height=32&width=32"
										alt="Your avatar"
									/>
									<AvatarFallback>Y</AvatarFallback>
								</Avatar>
								<div className="grid gap-2 flex-1">
									<Textarea
										placeholder="Add a comment..."
										value={newComment}
										onChange={(e) =>
											setNewComment(e.target.value)
										}
										className="min-h-[80px]"
									/>
									<div className="flex justify-end">
										<Button
											size="sm"
											onClick={handleAddComment}
										>
											Post Comment
										</Button>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</CardFooter>
		</Card>
	);
}
