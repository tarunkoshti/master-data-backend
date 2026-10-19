import { z } from 'zod';

const idParam = z.preprocess((val) => Number(val), z.number().positive('Valid Profile ID is required'));
const rowIdParam = z.preprocess((val) => Number(val), z.number().positive('Valid ID is required'));

