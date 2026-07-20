import pool from '../../config/db.js';
import { TABLES } from '../../core/constants/table.constant.js';
import { USER_INTRO_SORT_FIELD } from './user-intro.constant.js';

const uploadUserIntro = async (data) => {
    const { profile_id, app_id, video_url_link } = data;

    await pool.query(
        `INSERT INTO ${TABLES.USER_INTROS} (profile_id, app_id, video_url_link, status) VALUES (?, ?, ?, ?)`,
        [profile_id, app_id, video_url_link, 'pending']
    );

    return getUserIntroByProfileId(profile_id);
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
    values.push('pending');

    if (updates.length > 0) {
        values.push(id);
        await pool.query(
            `UPDATE ${TABLES.USER_INTROS} SET ${updates.join(', ')} WHERE id = ?`,
            values
        );
    }

    return getUserIntroById(id);
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
    return getUserIntroById(id);
};

const getAllUserIntros = async (filter = {}, query = {}) => {

    // Sorting
    let sortBy = 'id';
    if (query?.sort?.sortBy) {
        if (!Object.values(USER_INTRO_SORT_FIELD).includes(query.sort.sortBy)) {
            sortBy = query.sort.sortBy;
        } else {
            sortBy = query.sort.sortBy;
        }
    }

    const orderStr = query?.sort?.sortOrder?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';


    // Get total count
    const [countRows] = await pool.query(`SELECT COUNT(*) as total FROM ${TABLES.USER_INTROS}`);
    const totalDocuments = countRows[0].total;


    // Get paginated data

    if (query?.pagination) {
        const { page, limit } = query.pagination;
        const offset = (page - 1) * limit;

        const [rows] = await pool.query(
            `SELECT * FROM ${TABLES.USER_INTROS} ORDER BY ${sortBy} ${orderStr} LIMIT ? OFFSET ?`,
            [limit, offset]
        );

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

        const [rows] = await pool.query(
            `SELECT * FROM ${TABLES.USER_INTROS} ORDER BY ${sortBy} ${orderStr}`
        )

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
