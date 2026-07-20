import pool from '../../config/db.js';
import { TABLES } from '../../core/constants/table.constant.js';

const findByEmail = async (email) => {
  const [rows] = await pool.query(
    `
    SELECT *
    FROM ${TABLES.ADMIN}
    WHERE email = ?
    `,
    [email]
  );
  return rows[0] || null;
};

const createAdmin = async ({ name, password, email, admin_address, office_address, phone1, phone2 }) => {
  const [result] = await pool.query(
    `
    INSERT INTO ${TABLES.ADMIN} (name, password, email, admin_address, office_address, phone1, phone2)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [name, password, email, admin_address || null, office_address || null, phone1 || null, phone2 || null]
  );
  return result;
};

const findById = async (id) => {
  const [rows] = await pool.query(
    `
    SELECT *
    FROM ${TABLES.ADMIN}
    WHERE admin_id = ?
    `,
    [id]
  );
  return rows[0] || null;
};

const updatePassword = async (id, newPassword) => {
  const [result] = await pool.query(
    `
    UPDATE ${TABLES.ADMIN}
    SET password = ?
    WHERE admin_id = ?
    `,
    [newPassword, id]
  );
  return result;
};

export const authRepository = {
  findByEmail,
  createAdmin,
  findById,
  updatePassword,
};
