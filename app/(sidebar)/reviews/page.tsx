import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React from 'react';

const page = () => {
	return (
		<div className="grow flex justify-center items-center p-4">
			<div>Check Reviews</div>
			<Input
				type="text"
				className="mr-3"
				placeholder="Enter the user id of the driver"
			/>
			<Button variant={'secondary'}>Submit</Button>
		</div>
	);
};

export default page;
