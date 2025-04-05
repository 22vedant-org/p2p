import React from 'react';
import { authClient } from '@/lib/auth-client';
const page = async () => {
	// const { data: session } = authClient.useSession();
	const { data: session } = await authClient.getSession();
	// const session = data;
	return (
		<div>
			{/* <p>{session?.user.}</p> */}
			<p>{session?.user.email}</p>
			<p>Hello</p>
		</div>
	);
};

export default page;
