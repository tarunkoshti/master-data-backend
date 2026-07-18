import { ApiResponse } from '../../core/utils/ApiResponse.js';
import { ApiError } from '../../core/utils/ApiError.js';
import { authService } from './auth.service.js';
import { setTokenCookie, clearTokenCookie } from '../../core/utils/token.js';
import { HTTP_STATUS } from '../../core/constants/http-status-codes.constant.js';

const register = async (req, res) => {
  const { name, password, email, admin_address, office_address, phone1, phone2 } = req.body;

  const result = await authService.registerAdmin({ name, password, email, admin_address, office_address, phone1, phone2 });

  return res.status(HTTP_STATUS.CREATED).json(
    new ApiResponse(HTTP_STATUS.CREATED, result, 'Admin user created successfully')
  );
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const { admin, token } = await authService.loginAdmin({ email, password });

  setTokenCookie(res, token);

  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, admin, 'Logged in successfully')
  );
};

const logout = async (req, res) => {
  clearTokenCookie(res);

  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, null, 'Logged out successfully')
  );
};

const me = async (req, res) => {
  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, req.user, 'Current user session retrieved')
  );
};

const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const adminId = req.user.id; // From auth middleware

  await authService.changePassword({ adminId, oldPassword, newPassword });

  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, null, 'Password changed successfully')
  );
};

export const authController = {
  register,
  login,
  logout,
  me,
  changePassword,
};
