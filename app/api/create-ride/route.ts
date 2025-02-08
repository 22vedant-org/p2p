import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
export async function POST(req: NextRequest) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user?.id) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const body = await req.json();
		const {
			rideMarkerOrigin,
			rideMarkerDestination,
			departureTime,
			availableSeats,
			pricePerSeat,
		} = body;

		const ride = await prisma.ride.create({
			data: {
				startLocation: rideMarkerOrigin,
				endLocation: rideMarkerDestination,
				departureTime: new Date(departureTime),
				availableSeats: Number(availableSeats),
				pricePerSeat: Number(pricePerSeat),
				driverId: session?.user?.id,
			},
		});
	} catch (error) {
		console.error(error);
	}
}
