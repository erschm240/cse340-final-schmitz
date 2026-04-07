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
        SELECT id, recipient, message_type AS "messageType", subject, message, sent_by AS "sentBy", submitted, status
        FROM contact_form
        ORDER BY submitted DESC
    `;
    const result = await db.query(query);
    return result.rows;
};

const getContactFormById = async (id) => {
    const query = `
        SELECT id, recipient, message_type AS "messageType", subject, message, sent_by AS "sentBy", submitted, status
        FROM contact_form
        WHERE id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
};

const getContactFormsByRecipient = async (recipient) => {
    const query = `
        SELECT id, recipient, message_type AS "messageType", subject, message, sent_by AS "sentBy", submitted, status
        FROM contact_form
        WHERE recipient = $1
    `;
    const result = await db.query(query, [recipient]);
    return result.rows;
};

const getContactFormsBySentBy = async (sentBy) => {
    const query = `
        SELECT id, recipient, message_type AS "messageType", subject, message, sent_by AS "sentBy", submitted, status
        FROM contact_form
        WHERE sent_by = $1
    `;
    const result = await db.query(query, [sentBy]);
    return result.rows;
};

const getAllPossibleRecipients = async () => {
    const query = `
        SELECT name
        FROM users
        WHERE role_id = 2 OR role_id = 3
    `;
    const result = await db.query(query);
    return result.rows;
};

/**
 * Update a contact message's status
 */
const updateStatus = async (id, status) => {
    const query = `
        UPDATE contact_form
        SET status = $2
        WHERE id = $1
        RETURNING status
    `;
    const result = await db.query(query, [id, status]);
    return result.rows[0] || null;
};

/**
 * Delete a contact message
 */
const deleteContactMessage = async (id) => {
    const query = 'DELETE FROM contact_form WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rowCount > 0;
};

export { createContactForm, getAllContactForms, getContactFormById, getContactFormsByRecipient, getContactFormsBySentBy, getAllPossibleRecipients, updateStatus, deleteContactMessage };