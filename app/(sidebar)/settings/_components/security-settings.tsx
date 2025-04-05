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
import { toast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { AlertCircle, Smartphone } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const passwordFormSchema = z
	.object({
		currentPassword: z.string().min(8, {
			message: 'Password must be at least 8 characters.',
		}),
		newPassword: z.string().min(8, {
			message: 'Password must be at least 8 characters.',
		}),
		confirmPassword: z.string().min(8, {
			message: 'Password must be at least 8 characters.',
		}),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	});

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export default function SecuritySettings() {
	const [isLoading, setIsLoading] = useState(false);
	const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
	const [biometricEnabled, setBiometricEnabled] = useState(true);
	const [transactionConfirmation, setTransactionConfirmation] =
		useState(true);

	const form = useForm<PasswordFormValues>({
		resolver: zodResolver(passwordFormSchema),
		defaultValues: {
			currentPassword: '',
			newPassword: '',
			confirmPassword: '',
		},
		mode: 'onChange',
	});

	function onSubmit(data: PasswordFormValues) {
		setIsLoading(true);

		// Simulate API call
		setTimeout(() => {
			setIsLoading(false);
			form.reset();
			toast({
				title: 'Password updated',
				description: 'Your password has been updated successfully.',
			});
		}, 1000);
	}

	function toggleTwoFactor() {
		setTwoFactorEnabled(!twoFactorEnabled);

		toast({
			title: twoFactorEnabled
				? 'Two-factor authentication disabled'
				: 'Two-factor authentication enabled',
			description: twoFactorEnabled
				? 'Two-factor authentication has been disabled.'
				: 'Two-factor authentication has been enabled for your account.',
		});
	}

	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-medium">Security</h3>
				<p className="text-sm text-muted-foreground">
					Manage your account security and authentication settings.
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Change Password</CardTitle>
					<CardDescription>
						Update your password to keep your account secure.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-4"
						>
							<FormField
								control={form.control}
								name="currentPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Current Password</FormLabel>
										<FormControl>
											<Input
												type="password"
												placeholder="••••••••"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="newPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>New Password</FormLabel>
										<FormControl>
											<Input
												type="password"
												placeholder="••••••••"
												{...field}
											/>
										</FormControl>
										<FormDescription>
											Password must be at least 8
											characters long.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="confirmPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Confirm New Password
										</FormLabel>
										<FormControl>
											<Input
												type="password"
												placeholder="••••••••"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button type="submit" disabled={isLoading}>
								{isLoading ? 'Updating...' : 'Update Password'}
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>

			<Separator />

			<div className="space-y-4">
				<h4 className="text-sm font-medium">
					Two-Factor Authentication
				</h4>

				<div className="flex items-center justify-between">
					<div className="space-y-0.5">
						<div className="flex items-center">
							<Smartphone className="mr-2 h-4 w-4" />
							<span>Two-factor authentication</span>
						</div>
						<p className="text-sm text-muted-foreground">
							Add an extra layer of security to your account.
						</p>
					</div>
					<Switch
						checked={twoFactorEnabled}
						onCheckedChange={toggleTwoFactor}
					/>
				</div>

				{twoFactorEnabled && (
					<Alert>
						<AlertCircle className="h-4 w-4" />
						<AlertTitle>
							Two-factor authentication enabled
						</AlertTitle>
						<AlertDescription>
							Your account is now more secure. You&apos;ll need to
							enter a verification code when signing in.
						</AlertDescription>
					</Alert>
				)}
			</div>

			<Separator />

			<div className="space-y-4">
				<h4 className="text-sm font-medium">Blockchain Security</h4>

				<div className="flex items-center justify-between">
					<div className="space-y-0.5">
						<span>Transaction confirmation</span>
						<p className="text-sm text-muted-foreground">
							Require confirmation for all blockchain
							transactions.
						</p>
					</div>
					<Switch
						checked={transactionConfirmation}
						onCheckedChange={setTransactionConfirmation}
					/>
				</div>

				<div className="flex items-center justify-between">
					<div className="space-y-0.5">
						<span>Biometric authentication</span>
						<p className="text-sm text-muted-foreground">
							Use fingerprint or face recognition for wallet
							operations.
						</p>
					</div>
					<Switch
						checked={biometricEnabled}
						onCheckedChange={setBiometricEnabled}
					/>
				</div>
			</div>

			<Button
				onClick={() => {
					toast({
						title: 'Security settings saved',
						description:
							'Your security preferences have been updated.',
					});
				}}
			>
				Save Security Settings
			</Button>
		</div>
	);
}
