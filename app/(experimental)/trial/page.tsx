// 'use client';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import {
	Form,
	FormControl,
	// FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { signUpSchema } from '@/lib/zod';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
export default async function Home() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	// const form = useForm<z.infer<typeof signUpSchema>>({
	// 	resolver: zodResolver(signUpSchema),
	// 	defaultValues: {
	// 		name: '',
	// 		email: '',
	// 		password: '',
	// 		confirmPassword: '',
	// 	},
	// });
	// function onSubmit(values: z.infer<typeof signUpSchema>) {
	// 	console.log(values);
	// }
	return (
		<main className="flex items-center justify-center grow p-8">
			<div className="flex flex-col items-center gap-4">
				<h1 className="text-7xl">Hello</h1>
				<p>You are logged in as: {session?.user?.email}</p>
				<p>You are logged in as: {session?.user?.name}</p>
				<p>You&apos;re session id is: {session?.user.id}</p>
				<p>You&apos;re session id is: {session?.user.image}</p>
				<p>You&apos;re session id is: {session?.user.phoneNumber}</p>
				<p>You&apos;re session id is: {session?.user.role}</p>
			</div>
		</main>
		// <div className="grow flex items-center justify-center p-4">
		// 	<Card className='w-[50%] max-w-md"'>
		// 		<CardHeader>Hello</CardHeader>
		// 		<CardContent>
		// 			<Form {...form}>
		// 				<form
		// 					onSubmit={form.handleSubmit(onSubmit)}
		// 					className="space-y-8"
		// 				>
		// 					<FormField
		// 						control={form.control}
		// 						name="name"
		// 						render={({ field }) => (
		// 							<FormItem>
		// 								<FormLabel>Name</FormLabel>
		// 								<FormControl>
		// 									<Input
		// 										placeholder="John Doe"
		// 										{...field}
		// 									/>
		// 								</FormControl>
		// 								{/* <FormDescription>
		// 									This is your public display name.
		// 								</FormDescription> */}
		// 								<FormMessage />
		// 							</FormItem>
		// 						)}
		// 					/>
		// 					<FormField
		// 						control={form.control}
		// 						name="email"
		// 						render={({ field }) => (
		// 							<FormItem>
		// 								<FormLabel>Email</FormLabel>
		// 								<FormControl>
		// 									<Input
		// 										type="email"
		// 										placeholder="john@example.com"
		// 										{...field}
		// 									/>
		// 								</FormControl>
		// 								{/* <FormDescription>
		// 									We'll never share your email with
		// 									anyone else.
		// 								</FormDescription> */}
		// 								<FormMessage />
		// 							</FormItem>
		// 						)}
		// 					/>
		// 					<FormField
		// 						control={form.control}
		// 						name="password"
		// 						render={({ field }) => (
		// 							<FormItem>
		// 								<FormLabel>Password</FormLabel>
		// 								<FormControl>
		// 									<Input type="password" {...field} />
		// 								</FormControl>
		// 								{/* <FormDescription>
		// 									Your password must be at least 8
		// 									characters long.
		// 								</FormDescription> */}
		// 								<FormMessage />
		// 							</FormItem>
		// 						)}
		// 					/>
		// 					<FormField
		// 						control={form.control}
		// 						name="confirmPassword"
		// 						render={({ field }) => (
		// 							<FormItem>
		// 								<FormLabel>Confirm Password</FormLabel>
		// 								<FormControl>
		// 									<Input type="password" {...field} />
		// 								</FormControl>
		// 								{/* <FormDescription>
		// 									Please confirm your password.
		// 								</FormDescription> */}
		// 								<FormMessage />
		// 							</FormItem>
		// 						)}
		// 					/>
		// 					<Button className="w-full" type="submit">
		// 						Sign Up
		// 					</Button>
		// 				</form>
		// 			</Form>
		// 		</CardContent>
		// 	</Card>
		// </div>
	);
}
