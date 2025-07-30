import { create } from 'zustand';

interface DateTime {
	date: Date;
	setDate: (time: Date) => void;
}

export const useDateTimeStore = create<DateTime>()((set) => ({
	date: new Date(),
	setDate: (time) => {
		const normalized = new Date(
			time.getFullYear(),
			time.getMonth(),
			time.getDate(),
			time.getHours(),
			time.getMinutes()
		);
		set((state) => ({ ...state, date: normalized }));
	},
}));
