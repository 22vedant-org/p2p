import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Topbar from '@/components/Topbar';
import ThemeProvider from '@/components/theme-provider';
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import AppWalletProvider from '@/components/AppWalletProvider';
import { Toaster } from '@/components/ui/toaster';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import TopbarPrior from '@/components/TopbarPrior';
const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Create Next App',
	description: 'Generated by create next app',
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	console.log(session);

	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				{session ? (
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<AppWalletProvider>
							<SidebarProvider>
								<AppSidebar />
								<SidebarInset>
									<Topbar session={session} />
									<main>
										{children}
										<Toaster />
									</main>
								</SidebarInset>
							</SidebarProvider>
						</AppWalletProvider>
					</ThemeProvider>
				) : (
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<div>
							<TopbarPrior />
							<main>
								{children}
								<Toaster />
							</main>
						</div>
					</ThemeProvider>
				)}
			</body>
		</html>
	);
}
