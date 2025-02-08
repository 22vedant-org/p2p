import { create } from 'zustand';

interface RideMarkerState {
	rideMarkerOrigin: { lng: number; lat: number };
	rideMarkerDestination: { lng: number; lat: number };
	setRideMarkerOrigin: (location: { lng: number; lat: number }) => void;
	setRideMarkerDestination: (location: { lng: number; lat: number }) => void;
}

export const useRideMarkerPositionStore = create<RideMarkerState>()((set) => ({
	rideMarkerOrigin: {
		lng: 73.84746,
		lat: 18.530823,
	},
	rideMarkerDestination: {
		lng: 73.847466,
		lat: 18.5823,
	},
	setRideMarkerOrigin: (location) =>
		set((state) => ({ ...state, rideMarkerOrigin: location })),
	setRideMarkerDestination: (location) =>
		set((state) => ({ ...state, rideMarkerDestination: location })),
}));
