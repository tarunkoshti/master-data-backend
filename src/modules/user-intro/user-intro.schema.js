import { z } from 'zod';

const idParam = z.preprocess((val) => Number(val), z.number().positive('Valid Profile ID is required'));
const rowIdParam = z.preprocess((val) => Number(val), z.number().positive('Valid ID is required'));

export const uploadIntroSchema = z.object({
    body: z.object({
        profile_id: z.preprocess((val) => Number(val), z.number().int().positive('Profile ID is required')),
        app_id: z.string().optional(),
    })
});

export const getIntroSchema = z.object({
    params: z.object({
        profileId: idParam,
    })
});

export const updateIntroSchema = z.object({
    params: z.object({
        id: rowIdParam,
    })
});

export const updateStatusSchema = z.object({
    body: z.object({
        status: z.enum(['pending', 'approved', 'rejected']),
    }),
    params: z.object({
        id: rowIdParam,
    })
});

export const deleteIntroSchema = z.object({
    params: z.object({
        id: rowIdParam,
    })
});
