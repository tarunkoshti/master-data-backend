import dotenv from 'dotenv';
dotenv.config();

export const environment = process.env.NODE_ENV;
export const port = process.env.PORT;
export const frontendUrl = process.env.FRONTEND_URL;
export const jwtSecret = process.env.JWT_SECRET;
export const apiKey = process.env.API_KEY;

export const db = {
  port: process.env.DB_PORT || '',
  name: process.env.DB_NAME || '',
  host: process.env.DB_HOST || '',
  user: process.env.DB_USER || '',
  password: process.env.DB_PASSWORD || '',
};