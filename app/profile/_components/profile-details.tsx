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
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';

import { useForm } from 'react-hook-form';
import { profileSchema } from '../_lib/zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
function onSubmit() {
	console.log('Hello for now');
}

export default function ProfileSettings() {
	const form = useForm<z.infer<typeof profileSchema>>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			name: '',
			image: '',
			phone: '',
			role: 'Rider',
			company: '',
		},
	});
	return (
		<div className="min-h-screen p-6">
			<div className="mx-auto max-w-6xl px-4 py-8 w-full">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<div className="gap-6 grid grid-cols-1 md:grid-cols-3">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input
												placeholder={`John`}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="gap-6 grid grid-cols-1 md:grid-cols-3">
							<FormField
								control={form.control}
								name="image"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Bio</FormLabel>
										<FormControl>
											<Textarea
												placeholder={`John`}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="gap-6 grid grid-cols-1 md:grid-cols-3">
							<FormField
								control={form.control}
								name="phone"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Phone Number</FormLabel>
										<FormControl>
											<Input
												placeholder={`John`}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="gap-6 grid grid-cols-1 md:grid-cols-3">
							<FormField
								control={form.control}
								name="role"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Role</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												{/* <Input
												placeholder={`John`}
												{...field}
											/> */}
												<SelectTrigger>
													<SelectValue
														placeholder={`Select a Role`}
													/>
												</SelectTrigger>
											</FormControl>

											<SelectContent>
												<SelectItem value="Driver">
													Driver
												</SelectItem>
												<SelectItem value="Rider">
													Rider
												</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="gap-6 grid grid-cols-1 md:grid-cols-3">
							<FormField
								control={form.control}
								name="phone"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Phone Number</FormLabel>
										<FormControl>
											<Input
												placeholder={`John`}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<Button>Submit</Button>
					</form>
				</Form>
			</div>
		</div>
	);
}

//     {/* Name Section */}
//     <div className="space-y-2">
// 	<label className="text-lg font-medium">Name</label>
// 	<p className="text-sm text-muted-foreground">
// 		This will be displayed on your public profile.
// 	</p>
// 	<Input
// 		placeholder="Enter your name"
// 		className="bg-background"
// 	/>
// </div>

// {/* Bio Section */}
// <div className="space-y-2">
// 	<label className="text-lg font-medium">Bio</label>
// 	<p className="text-sm text-muted-foreground">
// 		This will be displayed on your public profile. Maximum
// 		240 characters.
// 	</p>
// 	<Textarea
// 		placeholder="Enter your bio"
// 		className="min-h-[100px] bg-background"
// 		maxLength={240}
// 	/>
// </div>

// {/* Email Section */}
// <div className="space-y-2">
// 	<label className="text-lg font-medium">Email</label>
// 	<p className="text-sm text-muted-foreground">
// 		This is how people can contact you.
// 	</p>
// 	<Input
// 		type="email"
// 		placeholder="Enter your email"
// 		className="bg-background"
// 	/>
// 	<div className="flex items-center space-x-2 pt-2">
// 		<Switch
// 			checked={showEmail}
// 			onCheckedChange={setShowEmail}
// 		/>
// 		<label className="text-sm">
// 			Show email on public profile
// 		</label>
// 	</div>
// </div>

// {/* Web3 Wallets Section */}
// <div className="space-y-2">
// 	<label className="text-lg font-medium">
// 		Connected Web3 Wallets
// 	</label>
// 	<p className="text-sm text-muted-foreground">
// 		Manage your connected Web3 wallets.
// 	</p>
// 	<Button className="w-full bg-purple-600 hover:bg-purple-700">
// 		Connect Wallet
// 	</Button>
// </div>

