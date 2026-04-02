import db from '../db.js';

/**
 * Inserts a new contact form submission into the database
 * 
 * @param {string} subject - Subject of the contact message
 * @param {string} message - Message content
 * @returns {Promise<Object>} Newly created contact form record
 */
const createContactForm = async (recipient, messageType, subject, message, sentBy) => {
    const query = `
        INSERT INTO contact_form (recipient, message_type, subject, message, sent_by)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `;
    const result = await db.query(query, [recipient, messageType, subject, message, sentBy]);
    return result.rows[0];
};

const getAllContactForms = async () => {
    const query = `
        SELECT id, recipient, message_type, subject, message, sent_by, submitted
        FROM contact_form
        ORDER BY submitted DESC
    `;
    const result = await db.query(query);
    return result.rows;
};

const getAllPossibleRecipients = async () => {
    const query = `
        SELECT name, username
        FROM users
        WHERE role_id = 2 OR role_id = 3
    `;
    const result = await db.query(query);
    return result.rows;
}

export { createContactForm, getAllContactForms, getAllPossibleRecipients };