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

		const { name, email, phoneNumber, bio } = body || {};

		// ✅ Validate required fields
		if (!name || !email || !phoneNumber || !bio) {
			return NextResponse.json(
				{ error: 'All fields are required' },
				{ status: 400 }
			);
		}

		const updateProfile = await prisma.user.update({
			where: {
				email: session?.user.email,
			},
			data: {
				name,
				email,
				phoneNumber,
				bio,
			},
		});

		return NextResponse.json(
			{
				message: 'Profile updated successfully',
				updateProfile,
			},
			{ status: 204 }
		);
	} catch (error) {
		console.log(error);
	}
}
