'use server';
import { Resend } from 'resend';

const validateWorkEmail = (email: string): boolean => {
	const personalEmail =
		/^[^@]+@(gmail|yahoo|hotmail|outlook|aol|icloud)\.(com|net|org)$/i;
	return !personalEmail.test(email);
};

export async function sendEmail({
	to,
	subject,
	html,
}: {
	to: string;
	subject: string;
	html: string;
}) {
	const resend = new Resend(process.env.RESEND_API_KEY);

	if (!process.env.RESEND_API_KEY) {
		throw new Error('RESEND_API_KEY environment variable is not set');
	}

	// Validate work email (uncomment if you want to enforce this)
	if (!validateWorkEmail(to)) {
		console.error(
			`Invalid Email domain. Use of personal email address is strictly prohibited.`
		);
		return {
			success: false,
			message: `Please use your work email`,
		};
	}

	const message = {
		to: to,
		from: 'contact@signups-p2p.22vedant.online',
		subject: subject,
		html: html,
	};

	try {
		const { data, error } = await resend.emails.send(message);

		if (error) {
			console.error('Resend API error:', error);
			return {
				success: false,
				message: 'Failed to send email. Please try again later.',
				error: error,
			};
		}

		return {
			success: true,
			messageId: data?.id,
		};
	} catch (error) {
		console.error('Error sending email:', error);
		return {
			success: false,
			message: 'Failed to send email. Please try again later.',
		};
	}
}
