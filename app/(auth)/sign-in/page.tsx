'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import LoadingButton from '@/components/loading-button';
import { signInSchema } from '@/lib/zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import Link from 'next/link';
import { useState } from 'react';
// import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { ErrorContext } from '@better-fetch/fetch';
import { authClient } from '@/lib/auth-client';

export default function SignIn() {
	const router = useRouter();
	const { toast } = useToast();
	const [pendingCredentials, setPendingCredentials] = useState(false);

	const form = useForm<z.infer<typeof signInSchema>>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const handleCredentialsSignIn = async (
		values: z.infer<typeof signInSchema>
	) => {
		await authClient.signIn.email(
			{
				email: values.email,
				password: values.password,
			},
			{
				onRequest: () => {
					setPendingCredentials(true);
				},
				onSuccess: async () => {
					router.push('/');
					router.refresh();
				},
				onError: (ctx: ErrorContext) => {
					console.log(ctx);
					toast({
						title: 'Something went wrong',
						description:
							ctx.error.message ?? 'Something went wrong.',
						variant: 'destructive',
					});
				},
			}
		);
		setPendingCredentials(false);
	};

	return (
		<div className="grow flex items-center justify-center p-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle className="text-3xl font-bold text-center">
						Sign In
					</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(
								handleCredentialsSignIn
							)}
							className="space-y-6"
						>
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												type="email"
												placeholder="john@example.com"
												{...field}
											/>
										</FormControl>
										{/* <FormDescription>
											We'll never share your email with
											anyone else.
										</FormDescription> */}
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input
												type="password"
												placeholder="Password"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<LoadingButton pending={pendingCredentials}>
								Sign in
							</LoadingButton>
						</form>
					</Form>
					<div className="flex justify-between">
						<div className="mt-4 text-center text-sm">
							<Link
								href="/sign-up"
								className="text-primary hover:underline"
							>
								Sign up for a free account
							</Link>
						</div>
						<div className="mt-4 text-center text-sm">
							<Link
								href="/forgot-password"
								className="text-primary hover:underline"
							>
								Forgot password?
							</Link>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
