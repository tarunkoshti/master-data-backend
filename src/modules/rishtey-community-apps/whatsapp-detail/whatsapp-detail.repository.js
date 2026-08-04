import { pool1 } from "../../../config/db.js";
import { TABLES } from "../../../core/constants/table.constant.js";

const addWhatsappDetail = async (data) => {
    const {
        name,
        whatsapp_number,
        religion,
        caste,
    } = data;

    const [result] = await pool1.query(
        `INSERT INTO ${TABLES.UNREGISTERED_USERS} (
            name,
            whatsapp_number,
            religion,
            caste,
            joined_at
        ) VALUES (?, ?, ?, ?, NOW())`,
        [
            name,
            whatsapp_number,
            religion,
            caste
        ]
    );

    return result;
};

export const whatsappDetailRepo = {
    addWhatsappDetail
};