import pool from "../../config/db.js";
import { TABLES } from "../../core/constants/table.constant.js";
import { SUCCESS_STORY_SORT_FIELD, SUCCESS_STORY_STATUS } from "./success-story.constant.js";

const createSuccessStory = async (data) => {
    const {
        profile_id,
        app_package_name,
        reason_id,
        marriage_photo,
        marriage_date,
        bride_name_address,
        groom_name_address,
        gift_delivery_address,
        mobile_number,
    } = data;

    const [result] = await pool.query(
        `INSERT INTO ${TABLES.SUCCESS_STORIES} (
            profile_id,
            app_package_name,
            reason_id,
            marriage_photo,
            marriage_date,
            bride_name_address,
            groom_name_address,
            gift_delivery_address,
            mobile_number,
            status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            profile_id,
            app_package_name,
            reason_id || null,
            marriage_photo,
            marriage_date,
            bride_name_address,
            groom_name_address,
            gift_delivery_address,
            mobile_number,
            SUCCESS_STORY_STATUS.PENDING
        ]
    );

    return await getSuccessStoryById(result.insertId);
};

const getAllSuccessStories = async (filters = {}, query = {}) => {

    // Sorting
    let sortBy = 'id';
    if (query?.sort?.sortBy) {
        if (Object.values(SUCCESS_STORY_SORT_FIELD).includes(query.sort.sortBy)) {
            sortBy = query.sort.sortBy;
        }
    }

    const orderStr = query?.sort?.sortOrder?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Build dynamic WHERE clause based on filters
    let whereClause = '';
    const queryParams = [];
    const conditions = [];

    if (filters.status) {
        conditions.push('ss.status = ?');
        queryParams.push(filters.status);
    }

    if (filters.search) {
        conditions.push('(ss.app_package_name LIKE ? OR ss.profile_id LIKE ? OR ss.mobile_number LIKE ?)');
        const searchPattern = `%${filters.search}%`;
        queryParams.push(searchPattern, searchPattern, searchPattern);
    }

    if (conditions.length > 0) {
        whereClause = 'WHERE ' + conditions.join(' AND ');
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM ${TABLES.SUCCESS_STORIES} ss ${whereClause}`;
    const [countRows] = await pool.query(countQuery, queryParams);
    const totalDocuments = countRows[0].total;

    // Get paginated data
    let dataQuery = `
        SELECT ss.*, dpr.name AS deletion_reason 
        FROM ${TABLES.SUCCESS_STORIES} ss 
        LEFT JOIN ${TABLES.DELETION_PROFILE_REASONS} dpr ON ss.reason_id = dpr.id 
        ${whereClause} 
        ORDER BY ss.${sortBy} ${orderStr}
    `;

    if (query?.pagination) {
        const { page, limit } = query.pagination;
        const offset = (page - 1) * limit;

        dataQuery += ' LIMIT ? OFFSET ?';
        const paginationParams = [...queryParams, limit, offset];

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

const getSuccessStoryById = async (id) => {
    const [rows] = await pool.query(
        `SELECT * FROM ${TABLES.SUCCESS_STORIES} WHERE id = ?`,
        [id]
    );
    return rows[0];
};

const updateSuccessStoryStatus = async (id, status) => {
    let query = `UPDATE ${TABLES.SUCCESS_STORIES} SET status = ?`;
    const params = [status];

    if (status === 'profile_deleted') {
        query += `, deleted_at = NOW()`;
    }

    query += ` WHERE id = ?`;
    params.push(id);

    await pool.query(query, params);
    return await getSuccessStoryById(id);
};

const getSuccessStoryByProfileId = async (profileId) => {
    const [rows] = await pool.query(
        `SELECT * FROM ${TABLES.SUCCESS_STORIES} WHERE profile_id = ?`,
        [profileId]
    );
    return rows[0];
};

export const successStoryRepository = {
    createSuccessStory,
    getAllSuccessStories,
    getSuccessStoryById,
    updateSuccessStoryStatus,
    getSuccessStoryByProfileId
};
