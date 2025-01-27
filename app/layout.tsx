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

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					{/* <Topbar /> */}
					<AppWalletProvider>
						<SidebarProvider>
							<AppSidebar />
							<SidebarInset>
								<Topbar>
									{/* <SidebarTrigger className="absolute top-[12px] -left-[10px]"></SidebarTrigger> */}
								</Topbar>
								<main>
									{children}
									<Toaster />
								</main>
							</SidebarInset>
						</SidebarProvider>
					</AppWalletProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
