import { create } from 'zustand';

interface MarkerPositionsState {
	markerOrigin: { lng: number; lat: number };
	markerDestination: { lng: number; lat: number };
	setMarkerOrigin: (location: { lng: number; lat: number }) => void;
	setMarkerDestination: (location: { lng: number; lat: number }) => void;
}

export const useMarkerPositionsStore = create<MarkerPositionsState>()(
	(set) => ({
		markerOrigin: {
			lng: 73.84746,
			lat: 18.530823,
		},
		markerDestination: {
			lng: 73.847466,
			lat: 18.5823,
		},
		setMarkerOrigin: (location) =>
			set((state) => ({ ...state, markerOrigin: location })),
		setMarkerDestination: (location) =>
			set((state) => ({ ...state, markerDestination: location })),
	})
);
