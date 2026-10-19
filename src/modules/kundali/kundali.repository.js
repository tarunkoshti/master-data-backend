import { pool } from '../../config/db.js';
import { TABLES } from '../../core/constants/table.constant.js';
import { KUNDALI_TYPE } from './kundali.constant.js';

const getKundali = async ({ profile_id, app_package_name, type }) => {
    const [result] = await pool.query(`
            SELECT * FROM ${TABLES.KUNDALI} WHERE profile_id = ? AND app_package_name = ? AND kundali_type = ?
        `,
        [profile_id, app_package_name, type]);
    return result[0];
};

const saveBasicKundali = async ({
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

const updateBasicKundali = async ({
    profile_id,
    app_package_name,
    res_json
}) => {
    const [result] = await pool.query(`
            UPDATE ${TABLES.KUNDALI} SET
                res_json = ?
            WHERE profile_id = ? AND app_package_name = ? AND kundali_type = ?
        `,
        [
            res_json,
            profile_id,
            app_package_name,
            KUNDALI_TYPE.BASIC
        ]);
    return result.affectedRows;
};

const saveCompleteKundali = async ({
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

const updateCompleteKundali = async ({
    profile_id,
    app_package_name,
    res_json
}) => {
    const [result] = await pool.query(`
            UPDATE ${TABLES.KUNDALI} SET
                res_json = ?
            WHERE profile_id = ? AND app_package_name = ? AND kundali_type = ?
        `,
        [
            res_json,
            profile_id,
            app_package_name,
            KUNDALI_TYPE.COMPLETE
        ]);
    return result.affectedRows;
};

export const kundaliRepository = {
    getKundali,
    saveBasicKundali,
    updateBasicKundali,
    saveCompleteKundali,
    updateCompleteKundali
};
