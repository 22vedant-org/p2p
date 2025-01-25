// import { PrismaClient } from '@prisma/client';

// const prismaClientSingleton = () => {
// 	return new PrismaClient();
// };

// declare const globalThis: {
// 	prismaGlobal: ReturnType<typeof prismaClientSingleton>;
// } & typeof global;

// const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

// export default prisma;

// // Ensure the prisma instance is reused across hot reloads in development
// if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;

import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
	prisma = new PrismaClient();
} else {
	if (!(global as any).prisma) {
		(global as any).prisma = new PrismaClient();
	}
	prisma = (global as any).prisma;
}

export default prisma as PrismaClient;
