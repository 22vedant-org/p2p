import { NextResponse, type NextRequest } from 'next/server';
import { pinata } from '@/utils/config';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		const data = await request.formData();
		const file: File | null = data.get('file') as unknown as File;
		const uploadData = await pinata.upload.file(file);
		const url = await pinata.gateways.convert(uploadData.IpfsHash);
		await prisma.user.update({
			where: {
				email: session?.user.email,
			},
			data: {
				image: url,
			},
		});
		return NextResponse.json(url, { status: 200 });
	} catch (e) {
		console.log(e);
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		);
	}
}
