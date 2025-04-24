import { create } from 'zustand';
interface polyLineProps {
	polyCords: [number, number][];
	setPolyCords: (coords: [number, number][]) => void;
}

export const usePolyLineStore = create<polyLineProps>()((set) => ({
	polyCords: [],
	setPolyCords: (coords: [number, number][]) =>
		set((state) => ({ ...state, polyCords: coords })),
}));
