import db from "../models/db.js";

/**
 * Removes expired sessions from the database
 */
const cleanupExpiredSessions = async ( ) => {
    try {
        const result = await db.query(
            `DELETE FROM session WHERE expire < NOW()`
        );

        if (result.rowCount > 0) {
        console.log(`Cleaned up ${result.rowCount} expired sessions`);
    }
    } catch (error) {
        // Check if the error is due to the table not existing (PostgreSQL erorr code 42P01)
        if (error.code === '42P01') {
            console.log('Session table does not exist yet:\nIt will be created when the first session is initalized.');
            return;
        }

        // Log actual errors
        console.error('Error cleaning up sessions: ', error);
    }
};

/**
 * Starts automatic session cleanup that runs every 24 hours, runs immediately on startup to handle any sessions that expired while the server was offline.
 */
const startSessionCleanup = ( ) => {
    // Run cleanup immediately in startup
    cleanupExpiredSessions();

    // Schedule cleanup to run every 12 hours
    const twelveHours = 12 * 60 * 60 * 1000;
    setInterval(cleanupExpiredSessions, twelveHours);

    console.log('Session cleanup scheduled to run every 12 hours');
};

export { startSessionCleanup };