// {/* Social Accounts Section */}
// <div className="space-y-4">
// 	<label className="text-lg font-medium">
// 		Connect Social Accounts
// 	</label>
// 	<p className="text-sm text-muted-foreground">
// 		Link your social media accounts to your profile.
// 	</p>
// 	<div className="grid gap-4 md:grid-cols-2">
// 		<Card className="border-border bg-background">
// 			<CardContent className="space-y-2 p-4">
// 				<label className="text-sm font-medium">
// 					Discord
// 				</label>
// 				<Input
// 					placeholder="https://discord.com/..."
// 					className="bg-background"
// 				/>
// 				<Button variant="secondary" className="w-full">
// 					Connect Discord
// 				</Button>
// 			</CardContent>
// 		</Card>
// 		<Card className="border-border bg-background">
// 			<CardContent className="space-y-2 p-4">
// 				<label className="text-sm font-medium">
// 					Twitter
// 				</label>
// 				<Input
// 					placeholder="https://twitter.com/..."
// 					className="bg-background"
// 				/>
// 				<Button variant="secondary" className="w-full">
// 					Connect Twitter
// 				</Button>
// 			</CardContent>
// 		</Card>
// 		<Card className="border-border bg-background">
// 			<CardContent className="space-y-2 p-4">
// 				<label className="text-sm font-medium">
// 					GitHub
// 				</label>
// 				<Input
// 					placeholder="https://github.com/..."
// 					className="bg-background"
// 				/>
// 				<Button variant="secondary" className="w-full">
// 					Connect GitHub
// 				</Button>
// 			</CardContent>
// 		</Card>
// 		<Card className="border-border bg-background">
// 			<CardContent className="space-y-2 p-4">
// 				<label className="text-sm font-medium">
// 					Instagram
// 				</label>
// 				<Input
// 					placeholder="https://instagram.com/..."
// 					className="bg-background"
// 				/>
// 				<Button
// 					variant="secondary"
// 					className="w-full text-pink-500"
// 				>
// 					Connect Instagram
// 				</Button>
// 			</CardContent>
// 		</Card>
// 	</div>
// </div>

// {/* Address Section */}
// <div className="space-y-4">
// 	<label className="text-lg font-medium">Address</label>
// 	<p className="text-sm text-muted-foreground">
// 		This is your registered address.
// 	</p>
// 	<div className="space-y-4">
// 		<Input
// 			placeholder="Street address"
// 			className="bg-background"
// 		/>
// 		<Input placeholder="City" className="bg-background" />
// 		<div className="grid gap-4 md:grid-cols-2">
// 			<Select>
// 				<SelectTrigger className="bg-background">
// 					<SelectValue placeholder="State/Province" />
// 				</SelectTrigger>
// 				<SelectContent>
// 					<SelectItem value="ca">
// 						California
// 					</SelectItem>
// 					<SelectItem value="ny">New York</SelectItem>
// 					{/* Add more states */}
// 				</SelectContent>
// 			</Select>
// 			<Input
// 				placeholder="Enter zip code"
// 				className="bg-background"
// 			/>
// 		</div>
// 		<Select>
// 			<SelectTrigger className="bg-background">
// 				<SelectValue placeholder="Country" />
// 			</SelectTrigger>
// 			<SelectContent>
// 				<SelectItem value="us">
// 					United States
// 				</SelectItem>
// 				<SelectItem value="ca">Canada</SelectItem>
// 				{/* Add more countries */}
// 			</SelectContent>
// 		</Select>
// 	</div>
// </div>

// {/* Currency Section */}
// <div className="space-y-2">
// 	<label className="text-lg font-medium">Currency</label>
// 	<p className="text-sm text-muted-foreground">
// 		The currency that you will be using.
// 	</p>
// 	<Select>
// 		<SelectTrigger className="bg-background">
// 			<SelectValue placeholder="Select currency" />
// 		</SelectTrigger>
// 		<SelectContent>
// 			<SelectItem value="usd">USD - US Dollar</SelectItem>
// 			<SelectItem value="eur">EUR - Euro</SelectItem>
// 			<SelectItem value="gbp">
// 				GBP - British Pound
// 			</SelectItem>
// 			{/* Add more currencies */}
// 		</SelectContent>
// 	</Select>
// </div>

// {/* Save Button */}
// <div className="flex justify-end pt-6">
// 	<Button className="bg-purple-600 hover:bg-purple-700">
// 		Save changes
// 	</Button>
// </div>
