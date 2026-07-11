import pool from '../../config/db.js';

const getMasterDataById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM master_data WHERE id = ?', [id]);
    return rows[0];
};

const getChildrenByParentId = async (parentId) => {
    const [rows] = await pool.query('SELECT * FROM master_data WHERE parent_id = ?', [parentId]);
    return rows;
};

const getAllMasterData = async (filter) => {
    const { is_active } = filter;
    let query = 'SELECT * FROM master_data';
    const queryParams = [];

    if (is_active !== undefined) {
        query += ' WHERE is_active = ?';
        queryParams.push(is_active);
    }

    query += ' ORDER BY sort_order ASC';

    const [rows] = await pool.query(query, queryParams);
    return rows;
};

const createMasterData = async (data) => {
    const { category, type, value, name, parent_id } = data;

    const [maxResult] = await pool.query('SELECT MAX(sort_order) as maxOrder FROM master_data WHERE type = ?', [type]);
    const maxOrder = maxResult[0].maxOrder;
    const sort_order = maxOrder !== null ? maxOrder + 1 : 0;

    const [result] = await pool.query(
        'INSERT INTO master_data (category, type, value, name, parent_id, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
        [category, type, value, name, parent_id || null, sort_order]
    );
    return getMasterDataById(result.insertId);
};

const updateMasterDataById = async (id, data) => {
    const { category, type, value, name, parent_id } = data;
    await pool.query(
        'UPDATE master_data SET category = ?, type = ?, value = ?, name = ?, parent_id = ? WHERE id = ?',
        [category, type, value, name, parent_id || null, id]
    );
    return getMasterDataById(id);
};

const deleteMasterDataById = async (id) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [rows] = await connection.query('SELECT type, sort_order FROM master_data WHERE id = ? FOR UPDATE', [id]);
        if (rows.length === 0) {
            await connection.rollback();
            return 0;
        }
        const { type, sort_order } = rows[0];

        const [result] = await connection.query('DELETE FROM master_data WHERE id = ?', [id]);

        if (result.affectedRows > 0) {
            await connection.query(
                'UPDATE master_data SET sort_order = sort_order - 1 WHERE type = ? AND sort_order > ?',
                [type, sort_order]
            );
        }

        await connection.commit();
        return result.affectedRows;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

const updateMasterDataStatusById = async (id, is_active) => {
    await pool.query('UPDATE master_data SET is_active = ? WHERE id = ?', [is_active, id]);
    return getMasterDataById(id);
};

const reorderMasterData = async (ids) => {
    if (!ids || ids.length === 0) return;

    const cases = ids
        .map((id, index) => `WHEN ${id} THEN ${index}`)
        .join(" ");

    const sql = `
        UPDATE master_data
        SET sort_order = CASE id
            ${cases}
        END
        WHERE id IN (${ids.join(",")})
    `;

    await pool.query(sql);
};

const getItemsByType = async (type) => {
    const [rows] = await pool.query('SELECT * FROM master_data WHERE type = ?', [type]);
    return rows;
};

const getMasterDataByCategory = async (filter) => {
    const { category, is_active } = filter;
    let query = 'SELECT * FROM master_data WHERE category = ?';
    const queryParams = [category];

    if (is_active !== undefined) {
        query += ' AND is_active = ?';
        queryParams.push(is_active);
    }

    query += ' ORDER BY sort_order ASC';

    const [rows] = await pool.query(query, queryParams);
    return rows;
};

const getMasterDataByParentId = async (filter) => {
    const { parent_id, is_active } = filter;
    let query = 'SELECT * FROM master_data WHERE parent_id = ?';
    const queryParams = [parent_id];

    if (is_active !== undefined) {
        query += ' AND is_active = ?';
        queryParams.push(is_active);
    }

    query += ' ORDER BY sort_order ASC';

    const [rows] = await pool.query(query, queryParams);
    return rows;
};

export const masterDatasRepository = {
    getAllMasterData,
    createMasterData,
    updateMasterDataById,
    deleteMasterDataById,
    updateMasterDataStatusById,
    reorderMasterData,
    getMasterDataByCategory,
    getMasterDataById,
    getChildrenByParentId,
    getMasterDataByParentId,
    getItemsByType
};
