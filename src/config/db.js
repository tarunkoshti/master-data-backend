// Create connection pool
import mysql from 'mysql2/promise';
import { db } from './base.js';

// Create connection for master_db
const pool = mysql.createPool({
    host: db.host,
    port: db.port,
    user: db.user,
    password: db.password,
    database: db.name,
    timezone: 'Z',
});

// create connction for rishtey_community_apps
const pool1 = mysql.createPool({
    host: db.host,
    port: db.port,
    user: db.user1,
    database: db.name1,
    password: db.password1,
    timezone: 'Z',
});

export { pool, pool1 };