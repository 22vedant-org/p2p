import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

async function fetchSolInrPrice(): Promise<number> {
	try {
		const response = await fetch(
			'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=inr',
			{ cache: 'no-store' }
		);
		if (!response.ok) {
			throw new Error('Failed to fetch SOL/INR price');
		}
		const data = await response.json();
		return data.solana.inr;
	} catch (error) {
		console.error('Error fetching SOL/INR price:', error);
		throw new Error('Unable to fetch cryptocurrency price');
	}
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
			depositInSol = depositInInr / solInrPrice;
		} catch (error) {
			return NextResponse.json(
				{ error: 'Failed to convert INR to SOL' },
				{ status: 500 }
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
				initialDeposit: depositInSol,
				polyLineCoords: polyLineCoords || [],
				totalDistance,
				driverId,
				rideBio,
			},
		});

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
