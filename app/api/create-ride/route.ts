import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

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
			!rideBio
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

		// ✅ Create the ride in the database
		const ride = await prisma.ride.create({
			data: {
				startLocation: rideMarkerOrigin,
				endLocation: rideMarkerDestination,
				departureTime: parsedDepartureTime.toString(),
				availableSeats: Number(availableSeats) || 1,
				initialDeposit: initialDeposit || 0,
				polyLineCoords: polyLineCoords || [],
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
