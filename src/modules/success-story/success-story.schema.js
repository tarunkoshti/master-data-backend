import { z } from 'zod';
import { SUCCESS_STORY_STATUS } from './success-story.constant.js';
import { DateUtil } from '../../core/utils/date.util.ts';

const idParam = z.preprocess((val) => Number(val), z.number().positive('Valid Profile ID is required'));
const rowIdParam = z.preprocess((val) => Number(val), z.number().positive('Valid ID is required'));

export const submitSuccessStorySchema = z.object({
    body: z.object({
        profile_id: z.preprocess((val) => Number(val), z.number().int().positive('Profile ID is required')),
        app_package_name: z.string().min(1, 'App Package Name is required'),
        reason_id: z.preprocess((val) => Number(val), z.number().int().positive('Reason ID is required')),
        mobile_number: z.string().min(10, 'Mobile number must be at least 10 digits'),
        marriage_date: z.string().refine((val) => new Date(val).getTime() <= new Date().getTime(), {
            message: 'Marriage date cannot be a future date'
        }).transform((val) => DateUtil.toDateOnly(val)).optional(),
        bride_name_address: z.string().optional(),
        groom_name_address: z.string().optional(),
        gift_delivery_address: z.string().optional(),
    })
});

export const updateSuccessStoryStatusSchema = z.object({
    body: z.object({
        status: z.enum([
            SUCCESS_STORY_STATUS.PENDING,
            SUCCESS_STORY_STATUS.VERIFIED,
            SUCCESS_STORY_STATUS.REJECTED,
            SUCCESS_STORY_STATUS.PROFILE_DELETED
        ], {
            errorMap: () => ({ message: 'Invalid status' })
        }),
    }),
    params: z.object({
        id: rowIdParam,
    })
});

export const getSuccessStorySchema = z.object({
    params: z.object({
        profileId: idParam,
    })
});
