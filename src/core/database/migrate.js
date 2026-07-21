import pool from "../../config/db.js";
import Logger from "../utils/logger.js";

const migrate = async () => {
    try {
        /*
        await pool.query(`
            CREATE TABLE IF NOT EXISTS master_data (
                id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
                category VARCHAR(100) NOT NULL,
                type VARCHAR(100) NOT NULL,
                value VARCHAR(255) NOT NULL,
                name VARCHAR(255) NOT NULL,
                parent_id INT UNSIGNED DEFAULT NULL,
                sort_order INT UNSIGNED NOT NULL DEFAULT 0,
                is_active TINYINT(1) NOT NULL DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    ON UPDATE CURRENT_TIMESTAMP,
                    
                UNIQUE KEY uk_type_value (type, value)
            );
        `);
        */

        // await pool.query(`
        //     CREATE TABLE IF NOT EXISTS user_intros (
        //         id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        //         profile_id INT UNSIGNED NOT NULL,
        //         app_id VARCHAR(255) DEFAULT NULL,
        //         video_url_link TEXT NOT NULL,
        //         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        //         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        //         UNIQUE KEY uk_profile_id (profile_id)
        //     );
        // `);

        // await pool.query(`
        //     ALTER TABLE user_intros
        //     ADD COLUMN status ENUM(
        //         'pending',
        //         'approved',
        //         'rejected'
        //     )
        //     NOT NULL DEFAULT 'pending',
        //     ADD COLUMN reason TEXT DEFAULT NULL;
        // `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS deletion_profile_reasons (
                id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS success_stories (
                id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
                profile_id INT UNSIGNED NOT NULL,
                app_package_name VARCHAR(255) NOT NULL,
                reason_id INT UNSIGNED NOT NULL,
                marriage_photo VARCHAR(500) NOT NULL,
                marriage_date DATE NOT NULL,
                bride_name_address VARCHAR(500) NOT NULL,
                groom_name_address VARCHAR(500) NOT NULL,
                gift_delivery_address VARCHAR(1000) NOT NULL,
                mobile_number VARCHAR(15) NOT NULL,
                deleted_at TIMESTAMP NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                status ENUM(
                    'pending',
                    'verified',
                    'rejected',
                    'profile_deleted'
                ) NOT NULL DEFAULT 'pending',

                UNIQUE KEY uq_profile(profile_id),
                CONSTRAINT fk_reason_id FOREIGN KEY (reason_id) REFERENCES deletion_profile_reasons(id) ON DELETE RESTRICT
            )
        `);

        Logger.info("Database migration completed.");

        process.exit(0);
    } catch (error) {
        Logger.error(error);
        process.exit(1);
    }
};

migrate();