'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

export default function ProfileSettings() {
	const [showEmail, setShowEmail] = useState(false);

	return (
		<div className="min-h-screen bg-background p-6">
			{/* Breadcrumb */}
			<nav className="mb-6 flex items-center space-x-2 text-sm text-muted-foreground">
				<Link href="/" className="hover:text-foreground">
					Home
				</Link>
				<ChevronRight className="h-4 w-4" />
				<span className="text-foreground">Profile</span>
			</nav>

			<div className="mx-auto max-w-4xl space-y-8">
				{/* Name Section */}
				<div className="space-y-2">
					<label className="text-lg font-medium">Name</label>
					<p className="text-sm text-muted-foreground">
						This will be displayed on your public profile.
					</p>
					<Input
						placeholder="Enter your name"
						className="bg-background"
					/>
				</div>

				{/* Bio Section */}
				<div className="space-y-2">
					<label className="text-lg font-medium">Bio</label>
					<p className="text-sm text-muted-foreground">
						This will be displayed on your public profile. Maximum
						240 characters.
					</p>
					<Textarea
						placeholder="Enter your bio"
						className="min-h-[100px] bg-background"
						maxLength={240}
					/>
				</div>

				{/* Email Section */}
				<div className="space-y-2">
					<label className="text-lg font-medium">Email</label>
					<p className="text-sm text-muted-foreground">
						This is how people can contact you.
					</p>
					<Input
						type="email"
						placeholder="Enter your email"
						className="bg-background"
					/>
					<div className="flex items-center space-x-2 pt-2">
						<Switch
							checked={showEmail}
							onCheckedChange={setShowEmail}
						/>
						<label className="text-sm">
							Show email on public profile
						</label>
					</div>
				</div>

				{/* Web3 Wallets Section */}
				<div className="space-y-2">
					<label className="text-lg font-medium">
						Connected Web3 Wallets
					</label>
					<p className="text-sm text-muted-foreground">
						Manage your connected Web3 wallets.
					</p>
					<Button className="w-full bg-purple-600 hover:bg-purple-700">
						Connect Wallet
					</Button>
				</div>

				{/* Social Accounts Section */}
				<div className="space-y-4">
					<label className="text-lg font-medium">
						Connect Social Accounts
					</label>
					<p className="text-sm text-muted-foreground">
						Link your social media accounts to your profile.
					</p>
					<div className="grid gap-4 md:grid-cols-2">
						<Card className="border-border bg-background">
							<CardContent className="space-y-2 p-4">
								<label className="text-sm font-medium">
									Discord
								</label>
								<Input
									placeholder="https://discord.com/..."
									className="bg-background"
								/>
								<Button variant="secondary" className="w-full">
									Connect Discord
								</Button>
							</CardContent>
						</Card>
						<Card className="border-border bg-background">
							<CardContent className="space-y-2 p-4">
								<label className="text-sm font-medium">
									Twitter
								</label>
								<Input
									placeholder="https://twitter.com/..."
									className="bg-background"
								/>
								<Button variant="secondary" className="w-full">
									Connect Twitter
								</Button>
							</CardContent>
						</Card>
						<Card className="border-border bg-background">
							<CardContent className="space-y-2 p-4">
								<label className="text-sm font-medium">
									GitHub
								</label>
								<Input
									placeholder="https://github.com/..."
									className="bg-background"
								/>
								<Button variant="secondary" className="w-full">
									Connect GitHub
								</Button>
							</CardContent>
						</Card>
						<Card className="border-border bg-background">
							<CardContent className="space-y-2 p-4">
								<label className="text-sm font-medium">
									Instagram
								</label>
								<Input
									placeholder="https://instagram.com/..."
									className="bg-background"
								/>
								<Button
									variant="secondary"
									className="w-full text-pink-500"
								>
									Connect Instagram
								</Button>
							</CardContent>
						</Card>
					</div>
				</div>

				{/* Address Section */}
				<div className="space-y-4">
					<label className="text-lg font-medium">Address</label>
					<p className="text-sm text-muted-foreground">
						This is your registered address.
					</p>
					<div className="space-y-4">
						<Input
							placeholder="Street address"
							className="bg-background"
						/>
						<Input placeholder="City" className="bg-background" />
						<div className="grid gap-4 md:grid-cols-2">
							<Select>
								<SelectTrigger className="bg-background">
									<SelectValue placeholder="State/Province" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="ca">
										California
									</SelectItem>
									<SelectItem value="ny">New York</SelectItem>
									{/* Add more states */}
								</SelectContent>
							</Select>
							<Input
								placeholder="Enter zip code"
								className="bg-background"
							/>
						</div>
						<Select>
							<SelectTrigger className="bg-background">
								<SelectValue placeholder="Country" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="us">
									United States
								</SelectItem>
								<SelectItem value="ca">Canada</SelectItem>
								{/* Add more countries */}
							</SelectContent>
						</Select>
					</div>
				</div>

				{/* Currency Section */}
				<div className="space-y-2">
					<label className="text-lg font-medium">Currency</label>
					<p className="text-sm text-muted-foreground">
						The currency that you will be using.
					</p>
					<Select>
						<SelectTrigger className="bg-background">
							<SelectValue placeholder="Select currency" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="usd">USD - US Dollar</SelectItem>
							<SelectItem value="eur">EUR - Euro</SelectItem>
							<SelectItem value="gbp">
								GBP - British Pound
							</SelectItem>
							{/* Add more currencies */}
						</SelectContent>
					</Select>
				</div>

				{/* Save Button */}
				<div className="flex justify-end pt-6">
					<Button className="bg-purple-600 hover:bg-purple-700">
						Save changes
					</Button>
				</div>
			</div>
		</div>
	);
}
