'use client';

import { CreateRideForm } from './_components/create-ride-form';

const page = () => {
	const handleRideSuccess = (rideId: string, transaction: string) => {
		console.log('Ride created successfully!', { rideId, transaction });
		// Handle success (e.g., redirect, show success message)
	};

	const handleRideError = (error: string) => {
		console.error('Error creating ride:', error);
		// Handle error (e.g., show error message)
	};

	return (
		<CreateRideForm
			onSuccess={handleRideSuccess}
			onError={handleRideError}
		/>
	);
};

export default page;
