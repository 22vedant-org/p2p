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

		// ✅ Destructure body with default values
		const { pickupQuery, dropoffQuery, departureTime } = body || {};

		const response = await prisma.ride.findFirst({
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
								departureTime,
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
									array_contains: [],
								},
							},
						],
					},
					{},
				],
			},
		});
	} catch (error) {}
}
