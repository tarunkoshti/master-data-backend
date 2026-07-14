import { z } from 'zod';

const isActiveCoerce = z.preprocess((val) => {
    if (val === undefined || val === '') return undefined;
    return Number(val);
}, z.number().refine(val => val === 0 || val === 1, {
    message: "is_active must be a valid number (0 or 1)"
}).optional());

const idParam = z.preprocess((val) => Number(val), z.number().positive('Valid Master Data ID is required'));

export const getAllSchema = z.object({
    query: z.object({
        is_active: isActiveCoerce,
        category: z.string().optional(),
        type: z.string().optional(),
        parent_id: z.preprocess((val) => val === undefined ? undefined : Number(val), z.number().optional()),
    })
});

const masterDataBodySchema = z.object({
    category: z.string().min(1, 'Category is required'),
    type: z.string().min(1, 'Type is required'),
    value: z.string().min(1, 'Value is required'),
    name: z.string().min(1, 'Name is required'),
    parent_id: z.number().nullable().optional(),
}).superRefine((data, ctx) => {
    const type = data.type?.toLowerCase();
    if ((type === 'city' || type === 'state') && (data.parent_id === null || data.parent_id === undefined)) {
        ctx.addIssue({
            message: "parent_id is required when type is city or state",
            path: ["parent_id"],
        });
    }
});

export const createSchema = z.object({
    body: masterDataBodySchema
});

export const updateSchema = z.object({
    params: z.object({
        id: idParam,
    }),
    body: masterDataBodySchema
});

export const updateStatusSchema = z.object({
    params: z.object({
        id: idParam,
    }),
    body: z.object({
        is_active: z.number().refine(val => val === 0 || val === 1, {
            message: "is_active status must be 0 or 1"
        }),
    })
});

export const deleteSchema = z.object({
    params: z.object({
        id: idParam,
    })
});

export const reorderSchema = z.object({
    params: z.object({
        type: z.string().min(1, 'Type is required'),
    }),
    body: z.object({
        ids: z.array(z.number().positive('ID must be positive')).min(1, 'At least one ID is required')
    })
});
