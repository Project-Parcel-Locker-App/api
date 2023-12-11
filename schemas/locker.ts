import z from 'zod';
import { parcelSchema } from './parcel.js';

const cabinetSchema = z.object({
	id: z.number(),
	cabinet_size: z.enum(['S', 'M', 'L', 'XL']),
	parcel: parcelSchema.optional().nullable(),
	updated_at: z.coerce.date().optional(),
	created_at: z.coerce.date().optional(),
});

export type Cabinet = z.infer<typeof cabinetSchema>;

const lockerSchema = z.object({
	id: z.number(),
	cabinets: z.number(),
	available: z.number(),
	street: z.string(),
	zip_code: z.number(),
	city: z.string(),
	country: z.string(),
	lat: z.number().optional(),
	lon: z.number().optional(),
});

export type Locker = z.infer<typeof lockerSchema>;

export function validateCabinet(cabinet: Cabinet): Cabinet {
  return cabinetSchema.parse(cabinet);
}
