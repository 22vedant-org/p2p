import { betterAuth, BetterAuthOptions } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { openAPI } from 'better-auth/plugins';
// import { sendEmail } from '@/app/actions/email';
import { sendEmail } from '@/app/actions/resend-email';
import { Resend } from 'resend';
import { PrismaClient } from '@prisma/client';
import prisma from './prisma';

// const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: 'postgresql',
	}),
	user: {
		additionalFields: {
			role: {
				type: 'string',
				required: false,
				defaultValue: 'rider',
				input: false,
			},
			phoneNumber: {
				type: 'string',
				required: false,
			},
			companyName: {
				type: 'string',
				required: false,
			},
			banned: {
				type: 'boolean',
				required: false,
				defaultValue: false,
				input: false,
			},
			bio: {
				type: 'string',
				required: false,
			},
			gender: {
				type: 'string',
				required: false,
			},
		},
	},
	session: {
		expiresIn: 60 * 60 * 24 * 7, // 7 days
		updateAge: 60 * 60 * 24 * 7, // 1 day (every 1 day the session expiration is updated)
		cookieCache: {
			enabled: true,
			maxAge: 5 * 60, // Cache duration in seconds
		},
	},
	plugins: [openAPI()],
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
		sendResetPassword: async ({ user, url }) => {
			// await sendEmail({
			// 	to: user.email,
			// 	subject: 'Reset your password',
			// 	text: `Click the link to reset your password: ${url}`,
			// });

			const htmlContent = `
				<html>
					<body>
						<h2> Hello ${user.name} </h2>
						<p> Click on this <a href=${url}> </a> </p>				
					</body>
				</html>
			`;

			await sendEmail({
				to: user.email,
				// name: user.name,
				subject: 'Reset Password',
				html: htmlContent,
			});
			// await resend.emails.send({
			// 	from: 'contact@signups-p2p.22vedant.online',
			// 	to: 'ruhi@inboxbear.com',
			// 	subject: 'Password Reset',
			// 	html: `Click this link to reset your password ${url}`,
			// });
		},
	},
	emailVerification: {
		sendOnSignUp: true,
		autoSignInAfterVerification: true,
		sendVerificationEmail: async ({ user, token }) => {
			const verificationUrl = `${process.env.BETTER_AUTH_URL}/api/auth/verify-email?token=${token}&callbackURL=${process.env.EMAIL_VERIFICATION_CALLBACK_URL}`;
			const htmlContent = `
				<html>
					<body>
						<h2> Hello ${user.name} </h2>
						<p> Click on this <a href=${verificationUrl}>link</a> </p>				
					</body>
				</html>
			`;

			await sendEmail({
				to: user.email,
				// name: user.name,
				subject: 'Reset Password',
				html: htmlContent,
			});
		},
	},
} satisfies BetterAuthOptions);

export type Session = typeof auth.$Infer.Session;
