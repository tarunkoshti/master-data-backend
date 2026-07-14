import pool from '../../config/db.js';

const findByEmail = async (email) => {
  const [rows] = await pool.query(
    `
    SELECT *
    FROM admin
    WHERE email = ?
    `,
    [email]
  );
  return rows[0] || null;
};

const createAdmin = async ({ name, password, email, admin_address, office_address, phone1, phone2 }) => {
  const [result] = await pool.query(
    `
    INSERT INTO admin (name, password, email, admin_address, office_address, phone1, phone2)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [name, password, email, admin_address || null, office_address || null, phone1 || null, phone2 || null]
  );
  return result;
};

export const authRepository = {
  findByEmail,
  createAdmin,
};
