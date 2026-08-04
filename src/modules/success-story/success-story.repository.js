import { pool } from "../../config/db.js";
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

    if (filters?.app_package_name) {
        conditions.push('ss.app_package_name = ?');
        queryParams.push(filters.app_package_name);
    }

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
    let baseSelect = `
        SELECT ss.*, dpr.name AS deletion_reason 
        FROM ${TABLES.SUCCESS_STORIES} ss 
        LEFT JOIN ${TABLES.DELETION_PROFILE_REASONS} dpr ON ss.reason_id = dpr.id
    `;
    
    let dataQuery = `${baseSelect} ${whereClause}`;

    if (query?.pagination) {
        const { limit, last_id } = query.pagination;

        let cursorWhereClause = whereClause;
        const paginationParams = [...queryParams];
        let page = 1;

        if (last_id) {
            const operator = orderStr === 'ASC' ? '>' : '<';
            const cursorCondition = `ss.id ${operator} ?`;
            if (conditions.length > 0) {
                cursorWhereClause = `WHERE ${conditions.join(' AND ')} AND ${cursorCondition}`;
            } else {
                cursorWhereClause = `WHERE ${cursorCondition}`;
            }
            paginationParams.push(last_id);

            const countOperator = orderStr === 'ASC' ? '<=' : '>=';
            const countBeforeCondition = `ss.id ${countOperator} ?`;
            const countBeforeWhereClause = conditions.length > 0 
                ? `WHERE ${conditions.join(' AND ')} AND ${countBeforeCondition}`
                : `WHERE ${countBeforeCondition}`;
                
            const countBeforeQuery = `SELECT COUNT(*) as count FROM ${TABLES.SUCCESS_STORIES} ss ${countBeforeWhereClause}`;
            const [countBeforeRows] = await pool.query(countBeforeQuery, [...queryParams, last_id]);
            const itemsBefore = countBeforeRows[0].count;
            page = Math.floor(itemsBefore / limit) + 1;
        }

        dataQuery = `${baseSelect} ${cursorWhereClause} ORDER BY ss.${sortBy} ${orderStr} LIMIT ?`;
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

        dataQuery = `${baseSelect} ${whereClause} ORDER BY ss.${sortBy} ${orderStr}`;
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
