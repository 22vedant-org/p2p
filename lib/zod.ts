import { phoneNumber } from 'better-auth/plugins';
import { object, string, enum as enum_ } from 'zod';

const getPasswordSchema = (type: 'password' | 'confirmPassword') =>
	string({ required_error: `${type} is required` })
		.min(8, `${type} must be atleast 8 characters`)
		.max(32, `${type} can not exceed 32 characters`);

const getEmailSchema = () =>
	string({ required_error: 'Email is required' })
		.min(1, 'Email is required')
		.email('Invalid email');

const getNameSchema = () =>
	string({ required_error: 'Name is required' })
		.min(1, 'Name is required')
		.max(50, 'Name must be less than 50 characters');

const getPhoneNumberSchema = () =>
	string()
		.min(10, 'Please enter a valid phone number')
		.max(10, 'Please enter a valid phone number')
		.optional()
		.nullable();

const getRoleSchema = () => enum_(['Rider', 'Driver']);

const getGenderSchema = () => enum_(['MALE', 'FEMALE', 'OTHER']);

const getCompanyNameSchema = () => string().optional();

export const signUpSchema = object({
	name: getNameSchema(),
	email: getEmailSchema(),
	password: getPasswordSchema('password'),
	confirmPassword: getPasswordSchema('confirmPassword'),
	phoneNumber: getPhoneNumberSchema(),
	role: getRoleSchema(),
	gender: getGenderSchema(),
	companyName: getCompanyNameSchema(),
}).refine((data) => data.password === data.confirmPassword, {
	message: "Passwords don't match",
	path: ['confirmPassword'],
});

export const signInSchema = object({
	email: getEmailSchema(),
	password: getPasswordSchema('password'),
});

export const forgotPasswordSchema = object({
	email: getEmailSchema(),
});

export const resetPasswordSchema = object({
	password: getPasswordSchema('password'),
	confirmPassword: getPasswordSchema('confirmPassword'),
}).refine((data) => data.password === data.confirmPassword, {
	message: "Passwords don't match",
	path: ['confirmPassword'],
});

export const bugReportSchema = object({});
