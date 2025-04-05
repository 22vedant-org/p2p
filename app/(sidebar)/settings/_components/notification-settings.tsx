'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

export default function NotificationSettings() {
	const [isLoading, setIsLoading] = useState(false);
	const [notifications, setNotifications] = useState({
		rideUpdates: true,
		paymentNotifications: true,
		promotionalEmails: false,
		rideRequests: true,
		driverArrival: true,
		systemUpdates: true,
		newDrivers: false,
		rideCompletion: true,
		carbonCredits: true,
	});

	const [preferredChannel, setPreferredChannel] = useState('both');

	function onSubmit() {
		setIsLoading(true);

		// Simulate API call
		setTimeout(() => {
			setIsLoading(false);
			toast({
				title: 'Notification preferences updated',
				description:
					'Your notification settings have been saved successfully.',
			});
		}, 1000);
	}

	function toggleNotification(key: keyof typeof notifications) {
		setNotifications({
			...notifications,
			[key]: !notifications[key],
		});
	}

	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-medium">
					Notification Preferences
				</h3>
				<p className="text-sm text-muted-foreground">
					Choose how and when you want to be notified.
				</p>
			</div>

			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<Label htmlFor="preferred-channel">
						Preferred notification channel
					</Label>
					<Select
						value={preferredChannel}
						onValueChange={setPreferredChannel}
					>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Select channel" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="email">Email only</SelectItem>
							<SelectItem value="push">
								Push notifications only
							</SelectItem>
							<SelectItem value="both">
								Both email and push
							</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<Separator />

			<div className="space-y-4">
				<h4 className="text-sm font-medium">Ride Notifications</h4>

				<div className="flex items-center justify-between">
					<div className="space-y-0.5">
						<Label htmlFor="ride-updates">Ride updates</Label>
						<p className="text-sm text-muted-foreground">
							Receive notifications about changes to your
							scheduled rides.
						</p>
					</div>
					<Switch
						id="ride-updates"
						checked={notifications.rideUpdates}
						onCheckedChange={() =>
							toggleNotification('rideUpdates')
						}
					/>
				</div>

				<div className="flex items-center justify-between">
					<div className="space-y-0.5">
						<Label htmlFor="ride-requests">Ride requests</Label>
						<p className="text-sm text-muted-foreground">
							Get notified when someone requests to join your
							ride.
						</p>
					</div>
					<Switch
						id="ride-requests"
						checked={notifications.rideRequests}
						onCheckedChange={() =>
							toggleNotification('rideRequests')
						}
					/>
				</div>

				<div className="flex items-center justify-between">
					<div className="space-y-0.5">
						<Label htmlFor="driver-arrival">Driver arrival</Label>
						<p className="text-sm text-muted-foreground">
							Get notified when your driver is approaching.
						</p>
					</div>
					<Switch
						id="driver-arrival"
						checked={notifications.driverArrival}
						onCheckedChange={() =>
							toggleNotification('driverArrival')
						}
					/>
				</div>

				<div className="flex items-center justify-between">
					<div className="space-y-0.5">
						<Label htmlFor="ride-completion">Ride completion</Label>
						<p className="text-sm text-muted-foreground">
							Receive a summary after your ride is completed.
						</p>
					</div>
					<Switch
						id="ride-completion"
						checked={notifications.rideCompletion}
						onCheckedChange={() =>
							toggleNotification('rideCompletion')
						}
					/>
				</div>
			</div>

			<Separator />

			<div className="space-y-4">
				<h4 className="text-sm font-medium">Payment & Rewards</h4>

				<div className="flex items-center justify-between">
					<div className="space-y-0.5">
						<Label htmlFor="payment-notifications">
							Payment notifications
						</Label>
						<p className="text-sm text-muted-foreground">
							Get notified about payments and transactions.
						</p>
					</div>
					<Switch
						id="payment-notifications"
						checked={notifications.paymentNotifications}
						onCheckedChange={() =>
							toggleNotification('paymentNotifications')
						}
					/>
				</div>

				<div className="flex items-center justify-between">
					<div className="space-y-0.5">
						<Label htmlFor="carbon-credits">Carbon credits</Label>
						<p className="text-sm text-muted-foreground">
							Receive updates about carbon credits earned from
							carpooling.
						</p>
					</div>
					<Switch
						id="carbon-credits"
						checked={notifications.carbonCredits}
						onCheckedChange={() =>
							toggleNotification('carbonCredits')
						}
					/>
				</div>
			</div>

			<Separator />

			<div className="space-y-4">
				<h4 className="text-sm font-medium">Platform Updates</h4>

				<div className="flex items-center justify-between">
					<div className="space-y-0.5">
						<Label htmlFor="system-updates">System updates</Label>
						<p className="text-sm text-muted-foreground">
							Important updates about the platform and service
							changes.
						</p>
					</div>
					<Switch
						id="system-updates"
						checked={notifications.systemUpdates}
						onCheckedChange={() =>
							toggleNotification('systemUpdates')
						}
					/>
				</div>

				<div className="flex items-center justify-between">
					<div className="space-y-0.5">
						<Label htmlFor="new-drivers">
							New drivers in your area
						</Label>
						<p className="text-sm text-muted-foreground">
							Get notified when new drivers join in your frequent
							routes.
						</p>
					</div>
					<Switch
						id="new-drivers"
						checked={notifications.newDrivers}
						onCheckedChange={() => toggleNotification('newDrivers')}
					/>
				</div>

				<div className="flex items-center justify-between">
					<div className="space-y-0.5">
						<Label htmlFor="promotional-emails">
							Promotional emails
						</Label>
						<p className="text-sm text-muted-foreground">
							Receive special offers, promotions and news.
						</p>
					</div>
					<Switch
						id="promotional-emails"
						checked={notifications.promotionalEmails}
						onCheckedChange={() =>
							toggleNotification('promotionalEmails')
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
