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

        // Logger.info("Database migration completed.");

        process.exit(0);
    } catch (error) {
        Logger.error(error);
        process.exit(1);
    }
};

migrate();