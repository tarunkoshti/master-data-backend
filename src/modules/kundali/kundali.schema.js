import { z } from 'zod';

const idParam = z.preprocess((val) => Number(val), z.number().positive('Valid Profile ID is required'));
const rowIdParam = z.preprocess((val) => Number(val), z.number().positive('Valid ID is required'));

export const generateKundaliSchema = z.object({
    body: z.object({
        profile_id: idParam,
        app_package_name: z.string().min(1, 'App Package Name is required'),
        date: z.number()
            .int("Date must be an integer")
            .min(1, "Date must be between 1 and 31")
            .max(31, "Date must be between 1 and 31"),
        month: z.number()
            .int("Month must be an integer")
            .min(1, "Month must be between 1 and 12")
            .max(12, "Month must be between 1 and 12"),
        year: z.number()
            .int("Year must be an integer")
            .min(1900, "Year must be 1900 or later")
            .max(2100, "Year must be 2100 or earlier"),
        hours: z.number()
            .int("Hours must be an integer")
            .min(0, "Hours must be between 0 and 23")
            .max(23, "Hours must be between 0 and 23"),
        minutes: z.number()
            .int("Minutes must be an integer")
            .min(0, "Minutes must be between 0 and 59")
            .max(59, "Minutes must be between 0 and 59"),
        seconds: z.number()
            .int("Seconds must be an integer")
            .min(0, "Seconds must be between 0 and 59")
            .max(59, "Seconds must be between 0 and 59"),
        timezone: z.number()
            .min(-12, "Timezone offset is invalid")
            .max(14, "Timezone offset is invalid"),
        latitude: z.number()
            .min(-90, "Latitude must be between -90 and 90")
            .max(90, "Latitude must be between -90 and 90"),
        longitude: z.number()
            .min(-180, "Longitude must be between -180 and 180")
            .max(180, "Longitude must be between -180 and 180"),
        settings: z.object({
            ayanamsha: z.enum(["lahiri"]),
            language: z.enum(["en"]),
            observation_point: z.enum(["topocentric", "geocentric"]),
        }).optional(),
    })
});
