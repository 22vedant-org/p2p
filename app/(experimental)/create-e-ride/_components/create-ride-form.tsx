import { useState } from 'react';
import { useRideEscrow } from './hooks/useEscrow';
import { CreateEscrowParams } from './lib/ride-escrow';

export function CreateRideForm() {
	const [formData, setFormData] = useState<CreateEscrowParams>({
		rideId: 0,
		perSeatPrice: 0,
		driverSecurityDeposit: 0,
		riderSecurityDeposit: 0,
	});

	const { createEscrow, loading, error } = useRideEscrow();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const result = await createEscrow(formData);
			alert(`Ride created! Transaction: ${result.signature}`);
			console.log('Escrow address:', result.escrowAddress.toString());
		} catch (err) {
			console.error('Error creating ride:', err);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded">
			<h2 className="text-xl font-bold">Create New Ride</h2>

			<div>
				<label className="block text-sm font-medium">Ride ID</label>
				<input
					type="number"
					value={formData.rideId}
					onChange={(e) =>
						setFormData({
							...formData,
							rideId: parseInt(e.target.value),
						})
					}
					className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
					required
				/>
			</div>

			<div>
				<label className="block text-sm font-medium">
					Per Seat Price (SOL)
				</label>
				<input
					type="number"
					step="0.001"
					value={formData.perSeatPrice}
					onChange={(e) =>
						setFormData({
							...formData,
							perSeatPrice: parseFloat(e.target.value),
						})
					}
					className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
					required
				/>
			</div>

			<div>
				<label className="block text-sm font-medium">
					Driver Security Deposit (SOL)
				</label>
				<input
					type="number"
					step="0.001"
					value={formData.driverSecurityDeposit}
					onChange={(e) =>
						setFormData({
							...formData,
							driverSecurityDeposit: parseFloat(e.target.value),
						})
					}
					className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
					required
				/>
			</div>

			<div>
				<label className="block text-sm font-medium">
					Rider Security Deposit (SOL)
				</label>
				<input
					type="number"
					step="0.001"
					value={formData.riderSecurityDeposit}
					onChange={(e) =>
						setFormData({
							...formData,
							riderSecurityDeposit: parseFloat(e.target.value),
						})
					}
					className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
					required
				/>
			</div>

			{error && <div className="text-red-600 text-sm">{error}</div>}

			<button
				type="submit"
				disabled={loading}
				className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
			>
				{loading ? 'Creating...' : 'Create Ride'}
			</button>
		</form>
	);
}
