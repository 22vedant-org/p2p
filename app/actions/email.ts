'use server';
import sgMail from '@sendgrid/mail';

const validateWorkEmail = (email: string): boolean => {
	const personalEmail =
		/^[^@]+@(gmail|yahoo|hotmail|outlook|aol|icloud)\.(com|net|org)$/i;
	return !personalEmail.test(email);
};

export async function sendEmail({
	to,
	subject,
	text,
}: {
	to: string;
	subject: string;
	text: string;
}) {
	if (!process.env.SENDGRID_API_KEY) {
		throw new Error('SENDGRID_API_KEY environment variable is not set');
	}
	if (!process.env.EMAIL_FROM) {
		throw new Error('EMAIL_FROM environment variable is not set');
	}
	// if (!validateWorkEmail) {
	// 	console.error(
	// 		`Invalid Email domain. Use of personal email address is strictly prohibited.`
	// 	);
	// 	return {
	// 		success: false,
	// 		message: `Please use your work email`,
	// 	};
	// }
	sgMail.setApiKey(process.env.SENDGRID_API_KEY);

	const message = {
		to: to.toLowerCase().trim(),
		from: process.env.EMAIL_FROM,
		subject: subject.trim(),
		text: text.trim(),
	};

	try {
		const [response] = await sgMail.send(message);

		if (response.statusCode !== 202) {
			throw new Error(
				`SendGrid API returned status code ${response.statusCode}`
			);
		}

		return {
			success: true,
			messageId: response.headers['x-message-id'],
		};
	} catch (error) {
		console.error('Error sending email:', error);
		return {
			success: false,
			message: 'Failed to send email. Please try again later.',
		};
	}
}
