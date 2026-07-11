import { z } from 'zod';

export const registerSchema = z.object({
    body: z.object({
        username: z.string().min(1, 'Username is required'),
        password: z.string().min(8, 'Password must be at least 8 characters long'),
    }),
});

export const loginSchema = z.object({
    body: z.object({
        username: z.string().min(1, 'Username is required'),
        password: z.string().min(1, 'Password is required'),
    }),
});
