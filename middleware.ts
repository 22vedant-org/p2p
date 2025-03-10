import { betterFetch } from '@better-fetch/fetch';
import { NextResponse, type NextRequest } from 'next/server';
import type { Session } from '@/lib/auth';

const authRoutes = ['/sign-in', '/sign-up'];
const passwordRoutes = ['/reset-password', '/forgot-password'];
const adminRoutes = ['/admin'];
// const publicRoutes = ['/landing', '/privacy', '/about'];
const publicRoutes = ['/landing'];

export default async function authMiddleware(request: NextRequest) {
	const pathName = request.nextUrl.pathname;
	const isAuthRoute = authRoutes.includes(pathName);
	const isPasswordRoute = passwordRoutes.includes(pathName);
	const isAdminRoute = adminRoutes.includes(pathName);
	const isPublicRoute = publicRoutes.includes(pathName);

	const { data: session } = await betterFetch<Session>(
		'/api/auth/get-session',
		{
			baseURL: process.env.BETTER_AUTH_URL,
			headers: {
				//get the cookie from the request
				cookie: request.headers.get('cookie') || '',
			},
		}
	);

	if (!session) {
		if (isAuthRoute || isPasswordRoute || isPublicRoute) {
			return NextResponse.next();
		}

		const currentPath = new URL(request.url).pathname;

		if (pathName === '/' && currentPath !== '/landing') {
			return NextResponse.redirect(new URL('/landing', request.url));
		} else if (pathName !== currentPath) {
			return NextResponse.redirect(new URL(pathName, request.url));
		}
	}

	if (isAuthRoute || isPasswordRoute) {
		return NextResponse.redirect(new URL('/', request.url));
	}

	if (isAdminRoute && session?.user.role !== 'admin') {
		return NextResponse.redirect(new URL('/', request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
