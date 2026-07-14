import { ApiResponse } from '../../core/utils/ApiResponse.js';
import { ApiError } from '../../core/utils/ApiError.js';
import { authService } from './auth.service.js';
import { setTokenCookie, clearTokenCookie } from '../../core/utils/token.js';

const register = async (req, res) => {
  const { name, password, email, admin_address, office_address, phone1, phone2 } = req.body;

  const result = await authService.registerAdmin({ name, password, email, admin_address, office_address, phone1, phone2 });

  return res.status(201).json(
    new ApiResponse(201, result, 'Admin user created successfully')
  );
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const { admin, token } = await authService.loginAdmin({ email, password });

  setTokenCookie(res, token);

  return res.status(200).json(
    new ApiResponse(200, admin, 'Logged in successfully')
  );
};

const logout = async (req, res) => {
  clearTokenCookie(res);

  return res.status(200).json(
    new ApiResponse(200, null, 'Logged out successfully')
  );
};

const me = async (req, res) => {
  return res.status(200).json(
    new ApiResponse(200, req.user, 'Current user session retrieved')
  );
};

export const authController = {
  register,
  login,
  logout,
  me,
};
