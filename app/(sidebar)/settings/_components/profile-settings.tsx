'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Send, Upload } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import axios from 'axios';

const profileFormSchema = z.object({
	name: z.string().min(2, {
		message: 'Name must be at least 2 characters.',
	}),
	email: z.string().email({
		message: 'Please enter a valid email address.',
	}),
	phone: z
		.string()
		.min(10, {
			message: 'Please enter a valid phone number.',
		})
		.optional(),
	bio: z.string().max(160).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// This can come from your database or API

export default function ProfileSettings() {
	const [isLoading, setIsLoading] = useState(false);
	const [file, setFile] = useState<File>();
	const [url, setUrl] = useState('');
	const [uploading, setUploading] = useState(false);

	const { data } = authClient.useSession();
	const session = data;
	const defaultValues: Partial<ProfileFormValues> = {
		name: session?.user.name,
		email: session?.user.email,
		phone: '555-123-4567',
		bio: 'Regular commuter between downtown and the tech district.',
	};
	const form = useForm<ProfileFormValues>({
		resolver: zodResolver(profileFormSchema),
		// defaultValues,
		mode: 'onChange',
	});

	function onSubmit(data: ProfileFormValues) {
		setIsLoading(true);

		// Simulate API call

		setTimeout(() => {
			setIsLoading(false);
			toast({
				title: 'Profile updated',
				description:
					'Your profile information has been updated successfully.',
			});
		}, 1000);
	}

	const onFormData = async (data: ProfileFormValues) => {};

	const uploadFile = async () => {
		try {
			if (!file) {
				alert('No file selected');
				return;
			}

			setUploading(true);
			const data = new FormData();
			data.set('file', file);
			const uploadRequest = await fetch('/api/files', {
				method: 'POST',
				body: data,
			});
			const ipfsUrl = await uploadRequest.json();
			setUrl(ipfsUrl);

			setUploading(false);
		} catch (e) {
			console.log(e);
			setUploading(false);
			alert('Trouble uploading file');
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFile(e.target?.files?.[0]);
	};

	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-medium">Profile</h3>
				<p className="text-sm text-muted-foreground">
					Update your personal information and how others see you on
					the platform.
				</p>
			</div>

			<div className="flex items-center gap-6">
				<Avatar className="h-24 w-24">
					<AvatarImage src={session?.user.image!} alt="Profile" />
					<input
						type="file"
						className="absolute inset-0 opacity-0 cursor-pointer"
						accept="image/*"
						onChange={handleChange}
					/>
					<AvatarFallback>{session?.user.name[0]}</AvatarFallback>
				</Avatar>
				<div>
					{/* <Button variant="outline" size="sm" className="relative">
						Change Avatar
						</Button> */}
					<div className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-8 rounded-md px-3 text-xs relative">
						<Camera className="mr-2 h-4 w-4" />
						Change Avatar
					</div>
					<p className="mt-2 text-xs text-muted-foreground">
						JPG or PNG. 10MB max.
					</p>
					<Button
						variant="outline"
						size="sm"
						className="relative mt-2"
						onClick={uploadFile}
					>
						{/* <Send className="mr-2 h-4 w-4" /> */}
						<Upload className="mr-2 h-4 w-4" />
						Submit
					</Button>
				</div>
			</div>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-6"
				>
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input placeholder="Your name" {...field} />
								</FormControl>
								<FormDescription>
									This is your public display name.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										placeholder="email@example.com"
										{...field}
									/>
								</FormControl>
								<FormDescription>
									We&apos;ll use this for important
									notifications.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="phone"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Phone Number</FormLabel>
								<FormControl>
									<Input
										placeholder="555-123-4567"
										{...field}
									/>
								</FormControl>
								<FormDescription>
									For ride coordination and verification.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="bio"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Bio</FormLabel>
								<FormControl>
									<Textarea
										placeholder="Tell us a little about yourself"
										className="resize-none"
										{...field}
									/>
								</FormControl>
								<FormDescription>
									Brief description for your profile. Max 160
									characters.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit" disabled={isLoading}>
						{isLoading ? 'Saving...' : 'Save Changes'}
					</Button>
				</form>
			</Form>
		</div>
	);
}
