import express from 'express';
import asyncHandler from '../../core/utils/asyncHandler.js';
import { authController } from './auth.controller.js';
import { authHandler } from '../../core/middlewares/authenticate.js';
import { validate } from '../../core/middlewares/validate.js';
import { registerSchema, loginSchema, changePasswordSchema } from './auth.schema.js';


const router = express.Router();

router.post('/register', validate(registerSchema), asyncHandler(authController.register));
router.post('/login', validate(loginSchema), asyncHandler(authController.login));
router.post('/logout', asyncHandler(authController.logout));
router.get('/me', authHandler, asyncHandler(authController.me));
router.post('/change-password', authHandler, validate(changePasswordSchema), asyncHandler(authController.changePassword));

export default router;
