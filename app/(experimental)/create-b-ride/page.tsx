// 'use client';

// import { useState, useEffect } from 'react';
// import {
// 	Card,
// 	CardContent,
// 	CardDescription,
// 	CardHeader,
// 	CardTitle,
// } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import {
// 	Select,
// 	SelectContent,
// 	SelectItem,
// 	SelectTrigger,
// 	SelectValue,
// } from '@/components/ui/select';
// import { Badge } from '@/components/ui/badge';
// import { Star, Car, MapPin, User, Calendar, MessageSquare } from 'lucide-react';
// import { toast } from '@/hooks/use-toast';
// import { useRideReviewProgram } from '@/hooks/use-reviews';
// import { useWallet } from '@solana/wallet-adapter-react';
// import type { PublicKey } from '@solana/web3.js';

// // Types
// interface RideData {
// 	rideId: string;
// 	driverName: string;
// 	route: string;
// 	vehicleType: string;
// 	totalReviews: number;
// 	averageRating: number;
// 	createdAt: number;
// }

// interface ReviewData {
// 	reviewer: PublicKey;
// 	ride: PublicKey;
// 	rating: number;
// 	comment: string;
// 	timestamp: number;
// }

// export default function RideReviewPage() {
// 	const { publicKey } = useWallet();
// 	const { createRide, submitReview, getAllRides, initializeSystem, isReady } =
// 		useRideReviewProgram();
// 	const [isInitialized, setIsInitialized] = useState(false);
// 	const [isLoading, setIsLoading] = useState({
// 		init: false,
// 		create: false,
// 		review: false,
// 		fetch: false,
// 	});

// 	// Form states
// 	const [rideForm, setRideForm] = useState({
// 		rideId: '',
// 		driverName: '',
// 		route: '',
// 		vehicleType: 'car',
// 	});

// 	const [reviewForm, setReviewForm] = useState({
// 		rideId: '',
// 		rating: 5,
// 		comment: '',
// 	});

// 	const [rides, setRides] = useState<RideData[]>([]);

// 	// Check if the system is initialized
// 	useEffect(() => {
// 		const checkInitialization = async () => {
// 			if (isReady) {
// 				try {
// 					await getAllRides();
// 					setIsInitialized(true);
// 				} catch (error) {
// 					console.log('System not initialized yet:', error);
// 					setIsInitialized(false);
// 				}
// 			}
// 		};

// 		checkInitialization();
// 	}, [isReady, getAllRides]);

// 	// Fetch rides when wallet connects or system initializes
// 	useEffect(() => {
// 		if (isReady && isInitialized) {
// 			fetchRides();
// 		}
// 	}, [isReady, isInitialized]);

// 	const handleInitializeSystem = async () => {
// 		if (!isReady) return;

// 		setIsLoading((prev) => ({ ...prev, init: true }));
// 		try {
// 			await initializeSystem();
// 			toast({
// 				title: 'Success!',
// 				description: 'Review system initialized successfully',
// 			});
// 			setIsInitialized(true);
// 		} catch (error) {
// 			console.error('Error initializing system:', error);
// 			toast({
// 				title: 'Error',
// 				description: 'Failed to initialize review system',
// 				variant: 'destructive',
// 			});
// 		} finally {
// 			setIsLoading((prev) => ({ ...prev, init: false }));
// 		}
// 	};

// 	const handleCreateRide = async () => {
// 		if (!isReady) return;

// 		setIsLoading((prev) => ({ ...prev, create: true }));
// 		try {
// 			await createRide(
// 				rideForm.rideId,
// 				rideForm.driverName,
// 				rideForm.route,
// 				rideForm.vehicleType
// 			);
// 			toast({
// 				title: 'Success!',
// 				description: 'Ride created successfully',
// 			});
// 			setRideForm({
// 				rideId: '',
// 				driverName: '',
// 				route: '',
// 				vehicleType: 'car',
// 			});
// 			fetchRides();
// 		} catch (error) {
// 			console.error('Error creating ride:', error);
// 			toast({
// 				title: 'Error',
// 				description:
// 					'Failed to create ride. ' + (error as Error).message,
// 				variant: 'destructive',
// 			});
// 		} finally {
// 			setIsLoading((prev) => ({ ...prev, create: false }));
// 		}
// 	};

// 	const handleSubmitReview = async () => {
// 		if (!isReady) return;

// 		setIsLoading((prev) => ({ ...prev, review: true }));
// 		try {
// 			await submitReview(
// 				reviewForm.rideId,
// 				reviewForm.rating,
// 				reviewForm.comment
// 			);
// 			toast({
// 				title: 'Success!',
// 				description: 'Review submitted successfully',
// 			});
// 			setReviewForm({ rideId: '', rating: 5, comment: '' });
// 			fetchRides();
// 		} catch (error) {
// 			console.error('Error submitting review:', error);
// 			toast({
// 				title: 'Error',
// 				description:
// 					'Failed to submit review. ' + (error as Error).message,
// 				variant: 'destructive',
// 			});
// 		} finally {
// 			setIsLoading((prev) => ({ ...prev, review: false }));
// 		}
// 	};

