import pool from '../../config/db.js';

const findByUsername = async (username) => {
  const [rows] = await pool.query(
    `
    SELECT *
    FROM admins
    WHERE username = ?
    `,
    [username]
  );
  return rows[0] || null;
};

const createAdmin = async ({ username, password }) => {
  const [result] = await pool.query(
    `
    INSERT INTO admins (username, password)
    VALUES (?, ?)
    `,
    [username, password]
  );
  return result;
};

export const authRepository = {
  findByUsername,
  createAdmin,
};
