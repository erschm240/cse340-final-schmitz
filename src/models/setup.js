import db from './db.js';
import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Sets up the site database. If the tutorials table is empty, then re-seed.
 */

const setupDatabase = async () => {
    /**
     * Check if tutorials table has any rows. Use try-catch to handle cases where the table doesn't exist yet.
     */

    let hasData = false;

    try {
        const result = await db.query("SELECT EXISTS(SELECT 1 FROM tutorials LIMIT 1) as has_data");
        hasData = result.rows[0]?.hasData || false;
    } catch (error) {
        /**
         * If the above query fails, treat the same as no data and complete a re-seed.
         */
        hasData = false;
    }

    if (hasData) {
        console.log('Database already seeded');
        return true;
    }

    // No tutorials found - run full seed
    console.log('Seeding database...');
    const seedPath = join(__dirname, 'sql', 'seed.sql');
    const seedSQL = fs.readFileSync(seedPath, 'utf8');
    await db.query(seedSQL);
    console.log('Database seeded successfully');

    return true;
};

/**
 * Tests the database connection by running a simple query
 */
const testConnection = async () => {
    const result = await db.query('SELECT NOW() as current_time');
    console.log('Database connection successful: ', result.rows[0].current_time);
    return true;
};

export { setupDatabase, testConnection };