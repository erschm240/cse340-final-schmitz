import db from '../db.js';

/**
 * Checks if an email address is already registered in the database
 * @param {string} email - The email address to check
 * @returns {Promise<boolean>} True if email exists, false if not
 */
const emailExists = async (email) => {
    const query = `
        SELECT EXISTS(SELECT 1 FROM users WHERE email = $1) as exists
    `;
    const result = await db.query(query, [email]);
    return result.rows[0].exists;
};

/**
 * Saves a new user to the database with a hashed password
 * 
 * @param {string} name  - The user's full name
 * @param {string} username - The user's chosen username
 * @param {string} email - The user's email address
 * @param {string} hashedPassword - The bcrypt-hashed password
 * @returns {Promise<Object>} The newly created user record (without password)
 */
const saveUser = async (name, username, email, hashedPassword) => {
    const query = `
        INSERT INTO users (name, username, email, password_hash)
        VALUES ($1, $2, $3, $4)
        RETURNING user_id, name, username, email, created_at
    `;
    const result = await db.query(query, [name, username, email, hashedPassword]);
    return result.rows[0];
};

/**
 * Retrieves all registered users from the database
 * 
 * @returns {Promise<Array>} Array of user records (without passwords)
 */
const getAllUsers = async ( ) => {
    const query = `
        SELECT user_id AS "userId", name, username, email, created_at AS "createdAt"
        FROM users
        ORDER BY created_at DESC
    `;
    const result = await db.query(query);
    return result.rows;
};

/**
 * Retrieve a single user by ID with role information
 */
const getUserById = async (id) => {
    const query = `
        SELECT
            users.user_id AS "userId",
            users.name,
            users.username,
            users.email,
            users.created_at AS "createdAt",
            roles.role_name AS "roleName"
        FROM users
        INNER JOIN roles ON users.role_id = roles.id
        WHERE users.user_id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
};

/**
 * Update a user's name and email
 */
const updateUser = async (id, name, username, email) => {
    const query = `
        UPDATE users
        SET name = $1, username = $2, email = $3, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $4
        RETURNING id, name, username, email, updated_at
    `;
    const result = await db.query(query, [name, username, email, id]);
    return result.rows[0] || null;
};

/**
 * Delete a user account
 */
const deleteUser = async (id) => {
    const query = 'DELETE FROM users WHERE user_id = $1';
    const result = await db.query(query, [id]);
    return result.rowCount > 0;
};

export { 
    emailExists,
    saveUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};