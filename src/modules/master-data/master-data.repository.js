import pool from '../../config/db.js';

const TABLE_MAP = {
    'zodiacs': { table: 'zodiacs', parentCol: null },
    'subcastes': { table: 'subcastes', parentCol: null },
    'states': { table: 'states', parentCol: 'country_id' },
    'relations': { table: 'relations', parentCol: null },
    'professions': { table: 'professions', parentCol: null },
    'occupations': { table: 'occupations', parentCol: null },
    'nakshatras': { table: 'nakshatras', parentCol: null },
    'mother_tongues': { table: 'mother_tongues', parentCol: null },
    'marital_status': { table: 'marital_status', parentCol: null },
    'manglik_status': { table: 'manglik_status', parentCol: null },
    'heights': { table: 'heights', parentCol: null },
    'gotras': { table: 'gotras', parentCol: null },
    'genders': { table: 'genders', parentCol: null },
    'educations': { table: 'educations', parentCol: null },
    'disabilities': { table: 'disabilities', parentCol: null },
    'diets': { table: 'diets', parentCol: null },
    'countries': { table: 'countries', parentCol: null },
    'complexions': { table: 'complexions', parentCol: null },
    'cities': { table: 'cities', parentCol: 'state_id' },
    'blood_groups': { table: 'blood_groups', parentCol: null },
    'annual_incomes': { table: 'annual_incomes', parentCol: null },
    'house': { table: 'house', parentCol: null },
    'car': { table: 'car', parentCol: null },
};

const getMasterDataById = async (id, type) => {
    const config = TABLE_MAP[type];
    if (!config) return null;
    const [rows] = await pool.query(`SELECT * FROM ${config.table} WHERE id = ?`, [id]);
    return rows[0];
};

const getAllMasterData = async (filter) => {
    const { type, parent_id } = filter;

    if (!type || !TABLE_MAP[type]) {
        return [];
    }

    const config = TABLE_MAP[type];
    let query = `SELECT * FROM ${config.table} WHERE 1=1`;
    const queryParams = [];

    if (parent_id !== undefined && config.parentCol) {
        query += ` AND ${config.parentCol} = ?`;
        queryParams.push(parent_id);
    }

    try {
        const [rows] = await pool.query(query, queryParams);

        // Return the rows directly to avoid unnecessary mapping
        return rows;
    } catch (error) {
        console.error(`Error querying master data for type '${type}':`, error.message);
        return []; // Return empty instead of crashing on unconfigured tables
    }
};

const createMasterData = async (data) => {
    const { type, name, parent_id } = data;
    const config = TABLE_MAP[type];

    if (!config) throw new Error("Invalid type");

    if (config.parentCol && parent_id !== undefined) {
        const [result] = await pool.query(
            `INSERT INTO ${config.table} (name, ${config.parentCol}) VALUES (?, ?)`,
            [name, parent_id]
        );
        return getMasterDataById(result.insertId, type);
    } else {
        const [result] = await pool.query(
            `INSERT INTO ${config.table} (name) VALUES (?)`,
            [name]
        );
        return getMasterDataById(result.insertId, type);
    }
};

const updateMasterDataById = async (id, data) => {
    const { type, name, parent_id } = data;
    const config = TABLE_MAP[type];
    if (!config) throw new Error("Invalid type");

    if (config.parentCol && parent_id !== undefined) {
        await pool.query(
            `UPDATE ${config.table} SET name = ?, ${config.parentCol} = ? WHERE id = ?`,
            [name, parent_id, id]
        );
    } else {
        await pool.query(
            `UPDATE ${config.table} SET name = ? WHERE id = ?`,
            [name, id]
        );
    }

    return getMasterDataById(id, type);
};

// const deleteMasterDataById = async (id, type) => {
//     const config = TABLE_MAP[type];
//     if (!config) throw new Error("Invalid type");
// 
//     const [result] = await pool.query(`DELETE FROM ${config.table} WHERE id = ?`, [id]);
//     return result.affectedRows;
// };

export const masterDatasRepository = {
    getMasterDataById,
    getAllMasterData,
    createMasterData,
    updateMasterDataById,
    // deleteMasterDataById,
};
