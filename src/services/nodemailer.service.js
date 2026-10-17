import nodemailer from 'nodemailer';
import { smtpConfig } from '../config/base.js';
import { ApiError } from '../core/utils/ApiError.js';
import { HTTP_STATUS } from '../core/constants/http-status-codes.constant.js';

const transport = nodemailer.createTransport({
    host: smtpConfig.host,
    port: Number(smtpConfig.port),
    secure: smtpConfig.secure,
    auth: {
        user: smtpConfig.authUser,
        pass: smtpConfig.authPassword,
    },

    // Reuse SMTP connections instead of reconnecting per email
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
});

export const sendMail = async ({ to, subject, text, html }) => {
    try {
        const mailOptions = {
            from: `"Rishtey Master Admin" <${smtpConfig.authUser}>`,
            to,
            subject,
            text,
            html,
        };

        const info = await transport.sendMail(mailOptions);
    } catch (error) {
        throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message || 'Failed to send email');
    }
};