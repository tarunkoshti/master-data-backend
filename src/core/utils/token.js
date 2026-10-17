import jwt from 'jsonwebtoken';
import { jwtSecret, resetTokenSecret } from '../../config/base.js';

export const generateToken = (payload) => {
  return jwt.sign(payload, jwtSecret, { expiresIn: '1d' });
};

export const generateResetToken = (payload, password) => {
  const secret = resetTokenSecret + password;
  return jwt.sign(payload, secret, { expiresIn: '1h' });
}

export const verifyResetToken = (token, password) => {
  try {
    const secret = resetTokenSecret + password;
    return jwt.verify(token, secret);
  } catch (err) {
    if (err.name === "TokenExpiredError") throw new ApiError(401, "Invalid or expired reset token");
    throw new ApiError(401, "Invalid or expired reset token");
  }
}

export const decodeToken = (token) => {
  const decoded = jwt.decode(token);
  if (!decoded || typeof decoded === 'string') return null;
  return decoded;
}

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, jwtSecret);
  } catch (error) {
    return null;
  }
};

export const setTokenCookie = (res, token) => {
  const isProd = process.env.NODE_ENV === 'production';

  res.cookie('token', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });
};

export const clearTokenCookie = (res) => {
  const isProd = process.env.NODE_ENV === 'production';

  res.clearCookie('token', {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
  });
};
