import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

// Helper function to convert BigInt to string for JSON serialization
function serializeBigInt(obj: any): any {
	return JSON.parse(
		JSON.stringify(obj, (key, value) =>
			typeof value === 'bigint' ? value.toString() : value
		)
	);
}

export async function POST(req: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		let body;
		try {
			body = await req.json();
		} catch (err) {
			return NextResponse.json(
				{ error: 'Invalid JSON payload' },
				{ status: 400 }
			);
		}

		// ✅ Add logging to debug what we're receiving
		console.log('Received body:', JSON.stringify(body, null, 2));

		const {
			rideMarkerOrigin,
			markerOrigin,
			rideMarkerDestination,
			markerDestination,
			departureTime,
			availableSeats,
			initialDeposit,
			driverId,
			rideBio,
			polyLineCoords,
			totalDistance,
			rideId,
			escrowAddress,
			driverPublicKey,
		} = body || {};

		// ✅ Validate required fields with better error messages
		const missingFields = [];

		if (!rideMarkerOrigin) missingFields.push('rideMarkerOrigin');
		if (!rideMarkerDestination) missingFields.push('rideMarkerDestination');
		if (!departureTime) missingFields.push('departureTime');
		if (!driverId) missingFields.push('driverId');
		if (!polyLineCoords || polyLineCoords.length === 0)
			missingFields.push('polyLineCoords');
		if (initialDeposit === undefined || initialDeposit === null)
			missingFields.push('initialDeposit');
		if (!availableSeats) missingFields.push('availableSeats');
		if (!rideBio) missingFields.push('rideBio');
		if (!totalDistance) missingFields.push('totalDistance');
		if (!rideId) missingFields.push('rideId');
		if (!escrowAddress) missingFields.push('escrowAddress');
		if (!driverPublicKey) missingFields.push('driverPublicKey');

		// ✅ Validate marker coordinates with detailed checks
		if (!markerOrigin || typeof markerOrigin !== 'object') {
			missingFields.push('markerOrigin (must be an object)');
		} else if (
			typeof markerOrigin.lng !== 'number' ||
			typeof markerOrigin.lat !== 'number' ||
			isNaN(markerOrigin.lng) ||
			isNaN(markerOrigin.lat)
		) {
			missingFields.push(
				'markerOrigin (must have valid lng and lat numbers)'
			);
		}

		if (!markerDestination || typeof markerDestination !== 'object') {
			missingFields.push('markerDestination (must be an object)');
		} else if (
			typeof markerDestination.lng !== 'number' ||
			typeof markerDestination.lat !== 'number' ||
			isNaN(markerDestination.lng) ||
			isNaN(markerDestination.lat)
		) {
			missingFields.push(
				'markerDestination (must have valid lng and lat numbers)'
			);
		}

		if (missingFields.length > 0) {
			console.log('Missing fields:', missingFields);
			return NextResponse.json(
				{
					error: 'Missing or invalid required fields',
					missing: missingFields,
				},
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

		// ✅ Create the ride in the database with proper coordinate arrays
		const ride = await prisma.ride.create({
			data: {
				startLocation: rideMarkerOrigin,
				startLocationCoord: [markerOrigin.lng, markerOrigin.lat],
				endLocation: rideMarkerDestination,
				endLocationCoord: [
					markerDestination.lng,
					markerDestination.lat,
				],
				departureTime: parsedDepartureTime.toString(),
				availableSeats: Number(availableSeats) || 1,
				initialDeposit: initialDeposit,
				polyLineCoords: polyLineCoords || [],
				totalDistance,
				driverId,
				rideBio,
				rideId,
				escrowAddress,
				driverPublicKey,
			},
		});

		// ✅ Serialize the ride object to handle BigInt values
		const serializedRide = serializeBigInt(ride);

		return NextResponse.json(
			{
				message: 'Ride created successfully',
				ride: serializedRide,
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
