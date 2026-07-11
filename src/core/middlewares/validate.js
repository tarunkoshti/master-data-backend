import { ZodError } from 'zod';
import { ApiError } from '../utils/ApiError.js';

export const validate = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            const issues = error.issues || error.errors || [];
            const formattedErrors = issues.map((err) => ({
                field: err.path.join('.'),
                message: err.message,
            }));
            
            return next(new ApiError(400, 'Validation Failed', 'VALIDATION_ERROR', formattedErrors));
        }
        next(error);
    }
};
