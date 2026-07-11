import { ApiError } from '../utils/ApiError.js';
import { verifyToken } from '../utils/token.js';
import { apiKey } from '../../config/base.js';

export const authHandler = (req, res, next) => {
  let token = req.cookies?.token;

  if (!token && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      token = parts[1];
    }
  }

  if (token) {
    const decodedPayload = verifyToken(token);
    if (decodedPayload) {
      req.user = decodedPayload;
      return next();
    }
  }

  const apiKeyHeader = req.headers['x-api-key'];
  if (apiKeyHeader && apiKeyHeader === apiKey) {
    req.user = { isApiKeyUser: true, username: 'api_client' };
    return next();
  }

  throw new ApiError(401, 'Unauthorized: Invalid session token or API key');
};
