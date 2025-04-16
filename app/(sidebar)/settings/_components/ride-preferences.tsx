/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Car,
	Clock,
	MapPin,
	Music,
	CigaretteIcon as Smoking,
	Star,
	Users,
	ShieldUser,
} from 'lucide-react';

export default function RidePreferences() {
	const [isLoading, setIsLoading] = useState(false);
	const [preferences, setPreferences] = useState({
		maxDistance: 5,
		minRating: 4,
		allowSmoking: false,
		allowMusic: true,
		maxPassengers: 3,
		paymentMethod: 'crypto',
		preferredNetwork: 'ethereum',
		saveFrequentRoutes: true,
		autoMatchRides: true,
		carbonOffsetting: true,
		womenOnly: false,
	});

	function onSubmit() {
		setIsLoading(true);

		// Simulate API call
		setTimeout(() => {
			setIsLoading(false);
			toast({
				title: 'Ride preferences updated',
				description:
					'Your ride preferences have been saved successfully.',
			});
		}, 1000);
	}

	function updatePreference(key: keyof typeof preferences, value: any) {
		setPreferences({
			...preferences,
			[key]: value,
		});
	}

	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-medium">Ride Preferences</h3>
				<p className="text-sm text-muted-foreground">
					Customize your carpooling experience.
				</p>
			</div>

			<div className="space-y-4">
				<div className="space-y-2">
					<div className="flex items-center">
						<MapPin className="mr-2 h-4 w-4" />
						<Label>Maximum pickup distance (miles)</Label>
					</div>
					<Slider
						value={[preferences.maxDistance]}
						min={1}
						max={10}
						step={1}
						onValueChange={(value) =>
							updatePreference('maxDistance', value[0])
						}
						className="w-full"
					/>
					<p className="text-sm text-muted-foreground">
						Current: {preferences.maxDistance} miles
					</p>
				</div>

				<div className="space-y-2">
					<div className="flex items-center">
						<Star className="mr-2 h-4 w-4" />
						<Label>Minimum driver rating</Label>
					</div>
					<Slider
						value={[preferences.minRating]}
						min={1}
						max={5}
						step={0.5}
						onValueChange={(value) =>
							updatePreference('minRating', value[0])
						}
						className="w-full"
					/>
					<p className="text-sm text-muted-foreground">
						Current: {preferences.minRating} stars
					</p>
				</div>
			</div>

			<Separator />

			<div className="space-y-4">
				<h4 className="text-sm font-medium">Ride Environment</h4>

				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-2">
						<Smoking className="h-4 w-4" />
						<Label>Allow smoking</Label>
					</div>
					<Switch
						checked={preferences.allowSmoking}
						onCheckedChange={(value) =>
							updatePreference('allowSmoking', value)
						}
					/>
				</div>

				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-2">
						<Music className="h-4 w-4" />
						<Label>Allow music</Label>
					</div>
					<Switch
						checked={preferences.allowMusic}
						onCheckedChange={(value) =>
							updatePreference('allowMusic', value)
						}
					/>
				</div>

				<div className="space-y-2">
					<div className="flex items-center space-x-2">
						<Users className="h-4 w-4" />
						<Label>Maximum passengers</Label>
					</div>
					<Select
						value={preferences.maxPassengers.toString()}
						onValueChange={(value) =>
							updatePreference(
								'maxPassengers',
								Number.parseInt(value)
							)
						}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Select maximum passengers" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="1">1 passenger</SelectItem>
							<SelectItem value="2">2 passengers</SelectItem>
							<SelectItem value="3">3 passengers</SelectItem>
							<SelectItem value="4">4 passengers</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<Separator />

			<div className="space-y-4">
				<h4 className="text-sm font-medium">Payment Preferences</h4>

				<div className="space-y-2">
					<Label>Preferred payment method</Label>
					<RadioGroup
						value={preferences.paymentMethod}
						onValueChange={(value) =>
							updatePreference('paymentMethod', value)
						}
						className="flex flex-col space-y-1"
					>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="crypto" id="crypto" />
							<Label htmlFor="crypto">
								Cryptocurrency (blockchain)
							</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="fiat" id="fiat" />
							<Label htmlFor="fiat">
								Traditional payment (credit card)
							</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="both" id="both" />
							<Label htmlFor="both">Both options</Label>
						</div>
					</RadioGroup>
				</div>

				{(preferences.paymentMethod === 'crypto' ||
					preferences.paymentMethod === 'both') && (
					<div className="space-y-2">
						<Label>Preferred blockchain network</Label>
						<Select
							value={preferences.preferredNetwork}
							onValueChange={(value) =>
								updatePreference('preferredNetwork', value)
							}
						>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Select network" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="ethereum">
									Ethereum
								</SelectItem>
								<SelectItem value="polygon">Polygon</SelectItem>
								<SelectItem value="optimism">
									Optimism
								</SelectItem>
								<SelectItem value="arbitrum">
									Arbitrum
								</SelectItem>
							</SelectContent>
						</Select>
					</div>
				)}
			</div>

			<Separator />

			<div className="space-y-4">
				<h4 className="text-sm font-medium">Additional Preferences</h4>

				<div className="flex items-center justify-between">
					<div className="space-y-0.5">
						<div className="flex items-center">
							<MapPin className="mr-2 h-4 w-4" />
							<span>Save frequent routes</span>
						</div>
						<p className="text-sm text-muted-foreground">
							Remember your frequent routes for faster booking.
						</p>
					</div>
					<Switch
						checked={preferences.saveFrequentRoutes}
						onCheckedChange={(value) =>
							updatePreference('saveFrequentRoutes', value)
						}
					/>
				</div>

				<div className="flex items-center justify-between">
					<div className="space-y-0.5">
						<div className="flex items-center">
							<Clock className="mr-2 h-4 w-4" />
							<span>Auto-match rides</span>
						</div>
						<p className="text-sm text-muted-foreground">
							Automatically match you with compatible rides.
						</p>
					</div>
					<Switch
						checked={preferences.autoMatchRides}
						onCheckedChange={(value) =>
							updatePreference('autoMatchRides', value)
						}
					/>
				</div>

				<div className="flex items-center justify-between">
					<div className="space-y-0.5">
						<div className="flex items-center">
							<Car className="mr-2 h-4 w-4" />
							<span>Carbon offsetting</span>
						</div>
						<p className="text-sm text-muted-foreground">
							Automatically offset carbon emissions from your
							rides.
						</p>
					</div>
					<Switch
						checked={preferences.carbonOffsetting}
						onCheckedChange={(value) =>
							updatePreference('carbonOffsetting', value)
						}
					/>
				</div>
				<div className="flex items-center justify-between">
					<div className="space-y-0.5">
						<div className="flex items-center">
							{/* <Car className="mr-2 h-4 w-4" /> */}
							<ShieldUser className="mr-2 h-4 w-4" />
							<span>Women Only Ride Option</span>
						</div>
						<p className="text-sm text-muted-foreground">
							Choose a female-driven cab for a comfortable, safe,
							and supportive travel experience.
						</p>
					</div>
					<Switch
						checked={preferences.womenOnly}
						onCheckedChange={(value) =>
							updatePreference('womenOnly', value)
						}
					/>
				</div>
			</div>

			<Button onClick={onSubmit} disabled={isLoading}>
				{isLoading ? 'Saving...' : 'Save Preferences'}
			</Button>
		</div>
	);
}
