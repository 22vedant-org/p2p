import { create } from 'zustand';

interface Location {
	locationAName: string;
	setLocationA: (name: string) => void;
	locationBName: string;
	setLocationB: (name: string) => void;
}

export const usePlaceStore = create<Location>()((set) => ({
	locationAName: '',
	setLocationA: (name) => set((state) => ({ ...state, locationAName: name })),
	locationBName: '',
	setLocationB: (name) => set((state) => ({ ...state, locationBName: name })),
}));
