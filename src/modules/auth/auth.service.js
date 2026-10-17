import bcrypt from 'bcryptjs';
import { ApiError } from '../../core/utils/ApiError.js';
import { authRepository } from './auth.repository.js';
import { decodeToken, generateResetToken, generateToken, verifyResetToken } from '../../core/utils/token.js';
import { frontendUrl } from '../../config/base.js';
import { resetPasswordEmailTemplate } from '../../core/utils/emailTemplates.js';
import { HTTP_STATUS } from '../../core/constants/http-status-codes.constant.js';
import { sendMail } from '../../services/nodemailer.service.js';

const registerAdmin = async ({ name, password, email, admin_address, office_address, phone1, phone2 }) => {
  const existing = await authRepository.findByEmail(email);
  if (existing) {
    throw new ApiError(HTTP_STATUS.CONFLICT, 'Admin email already registered');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const result = await authRepository.createAdmin({
    name,
    password: hashedPassword,
    email,
    admin_address,
    office_address,
    phone1,
    phone2,
  });

  return { id: result.insertId, email, name };
};

const loginAdmin = async ({ email, password }) => {
  const admin = await authRepository.findByEmail(email);
  if (!admin) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid email or password');
  }

  const isValidPassword = await bcrypt.compare(password, admin.password);
  if (!isValidPassword) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid email or password');
  }

  // Token includes admin_id as id and email
  const token = generateToken({ id: admin.admin_id, email: admin.email });

  return {
    admin: { id: admin.admin_id, email: admin.email, name: admin.name },
    token,
  };
};

const changePassword = async ({ adminId, oldPassword, newPassword }) => {
  const admin = await authRepository.findById(adminId);
  if (!admin) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Admin not found');
  }

  const isValidPassword = await bcrypt.compare(oldPassword, admin.password);
  if (!isValidPassword) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid old password');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  await authRepository.updatePassword(adminId, hashedPassword);
  return true;
};

const forgotPassword = async ({ email }) => {
  const admin = await authRepository.findByEmail(email);
  if (!admin) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Admin not found");
  }

  const payload = {
    admin_id: admin.admin_id,
    email: admin.email
  };

  const token = generateResetToken(payload, admin.password);

  const resetUrl = `${frontendUrl}/reset-password?token=${token}`;
  const emailHtml = resetPasswordEmailTemplate(resetUrl, admin.name);
  await sendMail({
    to: email,
    subject: "Reset your password for Rishtey Master Admin",
    html: emailHtml
  });
}

const resetPassword = async ({ token, newPassword }) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.admin_id) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid token format");
  }

  const admin = await authRepository.findById(decoded.admin_id);

  if (!admin) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Admin not found");
  }

  // Verify token using the current password hash as part of the secret
  verifyResetToken(token, admin.password);

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);
  // If verified, update the password
  await authRepository.updatePassword(admin.admin_id, hashedPassword);
}

export const authService = {
  registerAdmin,
  loginAdmin,
  changePassword,
  forgotPassword,
  resetPassword,
};
