import redisClient from './redis.js';
import Logger from '../utils/logger.js';

// export const setObject = async (key, object, expirationInSeconds = 60 * 10) => {
//     try {
//         const res = await redisClient.hset(key, object);
//         await redisClient.expire(key, expirationInSeconds);
//         return res;
//     } catch (err) {
//         Logger.error(`Redis setObject Error for key ${key}: ${err.message}`);
//         return false;
//     }
// };

// export const getObject = async (key) => {
//     try {
//         const res = await redisClient.hgetall(key);
//         return res;
//     } catch (err) {
//         Logger.error(`Redis getObject Error for key ${key}: ${err.message}`);
//         return {};
//     }
// };

// export const setExpireTime = async (key, expirationInSeconds = 60 * 10) => {
//     try {
//         await redisClient.expire(key, expirationInSeconds);
//         return true;
//     } catch (err) {
//         Logger.error(`Redis setExpireTime Error for key ${key}: ${err.message}`);
//         return false;
//     }
// };

export const getStoredKey = async (key) => {
    if (!redisClient) return null;
    try {
        const res = await redisClient.get(key);
        return res;
    } catch (err) {
        Logger.error(`Redis getStoredKey Error for key ${key}: ${err.message}`);
        return null;
    }
};

export const setStoredKey = async (
    key,
    value,
    expirationInSeconds = 60 * 10,
    neverExpire = false
) => {
    if (!redisClient) return false;
    try {
        const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
        const res = await redisClient.set(key, stringValue);
        if (!neverExpire) await redisClient.expire(key, expirationInSeconds);
        return res;
    } catch (err) {
        Logger.error(`Redis setStoredKey Error for key ${key}: ${err.message}`);
        return false;
    }
};

export const deleteStoredKey = async (key) => {
    if (!redisClient) return false;
    try {
        const res = await redisClient.del(key);
        return res;
    } catch (err) {
        Logger.error(`Redis deleteStoredKey Error for key ${key}: ${err.message}`);
        return false;
    }
};

// export const setStoredList = async (key, dataArray, expirationInSeconds = 60 * 10) => {
//     try {
//         await redisClient.del(key);
//         const res = await redisClient.rpush(key, ...dataArray);
//         await redisClient.expire(key, expirationInSeconds);
//         return res;
//     } catch (err) {
//         Logger.error(`Redis setStoredList Error for key ${key}: ${err.message}`);
//         return null;
//     }
// };

// export const getStoredList = async (key) => {
//     try {
//         const res = await redisClient.lrange(key, 0, -1);
//         return res;
//     } catch (err) {
//         Logger.error(`Redis getStoredList Error for key ${key}: ${err.message}`);
//         return null;
//     }
// };

export const clearCachePattern = async (pattern) => {
    if (!redisClient) return;
    try {
        let cursor = '0';
        do {
            const result = await redisClient.scan(cursor, 'MATCH', pattern, 'COUNT', '100');
            cursor = result[0];
            const keys = result[1];
            if (keys.length > 0) {
                await redisClient.del(keys);
            }
        } while (cursor !== '0');
    } catch (err) {
        Logger.error(`Redis clearCachePattern Error for pattern ${pattern}: ${err.message}`);
    }
};
