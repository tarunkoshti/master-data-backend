import { z } from 'zod';

const idParam = z.preprocess((val) => Number(val), z.number().positive('Valid Master Data ID is required'));

const masterDataBodySchema = z.object({
    type: z.string().min(1, 'Type is required'),
    value: z.string().optional(),
    name: z.string().min(1, 'Name is required'),
    parent_id: z.number().int().positive().optional().nullable(),
}).refine(data => {
    if (['cities', 'states'].includes(data.type)) {
        return data.parent_id !== undefined && data.parent_id !== null;
    }
    return true;
}, {
    message: "parent_id is required when type is cities or states",
    path: ["parent_id"]
});

export const getAllSchema = z.object({
    query: z.object({
        type: z.string().optional(),
        parent_id: z.string().optional(),
    }).refine(data => {
        if (['cities', 'states'].includes(data.type)) {
            return data.parent_id !== undefined && data.parent_id !== null && data.parent_id !== '';
        }
        return true;
    }, {
        message: "parent_id is required when type is cities or states",
        path: ["parent_id"]
    }),
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

export const deleteSchema = z.object({
    params: z.object({
        id: idParam,
    }),
    query: z.object({
        type: z.string().min(1, 'Type is required'),
    }).optional()
});
