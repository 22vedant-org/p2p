'use client';

import { useEffect, useState } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';

export function RideDetails() {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<Card className="col-span-1">
				<CardHeader>
					<CardTitle>Ride Details</CardTitle>
					<CardDescription>
						Your upcoming and recent rides
					</CardDescription>
				</CardHeader>
				<CardContent className="h-[300px] flex items-center justify-center">
					Loading ride details...
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="col-span-1 overflow-scroll">
			<CardHeader>
				<CardTitle>Ride Details</CardTitle>
				<CardDescription>
					Your upcoming and recent rides
				</CardDescription>
			</CardHeader>
			<CardContent className="h-[300px]">
				<Tabs defaultValue="upcoming">
					<TabsList className="mb-4">
						<TabsTrigger value="upcoming">Upcoming</TabsTrigger>
						<TabsTrigger value="recent">Recent</TabsTrigger>
						<TabsTrigger value="stats">Stats</TabsTrigger>
					</TabsList>
					<TabsContent value="upcoming">
						<div className="space-y-4">
							<div className="rounded-lg border p-4">
								<div className="flex justify-between items-center mb-2">
									<h3 className="font-semibold">
										Morning Commute
									</h3>
									<span className="text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 px-2 py-1 rounded-full">
										Driver
									</span>
								</div>
								<div className="space-y-2">
									<div className="flex items-center text-sm">
										<Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
										<span>Tomorrow, 8:00 AM</span>
									</div>
									<div className="flex items-center text-sm">
										<MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
										<span>Home → Downtown Office</span>
									</div>
									<div className="flex items-center text-sm">
										<Users className="h-4 w-4 mr-2 text-muted-foreground" />
										<span>2 passengers confirmed</span>
									</div>
									<div className="flex items-center text-sm">
										<span className="text-primary font-medium">
											+15 RTC
										</span>
										<span className="text-muted-foreground ml-2">
											(estimated earnings)
										</span>
									</div>
								</div>
							</div>

							<div className="rounded-lg border p-4">
								<div className="flex justify-between items-center mb-2">
									<h3 className="font-semibold">
										Weekend Trip
									</h3>
									<span className="text-sm bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 px-2 py-1 rounded-full">
										Passenger
									</span>
								</div>
								<div className="space-y-2">
									<div className="flex items-center text-sm">
										<Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
										<span>Saturday, 10:30 AM</span>
									</div>
									<div className="flex items-center text-sm">
										<MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
										<span>Downtown → Beach Resort</span>
									</div>
									<div className="flex items-center text-sm">
										<Users className="h-4 w-4 mr-2 text-muted-foreground" />
										<span>3 other passengers</span>
									</div>
									<div className="flex items-center text-sm">
										<span className="text-destructive font-medium">
											-25 RTC
										</span>
										<span className="text-muted-foreground ml-2">
											(fare)
										</span>
									</div>
								</div>
							</div>
						</div>
					</TabsContent>

					<TabsContent value="recent">
						<div className="space-y-4">
							<div className="rounded-lg border p-4 opacity-80">
								<div className="flex justify-between items-center mb-2">
									<h3 className="font-semibold">
										Evening Return
									</h3>
									<span className="text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 px-2 py-1 rounded-full">
										Driver
									</span>
								</div>
								<div className="space-y-2">
									<div className="flex items-center text-sm">
										<Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
										<span>Yesterday, 6:15 PM</span>
									</div>
									<div className="flex items-center text-sm">
										<MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
										<span>Office → Residential Area</span>
									</div>
									<div className="flex items-center text-sm">
										<Clock className="h-4 w-4 mr-2 text-muted-foreground" />
										<span>32 minutes · 18.5 km</span>
									</div>
									<div className="flex items-center text-sm">
										<span className="text-green-500 font-medium">
											+20 RTC earned
										</span>
									</div>
								</div>
							</div>

							<div className="rounded-lg border p-4 opacity-80">
								<div className="flex justify-between items-center mb-2">
									<h3 className="font-semibold">
										Morning Commute
									</h3>
									<span className="text-sm bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 px-2 py-1 rounded-full">
										Passenger
									</span>
								</div>
								<div className="space-y-2">
									<div className="flex items-center text-sm">
										<Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
										<span>Yesterday, 8:30 AM</span>
									</div>
									<div className="flex items-center text-sm">
										<MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
										<span>Home → Downtown Office</span>
									</div>
									<div className="flex items-center text-sm">
										<Clock className="h-4 w-4 mr-2 text-muted-foreground" />
										<span>28 minutes · 15.2 km</span>
									</div>
									<div className="flex items-center text-sm">
										<span className="text-red-500 font-medium">
											-15 RTC paid
										</span>
									</div>
								</div>
							</div>
						</div>
					</TabsContent>

					<TabsContent value="stats">
						<div className="space-y-4">
							<div className="h-[200px] relative">
								{/* Chart placeholder */}
								<div className="absolute inset-0 flex items-center justify-center">
									<svg
										className="h-full w-full text-muted-foreground/20"
										viewBox="0 0 100 30"
										preserveAspectRatio="none"
									>
										<path
											d="M0,30 L1,28 L2,29 L3,26 L4,25 L5,24 L6,25 L7,24 L8,22 L9,20 L10,18 L11,17 L12,16 L13,15 L14,16 L15,17 L16,16 L17,15 L18,14 L19,13 L20,14 L21,13 L22,12 L23,11 L24,10 L25,9 L26,8 L27,9 L28,8 L29,7 L30,6 L31,5 L32,6 L33,5 L34,4 L35,3 L36,4 L37,3 L38,2 L39,1 L40,2 L41,3 L42,2 L43,3 L44,4 L45,3 L46,4 L47,5 L48,4 L49,5 L50,6 L51,5 L52,6 L53,7 L54,6 L55,7 L56,8 L57,9 L58,8 L59,7 L60,8 L61,9 L62,10 L63,9 L64,8 L65,9 L66,10 L67,9 L68,10 L69,11 L70,10 L71,9 L72,10 L73,11 L74,12 L75,13 L76,12 L77,13 L78,14 L79,13 L80,12 L81,13 L82,14 L83,13 L84,14 L85,15 L86,14 L87,13 L88,12 L89,11 L90,10 L91,9 L92,8 L93,7 L94,6 L95,5 L96,4 L97,3 L98,2 L99,1 L100,0"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
										/>
									</svg>
									<div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-background to-transparent"></div>
								</div>
								<div className="absolute bottom-4 left-4 rounded-md bg-background/80 p-2 backdrop-blur">
									<div className="text-lg font-bold">
										Monthly Rides
									</div>
									<div className="text-sm text-green-500">
										+12% from last month
									</div>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4 mt-4">
								<div className="rounded-lg border p-4">
									<div className="text-sm text-muted-foreground">
										As Driver
									</div>
									<div className="text-2xl font-bold">
										28 rides
									</div>
									<div className="text-sm text-green-500">
										+245 RTC earned
									</div>
								</div>
								<div className="rounded-lg border p-4">
									<div className="text-sm text-muted-foreground">
										As Passenger
									</div>
									<div className="text-2xl font-bold">
										14 rides
									</div>
									<div className="text-sm text-red-500">
										-120 RTC spent
									</div>
								</div>
							</div>

							<div className="rounded-lg border p-4 mt-4">
								<div className="text-sm text-muted-foreground">
									Environmental Impact
								</div>
								<div className="text-2xl font-bold">
									324 kg CO₂ saved
								</div>
								<div className="text-sm">
									Equivalent to planting 16 trees
								</div>
							</div>
						</div>
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	);
}
