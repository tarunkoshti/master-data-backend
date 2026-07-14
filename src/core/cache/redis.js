import Redis from 'ioredis';
import { redisConfig } from '../../config/base.js';
import Logger from '../utils/logger.js';

let redisClient = null;

if (redisConfig.isRedisEnabled) {
  const options = {
    host: redisConfig.host,
    port: redisConfig.port,
  };

  redisClient = new Redis(options);

  redisClient.on('connect', () => {
    Logger.info('Redis connected successfully');
  });

  redisClient.on('error', (err) => {
    Logger.error('Redis connection error:', err);
  });
} else {
  Logger.info('Redis is disabled by configuration');
}

export default redisClient;
