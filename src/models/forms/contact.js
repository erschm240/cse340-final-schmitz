import db from '../db.js';

/**
 * Inserts a new contact form submission into the database
 * 
 * @param {string} subject - Subject of the contact message
 * @param {string} message - Message content
 * @returns {Promise<Object>} Newly created contact form record
 */
const createContactForm = async (recipient, subjectType, subject, message) => {
    const query = `
        INSERT INTO contact_form (recipient, subject_type, subject, message)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `;
    const result = await db.query(query, [recipient, subjectType, subject, message]);
    return result.rows[0];
};

const getAllContactForms = async () => {
    const query = `
        SELECT id, recipient, subject_type, subject, message, submitted
        FROM contact_form
        ORDER BY submitted DESC
    `;
    const result = await db.query(query);
    return result.rows;
};

export { createContactForm, getAllContactForms };