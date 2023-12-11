import z from 'zod';

export const parcelSchema = z.object({
	id: z.string().uuid(),
	sending_code: z.number().positive(),
	pickup_code: z.number().positive(),
	parcel_weight: z.number().positive(),
	special_instructions: z.string(),
	parcel_size: z.enum(['S', 'M', 'L']),
	sender_id: z.string().uuid(),
	recipient_id: z.string().uuid(),
	driver_id: z.string().uuid(),
	parcel_status: z.string().nullable(),
	ready_for_pickup_at: z.union([z.string(), z.coerce.date(), z.null()]),
	updated_at: z.union([z.string(), z.coerce.date(), z.null()]),
	created_at: z.union([z.string(), z.coerce.date(), z.null()]),
});

export type Parcel = z.infer<typeof parcelSchema>;

export function validateParcel(parcel: Parcel) {
  return parcelSchema.safeParse(parcel);
}

export function validatePartialParcel(parcel: Partial<Parcel>) {
  return parcelSchema.partial().safeParse(parcel);
}

