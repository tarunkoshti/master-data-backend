import bcrypt from 'bcryptjs';
import { ApiError } from '../../core/utils/ApiError.js';
import { authRepository } from './auth.repository.js';
import { generateToken } from '../../core/utils/token.js';

const registerAdmin = async ({ username, password }) => {
  const existing = await authRepository.findByUsername(username);
  if (existing) {
    throw new ApiError(400, 'Admin username already registered');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const result = await authRepository.createAdmin({
    username,
    password: hashedPassword,
  });

  return { id: result.insertId, username };
};

const loginAdmin = async ({ username, password }) => {
  const admin = await authRepository.findByUsername(username);
  if (!admin) {
    throw new ApiError(401, 'Invalid username or password');
  }

  const isValidPassword = await bcrypt.compare(password, admin.password);
  if (!isValidPassword) {
    throw new ApiError(401, 'Invalid username or password');
  }

  const token = generateToken({ id: admin.id, username: admin.username });

  return {
    admin: { id: admin.id, username: admin.username },
    token,
  };
};

export const authService = {
  registerAdmin,
  loginAdmin,
};
