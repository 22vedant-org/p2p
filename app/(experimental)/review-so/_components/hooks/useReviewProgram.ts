import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
	Program,
	AnchorProvider,
	web3,
	BN,
	Idl,
	AnchorWallet,
} from '@coral-xyz/anchor';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { useMemo, useCallback } from 'react';
import idl from '../carpooling_reviews.json';
import { CarpoolingReviews } from '../lib/types/carpooling_reviews';

const PROGRAM_ID = new PublicKey(
	'6fBE38JrANKWtNLJ6esab6fXos2HHnsczRnSS2gSpxAB'
);

// Define the types based on your IDL
interface RideAccount {
	rideId: string;
	driver: string;
	maxPassengers: number;
	currentPassengers: number;
	pricePerSeat: number;
	startLocation: string;
	endLocation: string;
	departureTime: number;
	status: 'active' | 'completed' | 'cancelled';
	createdAt: number;
	completedAt?: number;
	passengers: string[];
}

interface ReviewAccount {
	rideId: string;
	reviewer: string;
	reviewee: string;
	rating: number;
	comment: string;
	reviewType: 'driverReview' | 'passengerReview';
	createdAt: number;
	isVerified: boolean;
	isReported: boolean;
	reportReason?: string;
}

export const useReviewProgram = () => {
	const { connection } = useConnection();
	const wallet = useWallet();

	const provider = useMemo(() => {
		if (!wallet.publicKey) return null;
		return new AnchorProvider(connection, wallet as AnchorWallet, {
			commitment: 'confirmed',
		});
	}, [connection, wallet]);

	const program = useMemo(() => {
		if (!provider) return null;
		return new Program<CarpoolingReviews>(idl as Idl, provider);
	}, [provider]);

	const getRideAccountPDA = useCallback((rideId: string) => {
		return PublicKey.findProgramAddressSync(
			[Buffer.from('ride'), Buffer.from(rideId)],
			PROGRAM_ID
		);
	}, []);

	const getReviewAccountPDA = useCallback(
		(rideAccountKey: PublicKey, reviewerKey: PublicKey) => {
			return PublicKey.findProgramAddressSync(
				[
					Buffer.from('review'),
					rideAccountKey.toBuffer(),
					reviewerKey.toBuffer(),
				],
				PROGRAM_ID
			);
		},
		[]
	);

	const initializeRide = useCallback(
		async (
			rideId: string,
			driver: PublicKey,
			maxPassengers: number,
			pricePerSeat: number,
			startLocation: string,
			endLocation: string,
			departureTime: number
		) => {
			if (!program || !wallet.publicKey)
				throw new Error('Program or wallet not available');

			const [rideAccountPDA] = getRideAccountPDA(rideId);

			const tx = await program.methods
				.initializeRide(
					rideId,
					driver,
					maxPassengers,
					new BN(pricePerSeat),
					startLocation,
					endLocation,
					new BN(departureTime)
				)
				.accounts({
					driver: wallet.publicKey,
					systemProgram: SystemProgram.programId,
				})
				.rpc();

			return { transaction: tx, rideAccountPDA };
		},
		[program, wallet.publicKey, getRideAccountPDA]
	);

	const joinRide = useCallback(
		async (rideId: string) => {
			if (!program || !wallet.publicKey)
				throw new Error('Program or wallet not available');

			const [rideAccountPDA] = getRideAccountPDA(rideId);

			const tx = await program.methods
				.joinRide()
				.accountsPartial({
					rideAccount: rideAccountPDA,
					passenger: wallet.publicKey,
				})
				.rpc();

			return tx;
		},
		[program, wallet.publicKey, getRideAccountPDA]
	);

	const completeRide = useCallback(
		async (rideId: string) => {
			if (!program || !wallet.publicKey)
				throw new Error('Program or wallet not available');

			const [rideAccountPDA] = getRideAccountPDA(rideId);

			const tx = await program.methods
				.completeRide()
				.accountsPartial({
					rideAccount: rideAccountPDA,
					driver: wallet.publicKey,
				})
				.rpc();

			return tx;
		},
		[program, wallet.publicKey, getRideAccountPDA]
	);

	const submitReview = useCallback(
		async (
			rideId: string,
			rating: number,
			comment: string,
			reviewType: 'DriverReview' | 'PassengerReview'
		) => {
			if (!program || !wallet.publicKey)
				throw new Error('Program or wallet not available');

			const [rideAccountPDA] = getRideAccountPDA(rideId);
			const [reviewAccountPDA] = getReviewAccountPDA(
				rideAccountPDA,
				wallet.publicKey
			);

			const reviewTypeEnum =
				reviewType === 'DriverReview'
					? { driverReview: {} }
					: { passengerReview: {} };

			const tx = await program.methods
				.submitReview(rating, comment, reviewTypeEnum)
				.accounts({
					rideAccount: rideAccountPDA,
					reviewer: wallet.publicKey,
					systemProgram: SystemProgram.programId,
				})
				.rpc();

			return { transaction: tx, reviewAccountPDA };
		},
		[program, wallet.publicKey, getRideAccountPDA, getReviewAccountPDA]
	);

	const fetchRideAccount = useCallback(
		async (rideId: string): Promise<RideAccount | null> => {
			if (!program) return null;

			try {
				const [rideAccountPDA] = getRideAccountPDA(rideId);
				const rideAccount = await program.account.rideAccount.fetch(
					rideAccountPDA
				);

				return {
					rideId: rideAccount.rideId,
					driver: rideAccount.driver.toString(),
					maxPassengers: rideAccount.maxPassengers,
					currentPassengers: rideAccount.currentPassengers,
					pricePerSeat: rideAccount.pricePerSeat.toNumber(),
					startLocation: rideAccount.startLocation,
					endLocation: rideAccount.endLocation,
					departureTime: rideAccount.departureTime.toNumber(),
					status: Object.keys(rideAccount.status)[0] as
						| 'active'
						| 'completed'
						| 'cancelled',
					createdAt: rideAccount.createdAt.toNumber(),
					completedAt: rideAccount.completedAt?.toNumber(),
					passengers: rideAccount.passengers.map((p: PublicKey) =>
						p.toString()
					),
				};
			} catch (error) {
				console.error('Error fetching ride account:', error);
				return null;
			}
		},
		[program, getRideAccountPDA]
	);

	const fetchReviewAccount = useCallback(
		async (
			rideId: string,
			reviewerKey: PublicKey
		): Promise<ReviewAccount | null> => {
			if (!program) return null;

			try {
				const [rideAccountPDA] = getRideAccountPDA(rideId);
				const [reviewAccountPDA] = getReviewAccountPDA(
					rideAccountPDA,
					reviewerKey
				);
				const reviewAccount = await program.account.reviewAccount.fetch(
					reviewAccountPDA
				);

				return {
					rideId: reviewAccount.rideId,
					reviewer: reviewAccount.reviewer.toString(),
					reviewee: reviewAccount.reviewee.toString(),
					rating: reviewAccount.rating,
					comment: reviewAccount.comment,
					reviewType: Object.keys(reviewAccount.reviewType)[0] as
						| 'driverReview'
						| 'passengerReview',
					createdAt: reviewAccount.createdAt.toNumber(),
					isVerified: reviewAccount.isVerified,
					isReported: reviewAccount.isReported,
					reportReason: reviewAccount.reportReason,
				};
			} catch (error) {
				console.error('Error fetching review account:', error);
				return null;
			}
		},
		[program, getRideAccountPDA, getReviewAccountPDA]
	);

	const fetchUserReviews = useCallback(
		async (userPublicKey: PublicKey): Promise<ReviewAccount[]> => {
			if (!program) return [];

			try {
				// This is a simplified approach - in practice you'd want to use proper indexing
				// or maintain separate accounts for user review aggregations
				const reviews = await program.account.reviewAccount.all([
					{
						memcmp: {
							offset: 8 + 4 + 50, // discriminator + rideId string length prefix + rideId content
							bytes: userPublicKey.toBase58(),
						},
					},
				]);

				return reviews.map((review) => ({
					rideId: review.account.rideId,
					reviewer: review.account.reviewer.toString(),
					reviewee: review.account.reviewee.toString(),
					rating: review.account.rating,
					comment: review.account.comment,
					reviewType: Object.keys(review.account.reviewType)[0] as
						| 'driverReview'
						| 'passengerReview',
					createdAt: review.account.createdAt.toNumber(),
					isVerified: review.account.isVerified,
					isReported: review.account.isReported,
					reportReason: review.account.reportReason,
				}));
			} catch (error) {
				console.error('Error fetching user reviews:', error);
				return [];
			}
		},
		[program]
	);

	const fetchAllReviews = useCallback(async (): Promise<ReviewAccount[]> => {
		if (!program) return [];

		try {
			const reviews = await program.account.reviewAccount.all();

			return reviews.map((review) => ({
				rideId: review.account.rideId,
				reviewer: review.account.reviewer.toString(),
				reviewee: review.account.reviewee.toString(),
				rating: review.account.rating,
				comment: review.account.comment,
				reviewType: Object.keys(review.account.reviewType)[0] as
					| 'driverReview'
					| 'passengerReview',
				createdAt: review.account.createdAt.toNumber(),
				isVerified: review.account.isVerified,
				isReported: review.account.isReported,
				reportReason: review.account.reportReason,
			}));
		} catch (error) {
			console.error('Error fetching all reviews:', error);
			return [];
		}
	}, [program]);

	return {
		program,
		initializeRide,
		joinRide,
		completeRide,
		submitReview,
		fetchRideAccount,
		fetchReviewAccount,
		fetchUserReviews,
		fetchAllReviews,
		getRideAccountPDA,
		getReviewAccountPDA,
	};
};
