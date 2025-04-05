import { create } from 'zustand';

interface DateTime {
	date: Date;
	setDate: (time: Date) => void;
}

export const useDateTimeStore = create<DateTime>()((set) => ({
	date: new Date(),
	setDate: (time) => set((state) => ({ ...state, date: time })),
}));
