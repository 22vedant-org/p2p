import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Session } from '@/lib/auth';
// interface SessionState extends Session {
// 	setSession: (session: Session) => void;
// 	// clearSession: () => void;
// }

interface SessionState {
	session1: Session | null;
	setSession: (session: Session) => void;
}

export const useSessionStateStore = create<SessionState>()((set) => ({
	session1: null,
	// loadSession: () => {
	// 	const storedSession = sessionStorage.getItem(
	// 		'better-auth.session_token'
	// 	);
	// 	if (storedSession) {
	// 		const parsedSession: Session = JSON.parse(storedSession);
	// 		set({ session: parsedSession });
	// 	}
	// },
	setSession: (session1) => {
		set({ session1 });
	},
}));

// export const useSessionStateStore = create<SessionState>()(
// 	persist(
// 		(set) => ({
// 			session: {
// 				id: '',
// 				createdAt: new Date(),
// 				updatedAt: new Date(),
// 				userId: '',
// 				expiresAt: new Date(),
// 				token: '',
// 				ipAddress: null,
// 				userAgent: null,
// 			},
// 			user: {
// 				email: '',
// 				emailVerified: false,
// 				id: '',
// 				image: null,
// 				name: '',
// 				createdAt: new Date(),
// 				updatedAt: new Date(),
// 			},
// 			setSession: (session) =>
// 				set({
// 					...session,
// 				}),
// 			// clearSession: () => set({
// 			//     session: {
// 			//         id: "",
// 			//         createdAt: new Date(),
// 			//         updatedAt: new Date(),
// 			//         userId: "",
// 			//         expiresAt: new Date(),
// 			//         token: "",
// 			//         ipAddress: null,
// 			//         userAgent: null,
// 			//       },
// 			//       user: {
// 			//         email: '',
// 			//         emailVerified: false,
// 			//         id: '',
// 			//         image: null,
// 			//         name: '',
// 			//         createdAt: new Date(),
// 			//         updatedAt: new Date(),
// 			//     },
// 			// }),
// 		}),
// 		{
// 			name: 'session-storage',
// 			storage: createJSONStorage(() => sessionStorage),
// 		}
// 	)
// );
