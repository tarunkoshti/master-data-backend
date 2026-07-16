import pool from '../../config/db.js';

const uploadUserIntro = async (data) => {
    const { profile_id, app_id, video_url_link } = data;

    await pool.query(
        `INSERT INTO user_intros (profile_id, app_id, video_url_link) VALUES (?, ?, ?)`,
        [profile_id, app_id, video_url_link]
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

    if (updates.length > 0) {
        values.push(id);
        await pool.query(
            `UPDATE user_intros SET ${updates.join(', ')} WHERE id = ?`,
            values
        );
    }

    return getUserIntroById(id);
};

const deleteUserIntro = async (id) => {
    const [result] = await pool.query(`DELETE FROM user_intros WHERE id = ?`, [id]);
    return result.affectedRows > 0;
};

const getUserIntroById = async (id) => {
    const [rows] = await pool.query(`SELECT * FROM user_intros WHERE id = ?`, [id]);
    return rows[0];
};

const getUserIntroByProfileId = async (profileId) => {
    const [rows] = await pool.query(`SELECT * FROM user_intros WHERE profile_id = ?`, [profileId]);
    return rows[0];
};

export const userIntroRepository = {
    uploadUserIntro,
    getUserIntroByProfileId,
    getUserIntroById,
    updateUserIntro,
    deleteUserIntro,
};
