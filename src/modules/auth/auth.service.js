import bcrypt from 'bcryptjs';
import { ApiError } from '../../core/utils/ApiError.js';
import { authRepository } from './auth.repository.js';
import { generateToken } from '../../core/utils/token.js';

const registerAdmin = async ({ name, password, email, admin_address, office_address, phone1, phone2 }) => {
  const existing = await authRepository.findByEmail(email);
  if (existing) {
    throw new ApiError(400, 'Admin email already registered');
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
    throw new ApiError(401, 'Invalid email or password');
  }

  const isValidPassword = await bcrypt.compare(password, admin.password);
  if (!isValidPassword) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // Token includes admin_id as id and email
  const token = generateToken({ id: admin.admin_id, email: admin.email });

  return {
    admin: { id: admin.admin_id, email: admin.email, name: admin.name },
    token,
  };
};

export const authService = {
  registerAdmin,
  loginAdmin,
};
