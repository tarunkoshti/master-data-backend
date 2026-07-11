import { ApiResponse } from '../../core/utils/ApiResponse.js';
import { ApiError } from '../../core/utils/ApiError.js';
import { authService } from './auth.service.js';
import { setTokenCookie, clearTokenCookie } from '../../core/utils/token.js';

const register = async (req, res) => {
  const { username, password } = req.body;

  const result = await authService.registerAdmin({ username, password });

  return res.status(201).json(
    new ApiResponse(210, result, 'Admin user created successfully')
  );
};

const login = async (req, res) => {
  const { username, password } = req.body;

  const { admin, token } = await authService.loginAdmin({ username, password });

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
