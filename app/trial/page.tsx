import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { getCookie } from 'cookies-next/client';
import { useEffect } from 'react';
import Image from 'next/image';

export default async function Home() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	return (
		<main className="flex items-center justify-center grow p-8">
			<div className="flex flex-col items-center gap-4">
				<h1 className="text-7xl">Hello</h1>
				<p>You are logged in as: {session?.user?.email}</p>
				<div>
					<Image
						src={session?.user?.image!}
						alt="This is an image to be displayed for user profile picture"
					/>
				</div>
			</div>
		</main>
	);
}
