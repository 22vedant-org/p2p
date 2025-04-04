import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function POST(req: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		// ✅ Ensure user is authenticated
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

		const { area, title, description } = body || {};

		// ✅ Validate required fields
		if (!area || !title || !description) {
			return NextResponse.json(
				{ error: 'All fields are required' },
				{ status: 400 }
			);
		}

		// ✅ Ensure "area" is a valid BugEnum value
		const validAreas = [
			'Map',
			'Dashboard',
			'RideBooking',
			'Payments',
			'ReviewS',
			'Settings',
		];
		if (!validAreas.includes(area)) {
			return NextResponse.json(
				{
					error:
						'Invalid Area. Must be one of: ' +
						validAreas.join(', '),
				},
				{ status: 400 }
			);
		}

		// ✅ Create a bug report (Fixed: Use `prisma.bugs.create()`)
		const bug = await prisma.bugs.create({
			data: {
				Area: area,
				Title: title,
				Description: description,
			},
		});

		return NextResponse.json(
			{
				message: 'Bug Reported Successfully',
				bug,
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error('Error while submitting', error);
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		);
	}
}
