import { pool } from '../../config/db.js';
import { TABLES } from '../../core/constants/table.constant.js';
import { KUNDALI_TYPE } from './kundali.constant.js';

const getKundali = async ({ profile_id, type }) => {
    const [result] = await pool.query(`
            SELECT * FROM ${TABLES.KUNDALI} WHERE profile_id = ? AND kundali_type = ?
        `,
        [profile_id, type]);
    return result[0];
};

const addBasicKundali = async ({
    profile_id,
    app_package_name,
    res_json
}) => {

    const [result] = await pool.query(`
            INSERT INTO ${TABLES.KUNDALI} (
                profile_id,
                app_package_name,
                kundali_type,
                res_json  
            )
            VALUES (?, ?, ?, ?)
        `,
        [
            profile_id,
            app_package_name,
            KUNDALI_TYPE.BASIC,
            res_json
        ]);
    return result.insertId;
};

const addCompleteKundali = async ({
    profile_id,
    app_package_name,
    res_json
}) => {
    const [result] = await pool.query(`
            INSERT INTO ${TABLES.KUNDALI} (
                profile_id,
                app_package_name,
                kundali_type,
                res_json
            )
            VALUES (?, ?, ?, ?)
        `,
        [
            profile_id,
            app_package_name,
            KUNDALI_TYPE.COMPLETE,
            res_json
        ]);
    return result.insertId;
};

export const kundaliRepository = {
    addBasicKundali,
    addCompleteKundali,
    getKundali
};
