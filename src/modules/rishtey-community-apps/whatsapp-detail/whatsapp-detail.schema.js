import { z } from 'zod';

export const whatsappDetailSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Name is required'),
        whatsapp_number: z.coerce.string().regex(/^\d{10}$/, "Whatsapp Number must be exactly 10 digits"),
        religion: z.string().min(1, 'Religion is required'),
        caste: z.string().optional()
    }),
});
