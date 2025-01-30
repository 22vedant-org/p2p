'use client';

import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
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

import Link from 'next/link';

import { signUpSchema } from '@/lib/zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authClient } from '@/lib/auth-client';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function SignUp() {
	const [pending, setPending] = useState(false);
	const { toast } = useToast();

	const form = useForm<z.infer<typeof signUpSchema>>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			name: '',
			email: '',
			password: '',
			confirmPassword: '',
		},
	});

	const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
		await authClient.signUp.email(
			{
				email: values.email!,
				password: values.password!,
				name: values.name!,
			},
			{
				onRequest: () => {
					setPending(true);
				},
				onSuccess: () => {
					toast({
						title: 'Account created',
						description:
							'Your account has been created. Check your email for a verification link.',
					});
				},
				onError: (ctx) => {
					console.log('error', ctx);
					toast({
						title: 'Something went wrong',
						description:
							ctx.error.message ?? 'Something went wrong.',
					});
				},
			}
		);
		setPending(false);
	};

	return (
		<div className="grow flex items-center justify-center p-4">
			<Card className='w-[50%] max-w-md"'>
				<CardHeader>
					<h2 className="text-2xl font-bold text-center">
						Create Account
					</h2>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-8"
						>
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input
												placeholder="John Doe"
												{...field}
											/>
										</FormControl>
										{/* <FormDescription>
											This is your public display name.
										</FormDescription> */}
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
										{/* <FormDescription>
											Your password must be at least 8
											characters long.
										</FormDescription> */}
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="confirmPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Confirm Password</FormLabel>
										<FormControl>
											<Input
												type="password"
												placeholder="Confirm Password"
												{...field}
											/>
										</FormControl>
										{/* <FormDescription>
											Please confirm your password.
										</FormDescription> */}
										<FormMessage />
									</FormItem>
								)}
							/>
							<LoadingButton pending={pending}>
								Sign Up
							</LoadingButton>
						</form>
					</Form>
					<div className="mt-4 text-center text-sm">
						<Link
							href="/sign-in"
							className="text-primary hover:underline"
						>
							Already have an account?
						</Link>
					</div>
				</CardContent>
				{/* <CardFooter className="text-center">
					<Link href={'/sign-in'}>Already have an account? </Link>
				</CardFooter> */}
			</Card>
		</div>
	);
}
