'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import ProfileSettings from './profile-settings';
import WalletSettings from './wallet-settings';
import NotificationSettings from './notification-settings';
import SecuritySettings from './security-settings';
import RidePreferences from './ride-preferences';

export default function SettingsLayout() {
	const [activeTab, setActiveTab] = useState('profile');

	return (
		<div className="px-3">
			<div className="mb-2">
				<h1 className="text-3xl font-bold tracking-tight">Settings</h1>
				<p className="text-muted-foreground">
					Manage your account settings and preferences.
				</p>
			</div>

			<Tabs
				defaultValue="profile"
				value={activeTab}
				onValueChange={setActiveTab}
				className="space-y-4"
			>
				<TabsList className="grid w-full grid-cols-5">
					<TabsTrigger value="profile">Profile</TabsTrigger>
					<TabsTrigger value="wallet">Wallet</TabsTrigger>
					<TabsTrigger value="notifications">
						Notifications
					</TabsTrigger>
					<TabsTrigger value="security">Security</TabsTrigger>
					<TabsTrigger value="preferences">
						Ride Preferences
					</TabsTrigger>
				</TabsList>

				<Card>
					<TabsContent value="profile" className="p-6">
						<ProfileSettings />
					</TabsContent>

					<TabsContent value="wallet" className="p-6">
						<WalletSettings />
					</TabsContent>

					<TabsContent value="notifications" className="p-6">
						<NotificationSettings />
					</TabsContent>

					<TabsContent value="security" className="p-6">
						<SecuritySettings />
					</TabsContent>

					<TabsContent value="preferences" className="p-6">
						<RidePreferences />
					</TabsContent>
				</Card>
			</Tabs>
		</div>
	);
}