// 	const fetchRides = async () => {
// 		if (!isReady) return;

// 		setIsLoading((prev) => ({ ...prev, fetch: true }));
// 		try {
// 			const ridesData = await getAllRides();
// 			setRides(ridesData);
// 		} catch (error) {
// 			console.error('Error fetching rides:', error);
// 			toast({
// 				title: 'Error',
// 				description: 'Failed to fetch rides',
// 				variant: 'destructive',
// 			});
// 		} finally {
// 			setIsLoading((prev) => ({ ...prev, fetch: false }));
// 		}
// 	};

// 	const renderStars = (rating: number) => {
// 		return Array.from({ length: 5 }, (_, i) => (
// 			<Star
// 				key={i}
// 				className={`w-4 h-4 ${
// 					i < rating
// 						? 'fill-yellow-400 text-yellow-400'
// 						: 'text-gray-300'
// 				}`}
// 			/>
// 		));
// 	};

// 	if (!publicKey) {
// 		return (
// 			<div className="container mx-auto p-6">
// 				<Card className="w-full max-w-md mx-auto">
// 					<CardHeader className="text-center">
// 						<CardTitle className="text-2xl">
// 							Ride Review System
// 						</CardTitle>
// 						<CardDescription>
// 							Please connect your wallet to continue
// 						</CardDescription>
// 					</CardHeader>
// 					<CardContent className="text-center">
// 						<p className="text-muted-foreground">
// 							Use the wallet connection button in the top
// 							navigation to get started.
// 						</p>
// 					</CardContent>
// 				</Card>
// 			</div>
// 		);
// 	}

// 	return (
// 		<div className="container mx-auto p-6 space-y-6">
// 			{/* Header */}
// 			<div className="flex justify-between items-center">
// 				<div>
// 					<h1 className="text-3xl font-bold">Ride Review System</h1>
// 					<p className="text-muted-foreground">
// 						Manage rides and reviews on the blockchain
// 					</p>
// 				</div>
// 			</div>

// 			{/* Initialize System */}
// 			{!isInitialized && (
// 				<Card>
// 					<CardHeader>
// 						<CardTitle>Initialize Review System</CardTitle>
// 						<CardDescription>
// 							The review system needs to be initialized before you
// 							can create rides or submit reviews.
// 						</CardDescription>
// 					</CardHeader>
// 					<CardContent>
// 						<Button
// 							onClick={handleInitializeSystem}
// 							disabled={isLoading.init}
// 						>
// 							{isLoading.init
// 								? 'Initializing...'
// 								: 'Initialize System'}
// 						</Button>
// 					</CardContent>
// 				</Card>
// 			)}

// 			{isInitialized && (
// 				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
// 					{/* Create Ride */}
// 					<Card>
// 						<CardHeader>
// 							<CardTitle className="flex items-center gap-2">
// 								<Car className="w-5 h-5" />
// 								Create New Ride
// 							</CardTitle>
// 						</CardHeader>
// 						<CardContent className="space-y-4">
// 							<div>
// 								<Label htmlFor="rideId">Ride ID</Label>
// 								<Input
// 									id="rideId"
// 									value={rideForm.rideId}
// 									onChange={(e) =>
// 										setRideForm({
// 											...rideForm,
// 											rideId: e.target.value,
// 										})
// 									}
// 									placeholder="Enter unique ride ID"
// 									maxLength={50}
// 								/>
// 							</div>
// 							<div>
// 								<Label htmlFor="driverName">Driver Name</Label>
// 								<Input
// 									id="driverName"
// 									value={rideForm.driverName}
// 									onChange={(e) =>
// 										setRideForm({
// 											...rideForm,
// 											driverName: e.target.value,
// 										})
// 									}
// 									placeholder="Enter driver name"
// 									maxLength={100}
// 								/>
// 							</div>
// 							<div>
// 								<Label htmlFor="route">Route</Label>
// 								<Input
// 									id="route"
// 									value={rideForm.route}
// 									onChange={(e) =>
// 										setRideForm({
// 											...rideForm,
// 											route: e.target.value,
// 										})
// 									}
// 									placeholder="Enter route details"
// 									maxLength={200}
// 								/>
// 							</div>
// 							<div>
// 								<Label htmlFor="vehicleType">
// 									Vehicle Type
// 								</Label>
// 								<Select
// 									value={rideForm.vehicleType}
// 									onValueChange={(value) =>
// 										setRideForm({
// 											...rideForm,
// 											vehicleType: value,
// 										})
// 									}
// 								>
// 									<SelectTrigger>
// 										<SelectValue />
// 									</SelectTrigger>
// 									<SelectContent>
// 										<SelectItem value="car">Car</SelectItem>
// 										<SelectItem value="motorcycle">
// 											Motorcycle
// 										</SelectItem>
// 										<SelectItem value="bicycle">
// 											Bicycle
// 										</SelectItem>
// 										<SelectItem value="scooter">
// 											Scooter
// 										</SelectItem>
// 									</SelectContent>
// 								</Select>
// 							</div>
// 							<Button
// 								onClick={handleCreateRide}
// 								className="w-full"
// 								disabled={isLoading.create}
// 							>
// 								{isLoading.create
// 									? 'Creating...'
// 									: 'Create Ride'}
// 							</Button>
// 						</CardContent>
// 					</Card>

