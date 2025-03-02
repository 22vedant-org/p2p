import { object, string, z } from 'zod';

const getNameSchema = () =>
	string({
		required_error: 'Name is required',
	}).min(1, 'Name must have atleast one character');

const getImageSchema = () => string().optional();

const getPhoneNumberSchema = () =>
	string()
		.min(10, 'Phone number must be exactly 10 digits')
		.max(10, 'Phone number must be exactly 10 digits')
		.refine(
			(val) => /^\d+$/.test(val),
			'Phone number must be exactly 10 digits'
		);

const roleEnumSchema = z.enum(['Rider', 'Driver']).default('Rider');

const companyNameSchema = () =>
	string().min(1, 'Company Name must have atleast one character');

export const profileSchema = object({
	name: getNameSchema(),
	image: getImageSchema(),
	phone: getPhoneNumberSchema(),
	role: roleEnumSchema,
	company: companyNameSchema(),
});
