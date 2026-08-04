import { pool } from '../../config/db.js';
import { TABLES } from '../../core/constants/table.constant.js';
import { USER_INTRO_SORT_FIELD, USER_INTRO_STATUS } from './user-intro.constant.js';

const uploadUserIntro = async (data) => {
    const { profile_id, app_id, video_url_link } = data;

    await pool.query(
        `INSERT INTO ${TABLES.USER_INTROS} (profile_id, app_id, video_url_link, status) VALUES (?, ?, ?, ?)`,
        [profile_id, app_id, video_url_link, USER_INTRO_STATUS.PENDING]
    );

    return await getUserIntroByProfileId(profile_id);
};

const updateUserIntro = async (id, data) => {
    const { video_url_link } = data;
    const updates = [];
    const values = [];

    if (video_url_link !== undefined) {
        updates.push('video_url_link = ?');
        values.push(video_url_link);
    }

    updates.push('status = ?');
    values.push(USER_INTRO_STATUS.PENDING);

    if (updates.length > 0) {
        values.push(id);
        await pool.query(
            `UPDATE ${TABLES.USER_INTROS} SET ${updates.join(', ')} WHERE id = ?`,
            values
        );
    }

    return await getUserIntroById(id);
};

const deleteUserIntro = async (id) => {
    const [result] = await pool.query(`DELETE FROM ${TABLES.USER_INTROS} WHERE id = ?`, [id]);
    return result.affectedRows > 0;
};

const getUserIntroById = async (id) => {
    const [rows] = await pool.query(`SELECT * FROM ${TABLES.USER_INTROS} WHERE id = ?`, [id]);
    return rows[0];
};

const getUserIntroByProfileId = async (profileId) => {
    const [rows] = await pool.query(`SELECT * FROM ${TABLES.USER_INTROS} WHERE profile_id = ?`, [profileId]);
    return rows[0];
};

const updateUserIntroStatus = async (id, { status, reason = null }) => {
    await pool.query(`UPDATE ${TABLES.USER_INTROS} SET status = ?, reason = ? WHERE id = ?`, [status, reason, id]);
    return await getUserIntroById(id);
};

const getAllUserIntros = async (filter = {}, query = {}) => {

    // Sorting
    let sortBy = 'id';
    if (query?.sort?.sortBy) {
        if (Object.values(USER_INTRO_SORT_FIELD).includes(query.sort.sortBy)) {
            sortBy = query.sort.sortBy;
        }
    }

    const orderStr = query?.sort?.sortOrder?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';


    // Build dynamic WHERE clause based on filters
    let whereClause = '';
    const queryParams = [];
    const conditions = [];

    if (filter.status) {
        conditions.push('status = ?');
        queryParams.push(filter.status);
    }

    if (filter.search) {
        conditions.push('(profile_id LIKE ? OR app_id LIKE ?)');
        const searchPattern = `%${filter.search}%`;
        queryParams.push(searchPattern, searchPattern);
    }

    if (conditions.length > 0) {
        whereClause = 'WHERE ' + conditions.join(' AND ');
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM ${TABLES.USER_INTROS} ${whereClause}`;
    const [countRows] = await pool.query(countQuery, queryParams);
    const totalDocuments = countRows[0].total;


    // Get paginated data
    let dataQuery = `SELECT * FROM ${TABLES.USER_INTROS} ${whereClause}`;

    if (query?.pagination) {
        const { limit, last_id } = query.pagination;
        
        let cursorWhereClause = whereClause;
        const paginationParams = [...queryParams];
        let page = 1;

        if (last_id) {
            const operator = orderStr === 'ASC' ? '>' : '<';
            const cursorCondition = `id ${operator} ?`;
            if (conditions.length > 0) {
                cursorWhereClause = `WHERE ${conditions.join(' AND ')} AND ${cursorCondition}`;
            } else {
                cursorWhereClause = `WHERE ${cursorCondition}`;
            }
            paginationParams.push(last_id);

            const countOperator = orderStr === 'ASC' ? '<=' : '>=';
            const countBeforeCondition = `id ${countOperator} ?`;
            const countBeforeWhereClause = conditions.length > 0 
                ? `WHERE ${conditions.join(' AND ')} AND ${countBeforeCondition}`
                : `WHERE ${countBeforeCondition}`;
                
            const countBeforeQuery = `SELECT COUNT(*) as count FROM ${TABLES.USER_INTROS} ${countBeforeWhereClause}`;
            const [countBeforeRows] = await pool.query(countBeforeQuery, [...queryParams, last_id]);
            const itemsBefore = countBeforeRows[0].count;
            page = Math.floor(itemsBefore / limit) + 1;
        }

        dataQuery = `SELECT * FROM ${TABLES.USER_INTROS} ${cursorWhereClause} ORDER BY ${sortBy} ${orderStr} LIMIT ?`;
        paginationParams.push(limit);

        const [rows] = await pool.query(dataQuery, paginationParams);

        const totalPages = Math.ceil(totalDocuments / limit);

        return {
            data: rows,
            pagination: {
                page,
                totalPages,
                totalDocuments,
                hasPrevPage: page > 1,
                hasNextPage: page < totalPages
            }
        };
    } else {

        dataQuery = `SELECT * FROM ${TABLES.USER_INTROS} ${whereClause} ORDER BY ${sortBy} ${orderStr}`;
        const [rows] = await pool.query(dataQuery, queryParams);

        return {
            data: rows,
            pagination: {
                page: 1,
                totalPages: 1,
                totalDocuments: rows.length,
                hasPrevPage: false,
                hasNextPage: false
            }
        };
    }
};

export const userIntroRepository = {
    uploadUserIntro,
    getUserIntroByProfileId,
    getUserIntroById,
    updateUserIntro,
    deleteUserIntro,
    updateUserIntroStatus,
    getAllUserIntros
};
