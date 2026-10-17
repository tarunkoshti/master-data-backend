import { z } from 'zod';

export const registerSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Name is required'),
        password: z.string().min(8, 'Password must be at least 8 characters long'),
        email: z.string().email('Invalid email address'),
        admin_address: z.string().optional(),
        office_address: z.string().optional(),
        phone1: z.string().optional(),
        phone2: z.string().optional(),
    }),
});

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email('Invalid email address'),
        password: z.string().min(1, 'Password is required'),
    }),
});

export const changePasswordSchema = z.object({
    body: z.object({
        oldPassword: z.string().min(1, 'Old password is required'),
        newPassword: z.string().min(8, 'New password must be at least 8 characters long'),
    }),
});

export const forgotPasswordSchema = z.object({
    body: z.object({
        email: z.string().trim().toLowerCase().email("Invalid email format").min(1, "Email is required"),
    }),
});

export const resetPasswordSchema = z.object({
    body: z.object({
        token: z.string().trim().min(1, "Token is required"),
        newPassword: z.string().min(8, "Password must be at least 8 characters"),
    }),
});
