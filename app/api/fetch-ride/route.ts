import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function POST(req: NextRequest) {
	try {
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

		let body;
		try {
			body = await req.json();
		} catch (err) {
			return NextResponse.json(
				{ error: 'Invalid JSON payload' },
				{ status: 400 }
			);
		}

		const { id, rideId } = body || {};

		if (!id && !rideId) {
			return NextResponse.json(
				{ error: 'Either id or rideId is required' },
				{ status: 400 }
			);
		}

		// Build the where clause based on provided parameters
		const whereClause = id ? { id } : { rideId: BigInt(rideId) };

		const ride = await prisma.ride.findFirst({
			where: whereClause,
			select: {
				id: true,
				startLocation: true,
				endLocation: true,
				startLocationCoord: true,
				endLocationCoord: true,
				departureTime: true,
				// estimatedArrivalTime: true,
				availableSeats: true,
				pricePerSeat: true,
				status: true,
				// vehicleType: true,
				// vehicleModel: true,
				// vehicleColor: true,
				// licensePlate: true,
				polyLineCoords: true,
				rideId: true,
				driverPublicKey: true,
				// Include driver information
				driver: {
					select: {
						id: true,
						name: true,
						image: true,
						role: true,
					},
				},
				// Include ride requests
				rideRequests: {
					select: {
						id: true,
						seats: true,
						status: true,
					},
				},
			},
		});

		if (!ride) {
			return NextResponse.json(
				{ error: 'Ride not found' },
				{ status: 404 }
			);
		}

		// Convert BigInt to string for JSON serialization
		const rideData = {
			...ride,
			rideId: ride.rideId ? ride.rideId.toString() : null,
		};

		return NextResponse.json({
			success: true,
			ride: rideData,
		});
	} catch (error) {
		console.error('Error fetching ride:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
