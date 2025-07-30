import { create } from 'zustand';

interface totalDistanceState {
	totalDistance: number;
	setTotalDistance: (dist: number) => void;
}

export const useTotalDistanceStore = create<totalDistanceState>()((set) => ({
	totalDistance: 0,
	setTotalDistance: (dist) =>
		set((state) => ({ ...state, totalDistance: dist })),
}));
