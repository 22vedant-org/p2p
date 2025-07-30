import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

function calculateDistance({
	lat1,
	lon1,
	lat2,
	lon2,
}: {
	lat1: number;
	lon1: number;
	lat2: number;
	lon2: number;
}) {
	const R = 6371; // Earth's radius in kilometers
	const dLat = ((lat2 - lat1) * Math.PI) / 180;
	const dLon = ((lon2 - lon1) * Math.PI) / 180;
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos((lat1 * Math.PI) / 180) *
			Math.cos((lat2 * Math.PI) / 180) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	const distance = R * c;
	return distance;
}

// Extract coordinates from startLocation object
function extractStartCoordinates(startLocationCoord: number[] | null) {
	if (Array.isArray(startLocationCoord) && startLocationCoord.length >= 2) {
		const [lat, lng] = startLocationCoord;
		if (typeof lat === 'number' && typeof lng === 'number') {
			return { lat, lng };
		}
	}
	return null;
}

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

		// ✅ Destructure body with default values
		const {
			pickupQuery,
			dropoffQuery,
			departureTime,
			markerOrigin,
			markerDestination,
			proximityRadius = 1,
		} = body || {};

		const response = await prisma.ride.findMany({
			where: {
				OR: [
					{
						AND: [
							{
								startLocation: pickupQuery,
							},
							{
								endLocation: dropoffQuery,
							},
							{
								status: 'AVAILABLE',
							},
						],
					},
					{
						AND: [
							{
								endLocation: dropoffQuery,
							},
							{
								polyLineCoords: {
									array_contains: [
										markerOrigin.lng,
										markerOrigin.lat,
									],
								},
							},
						],
					},
				],
			},
			select: {
				id: true,
				rideId: true, // ✅ Include rideId in the selection
				startLocation: true,
				startLocationCoord: true,
				endLocation: true,
				endLocationCoord: true,
				departureTime: true,
				availableSeats: true,
				pricePerSeat: true,
				initialDeposit: true,
				rideBio: true,
				polyLineCoords: true,
				totalDistance: true,
				status: true,
				escrowAddress: true,
				driverPublicKey: true,
				createdAt: true,
				updatedAt: true,
				driver: {
					select: {
						id: true,
						name: true,
						image: true,
						role: true,
					},
				},
				rideRequests: {
					select: {
						id: true,
						seats: true,
						status: true,
					},
				},
			},
		});

		let filteredRides = response;
		if (markerOrigin.lat !== undefined && markerOrigin.lng !== undefined) {
			filteredRides.filter((ride) => {
				const startCoords = ride.startLocationCoord;
				const { lng, lat } = startCoords;
				if (startCoords) {
					const distance: number = calculateDistance({
						lat1: markerOrigin.lat,
						lon1: markerOrigin.lng,
						lon2: lng,
						lat2: lat,
					});
					return distance <= proximityRadius;
				}
				return false;
			});

			if (
				markerOrigin &&
				markerOrigin.lat !== undefined &&
				markerOrigin.lng !== undefined
			) {
				filteredRides = filteredRides
					.map((ride) => {
						const startCoords = ride.startLocationCoord;
						const { lng, lat } = startCoords;
						const distance = startCoords
							? calculateDistance({
									lat1: markerOrigin.lat,
									lon1: markerOrigin.lng,
									lat2: lat,
									lon2: lng,
							  })
							: Infinity;

						return {
							...ride,
							distanceFromUser: distance,
						};
					})
					.sort((a, b) => a.distanceFromUser - b.distanceFromUser);
			}
		}

		// ✅ Handle BigInt serialization for JSON response - Convert each ride properly
		const serializedRides = filteredRides.map((ride) => {
			// Create a new object with BigInt converted to string
			return {
				...ride,
				rideId: ride.rideId ? ride.rideId.toString() : null,
			};
		});

		return NextResponse.json({
			success: true,
			rides: serializedRides,
			totalRides: serializedRides.length,
			proximitySearch:
				markerOrigin &&
				markerOrigin.lat !== undefined &&
				markerOrigin.lng !== undefined,
			radius: proximityRadius,
			userLocation: markerOrigin || null,
		});
	} catch (error) {
		console.error('Error finding rides:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
