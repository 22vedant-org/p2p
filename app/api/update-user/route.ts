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
	} catch (error) {}
}
