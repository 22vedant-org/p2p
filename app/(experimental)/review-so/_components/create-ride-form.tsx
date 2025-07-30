// solana create-ride-form

'use client';
import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useReviewProgram } from './hooks/useReviewProgram';

interface CreateRideFormProps {
	onSuccess?: (rideId: string, transaction: string) => void;
	onError?: (error: string) => void;
}

export const CreateRideForm: React.FC<CreateRideFormProps> = ({
	onSuccess,
	onError,
}) => {
	const [formData, setFormData] = useState({
		rideId: '',
		maxPassengers: 4,
		pricePerSeat: '',
		startLocation: '',
		endLocation: '',
		departureDate: '',
		departureTime: '',
	});
	const [isCreating, setIsCreating] = useState(false);
	const { publicKey } = useWallet();
	const { initializeRide } = useReviewProgram();

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!publicKey) {
			onError?.('Please connect your wallet first');
			return;
		}

		// Validation
		if (!formData.rideId.trim()) {
			onError?.('Ride ID is required');
			return;
		}

		if (formData.rideId.length > 50) {
			onError?.('Ride ID too long (max 50 characters)');
			return;
		}

		if (!formData.startLocation.trim() || !formData.endLocation.trim()) {
			onError?.('Start and end locations are required');
			return;
		}

		if (
			formData.startLocation.length > 100 ||
			formData.endLocation.length > 100
		) {
			onError?.('Location too long (max 100 characters)');
			return;
		}

		if (formData.maxPassengers < 1 || formData.maxPassengers > 8) {
			onError?.('Invalid passenger count (must be 1-8)');
			return;
		}

		if (!formData.pricePerSeat || parseFloat(formData.pricePerSeat) < 0) {
			onError?.('Valid price per seat is required');
			return;
		}

		if (!formData.departureDate || !formData.departureTime) {
			onError?.('Departure date and time are required');
			return;
		}

		setIsCreating(true);

		try {
			// Combine date and time into a timestamp
			const departureDateTime = new Date(
				`${formData.departureDate}T${formData.departureTime}`
			);
			const departureTimestamp = Math.floor(
				departureDateTime.getTime() / 1000
			);

			// Convert price to smallest unit (assuming lamports or similar)
			const priceInSmallestUnit = Math.floor(
				parseFloat(formData.pricePerSeat) * 1000000
			); // Adjust multiplier as needed

			const result = await initializeRide(
				formData.rideId,
				publicKey,
				formData.maxPassengers,
				priceInSmallestUnit,
				formData.startLocation,
				formData.endLocation,
				departureTimestamp
			);

			onSuccess?.(formData.rideId, result.transaction);

			// Reset form
			setFormData({
				rideId: '',
				maxPassengers: 4,
				pricePerSeat: '',
				startLocation: '',
				endLocation: '',
				departureDate: '',
				departureTime: '',
			});
		} catch (error) {
			console.error('Error creating ride:', error);
			onError?.(
				error instanceof Error ? error.message : 'Failed to create ride'
			);
		} finally {
			setIsCreating(false);
		}
	};

	if (!publicKey) {
		return (
			<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
				<p className="text-yellow-800">
					Please connect your wallet to create a ride.
				</p>
			</div>
		);
	}

	return (
		<div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
			<h2 className="text-2xl font-bold text-gray-900 mb-6">
				Create New Ride
			</h2>

			<div className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Ride ID *
						</label>
						<input
							type="text"
							name="rideId"
							value={formData.rideId}
							onChange={handleInputChange}
							maxLength={50}
							className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Enter unique ride ID"
							required
						/>
						<p className="text-xs text-gray-500 mt-1">
							{formData.rideId.length}/50 characters
						</p>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Max Passengers *
						</label>
						<select
							name="maxPassengers"
							value={formData.maxPassengers}
							onChange={handleInputChange}
							className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							{[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
								<option key={num} value={num}>
									{num}
								</option>
							))}
						</select>
					</div>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Start Location *
					</label>
					<input
						type="text"
						name="startLocation"
						value={formData.startLocation}
						onChange={handleInputChange}
						maxLength={100}
						className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="Enter pickup location"
						required
					/>
					<p className="text-xs text-gray-500 mt-1">
						{formData.startLocation.length}/100 characters
					</p>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						End Location *
					</label>
					<input
						type="text"
						name="endLocation"
						value={formData.endLocation}
						onChange={handleInputChange}
						maxLength={100}
						className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="Enter destination"
						required
					/>
					<p className="text-xs text-gray-500 mt-1">
						{formData.endLocation.length}/100 characters
					</p>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Price Per Seat *
					</label>
					<input
						type="number"
						name="pricePerSeat"
						value={formData.pricePerSeat}
						onChange={handleInputChange}
						min="0"
						step="0.01"
						className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="0.00"
						required
					/>
					<p className="text-xs text-gray-500 mt-1">
						Enter price in your preferred currency
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Departure Date *
						</label>
						<input
							type="date"
							name="departureDate"
							value={formData.departureDate}
							onChange={handleInputChange}
							min={new Date().toISOString().split('T')[0]}
							className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Departure Time *
						</label>
						<input
							type="time"
							name="departureTime"
							value={formData.departureTime}
							onChange={handleInputChange}
							className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>
				</div>

				<div className="bg-gray-50 rounded-lg p-4">
					<h3 className="font-medium text-gray-900 mb-2">
						Ride Summary
					</h3>
					<div className="space-y-1 text-sm text-gray-600">
						<p>
							<strong>Driver:</strong>{' '}
							{publicKey.toString().slice(0, 8)}...
							{publicKey.toString().slice(-8)}
						</p>
						<p>
							<strong>Route:</strong>{' '}
							{formData.startLocation || 'Start'} →{' '}
							{formData.endLocation || 'End'}
						</p>
						<p>
							<strong>Capacity:</strong> {formData.maxPassengers}{' '}
							passengers
						</p>
						<p>
							<strong>Price:</strong>{' '}
							{formData.pricePerSeat || '0'} per seat
						</p>
						{formData.departureDate && formData.departureTime && (
							<p>
								<strong>Departure:</strong>{' '}
								{formData.departureDate} at{' '}
								{formData.departureTime}
							</p>
						)}
					</div>
				</div>

				<button
					onClick={handleSubmit}
					disabled={isCreating}
					className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
				>
					{isCreating ? 'Creating Ride...' : 'Create Ride'}
				</button>
			</div>
		</div>
	);
};
