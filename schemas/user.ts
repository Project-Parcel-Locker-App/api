import z from 'zod';

const addressSchema = z.object({
	id: z.string().uuid().optional(),
	street: z.string(),
	zip_code: z.number(),
	city: z.string(),
	country: z.string(),
	latitude: z.number().optional(),
	longitude: z.number().optional(),
	updated_at: z.coerce.date().optional(),
	created_at: z.coerce.date().optional(),
});

export type Address = z.infer<typeof addressSchema>;

export function validateAddress(address: Address) {
	return addressSchema.safeParse(address);
}

export function validatePartialAddress(address: Partial<Address>) {
	return addressSchema.partial().safeParse(address);
}

const userSchema = z.object({
	id: z.string().uuid().optional(),
	first_name: z.string(),
	last_name: z.string(),
	email: z.string().email(),
	password_hash: z.string(),
	refresh_token: z.string().optional(),
	phone_number: z.string(),
	user_role: z.string(),
	address: addressSchema,
	updated_at: z.coerce.date().optional(),
	created_at: z.coerce.date().optional(),
});

export type User = z.infer<typeof userSchema>;

export function validateUser(user: User) {
	return userSchema.safeParse(user);
}

export function validatePartialUser(user: Partial<User>) {
	return userSchema.partial().safeParse(user);
}
