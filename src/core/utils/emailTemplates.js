const capitalizeWords = (str) => {
    if (!str) return '';
    return str
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

const formatRecipientName = (name) => {
    if (!name || !name.trim() || ['user', 'there'].includes(name.trim().toLowerCase())) {
        return 'there';
    }
    return capitalizeWords(name);
};

export const resetPasswordEmailTemplate = (resetUrl, name = 'there') => {
    const recipientName = formatRecipientName(name);

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password - Rishtey Master Admin</title>
</head>
<body style="margin: 0; padding: 32px 16px; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #334155; -webkit-font-smoothing: antialiased;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04); border-collapse: separate;">
        <!-- Brand Accent Bar -->
        <tr>
            <td style="height: 4px; background-color: #0069A8;"></td>
        </tr>

        <!-- Content -->
        <tr>
            <td style="padding: 28px 32px 32px 32px;">
                <p style="margin: 0 0 16px 0; font-size: 15px; color: #0f172a; font-weight: 600;">Hello ${recipientName},</p>
                <p style="margin: 0 0 20px 0; font-size: 15px; color: #334155; line-height: 1.6;">Follow this link to reset your Rishtey Master Admin password:</p>
                
                <!-- CTA Button -->
                <div style="margin: 24px 0 28px 0;">
                    <a href="${resetUrl}" target="_blank" style="display: inline-block; background-color: #0069A8; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; padding: 12px 28px; border-radius: 8px;">Reset Password</a>
                </div>

                <p style="margin: 0 0 8px 0; font-size: 13px; color: #64748b; line-height: 1.5;">If the button above does not work, copy and paste this link into your browser:</p>
                <p style="margin: 0 0 24px 0; font-size: 13px; word-break: break-all;"><a href="${resetUrl}" style="color: #0069A8; text-decoration: underline;">${resetUrl}</a></p>

                <p style="margin: 0 0 24px 0; font-size: 13px; color: #64748b; line-height: 1.5;">If you didn't ask to reset your password, you can safely ignore this email.</p>

                <p style="margin: 0; font-size: 14px; color: #334155; line-height: 1.6;">
                    Warm Regards,<br>
                    <strong style="color: #0f172a;">Rishtey Master Admin</strong>
                </p>
            </td>
        </tr>

    </table>
</body>
</html>
    `;
};