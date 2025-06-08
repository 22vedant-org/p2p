import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

async function fetchSolInrPrice(): Promise<number> {
	try {
		const response = await fetch(
			'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=inr',
			{ cache: 'no-store' } // Ensure fresh data
		);
		if (!response.ok) {
			throw new Error('Failed to fetch SOL/INR price');
		}
		const data = await response.json();
		return data.solana.inr; // Returns price of 1 SOL in INR
	} catch (error) {
		console.error('Error fetching SOL/INR price:', error);
		throw new Error('Unable to fetch cryptocurrency price');
	}
}

export async function POST(req: NextRequest) {
	try {
		// ✅ Get user session (Uncomment if needed)
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		// ✅ Ensure user is authenticated (Uncomment if needed)
		// if (!session?.user?.id) {
		// 	return NextResponse.json(
		// 		{ error: 'Unauthorized' },
		// 		{ status: 401 }
		// 	);
		// }

		// ✅ Parse request body safely
		let body;
		try {
			body = await req.json();
		} catch (err) {
			return NextResponse.json(
				{ error: 'Invalid JSON payload' },
				{ status: 400 }
			);
		}

		// ✅ Destructure body with default values
		const {
			rideMarkerOrigin,
			rideMarkerDestination,
			departureTime,
			availableSeats,
			initialDeposit,
			driverId,
			rideBio,
			polyLineCoords,
			totalDistance,
		} = body || {};

		// ✅ Validate required fields
		if (
			!rideMarkerOrigin ||
			!rideMarkerDestination ||
			!departureTime ||
			!driverId ||
			!polyLineCoords ||
			!initialDeposit ||
			!availableSeats ||
			!rideBio ||
			!totalDistance
		) {
			return NextResponse.json(
				{ error: 'Missing required fields' },
				{ status: 400 }
			);
		}

		// ✅ Ensure departureTime is a valid date
		const parsedDepartureTime = new Date(departureTime);
		if (isNaN(parsedDepartureTime.getTime())) {
			return NextResponse.json(
				{ error: 'Invalid departure time' },
				{ status: 400 }
			);
		}

		const depositInInr = Number(initialDeposit);
		if (isNaN(depositInInr) || depositInInr <= 0) {
			return NextResponse.json(
				{ error: 'Invalid initial deposit amount' },
				{ status: 400 }
			);
		}

		let depositInSol: number;
		try {
			const solInrPrice = await fetchSolInrPrice();
			depositInSol = depositInInr / solInrPrice; // Convert INR to SOL
		} catch (error) {
			return NextResponse.json(
				{ error: 'Failed to convert INR to SOL' },
				{ status: 500 }
			);
		}

		// ✅ Create the ride in the database
		const ride = await prisma.ride.create({
			data: {
				startLocation: rideMarkerOrigin,
				endLocation: rideMarkerDestination,
				departureTime: parsedDepartureTime.toString(),
				availableSeats: Number(availableSeats) || 1,

				// initialDeposit: initialDeposit || 0,
				initialDeposit: depositInSol,
				polyLineCoords: polyLineCoords || [],
				totalDistance,
				driverId, // Using passed driverId
				rideBio,
			},
		});

		// ✅ Return success response
		return NextResponse.json(
			{
				message: 'Ride created successfully',
				ride,
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error('Error creating ride:', error);
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		);
	}
}