// 					{/* Submit Review */}
// 					<Card>
// 						<CardHeader>
// 							<CardTitle className="flex items-center gap-2">
// 								<MessageSquare className="w-5 h-5" />
// 								Submit Review
// 							</CardTitle>
// 						</CardHeader>
// 						<CardContent className="space-y-4">
// 							<div>
// 								<Label htmlFor="reviewRideId">Ride ID</Label>
// 								<Input
// 									id="reviewRideId"
// 									value={reviewForm.rideId}
// 									onChange={(e) =>
// 										setReviewForm({
// 											...reviewForm,
// 											rideId: e.target.value,
// 										})
// 									}
// 									placeholder="Enter ride ID to review"
// 								/>
// 							</div>
// 							<div>
// 								<Label htmlFor="rating">Rating</Label>
// 								<Select
// 									value={reviewForm.rating.toString()}
// 									onValueChange={(value) =>
// 										setReviewForm({
// 											...reviewForm,
// 											rating: Number.parseInt(value),
// 										})
// 									}
// 								>
// 									<SelectTrigger>
// 										<SelectValue />
// 									</SelectTrigger>
// 									<SelectContent>
// 										<SelectItem value="1">
// 											1 Star
// 										</SelectItem>
// 										<SelectItem value="2">
// 											2 Stars
// 										</SelectItem>
// 										<SelectItem value="3">
// 											3 Stars
// 										</SelectItem>
// 										<SelectItem value="4">
// 											4 Stars
// 										</SelectItem>
// 										<SelectItem value="5">
// 											5 Stars
// 										</SelectItem>
// 									</SelectContent>
// 								</Select>
// 							</div>
// 							<div>
// 								<Label htmlFor="comment">Comment</Label>
// 								<Textarea
// 									id="comment"
// 									value={reviewForm.comment}
// 									onChange={(e) =>
// 										setReviewForm({
// 											...reviewForm,
// 											comment: e.target.value,
// 										})
// 									}
// 									placeholder="Write your review..."
// 									maxLength={500}
// 								/>
// 							</div>
// 							<Button
// 								onClick={handleSubmitReview}
// 								className="w-full"
// 								disabled={isLoading.review}
// 							>
// 								{isLoading.review
// 									? 'Submitting...'
// 									: 'Submit Review'}
// 							</Button>
// 						</CardContent>
// 					</Card>
// 				</div>
// 			)}

// 			{/* Rides List */}
// 			{isInitialized && (
// 				<Card>
// 					<CardHeader className="flex flex-row items-center justify-between">
// 						<CardTitle>Available Rides</CardTitle>
// 						<Button
// 							onClick={fetchRides}
// 							variant="outline"
// 							disabled={isLoading.fetch}
// 						>
// 							{isLoading.fetch ? 'Refreshing...' : 'Refresh'}
// 						</Button>
// 					</CardHeader>
// 					<CardContent>
// 						{rides.length === 0 ? (
// 							<p className="text-center text-muted-foreground py-8">
// 								No rides available. Create your first ride!
// 							</p>
// 						) : (
// 							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
// 								{rides.map((ride, index) => (
// 									<Card
// 										key={index}
// 										className="hover:shadow-md transition-shadow"
// 									>
// 										<CardContent className="p-4">
// 											<div className="space-y-2">
// 												<div className="flex items-center justify-between">
// 													<Badge variant="secondary">
// 														{ride.vehicleType}
// 													</Badge>
// 													<div className="flex items-center gap-1">
// 														{renderStars(
// 															ride.averageRating
// 														)}
// 														<span className="text-sm text-muted-foreground ml-1">
// 															({ride.totalReviews}
// 															)
// 														</span>
// 													</div>
// 												</div>
// 												<h3 className="font-semibold text-lg">
// 													{ride.rideId}
// 												</h3>
// 												<div className="space-y-1 text-sm text-muted-foreground">
// 													<div className="flex items-center gap-2">
// 														<User className="w-4 h-4" />
// 														{ride.driverName}
// 													</div>
// 													<div className="flex items-center gap-2">
// 														<MapPin className="w-4 h-4" />
// 														{ride.route}
// 													</div>
// 													<div className="flex items-center gap-2">
// 														<Calendar className="w-4 h-4" />
// 														{new Date(
// 															ride.createdAt *
// 																1000
// 														).toLocaleDateString()}
// 													</div>
// 												</div>
// 											</div>
// 										</CardContent>
// 									</Card>
// 								))}
// 							</div>
// 						)}
// 					</CardContent>
// 				</Card>
// 			)}
// 		</div>
// 	);
// }
import React from 'react';

const page = () => {
	return <div>page</div>;
};

export default page;
