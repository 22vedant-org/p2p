export interface RideAccount {
	rideId: string;
	driver: string;
	maxPassengers: number;
	currentPassengers: number;
	pricePerSeat: number;
	startLocation: string;
	endLocation: string;
	departureTime: number;
	status: 'Active' | 'Completed' | 'Cancelled';
	createdAt: number;
	completedAt?: number;
	passengers: string[];
}

export interface ReviewAccount {
	rideId: string;
	reviewer: string;
	reviewee: string;
	rating: number;
	comment: string;
	reviewType: 'DriverReview' | 'PassengerReview';
	createdAt: number;
	isVerified: boolean;
	isReported: boolean;
	reportReason?: string;
}

export interface ReviewFormData {
	rating: number;
	comment: string;
	reviewType: 'DriverReview' | 'PassengerReview';
}

export enum RideStatus {
	Created = 'Created',
	InProgress = 'InProgress',
	Completed = 'Completed',
	Cancelled = 'Cancelled',
}
