import db from '../db.js';

/**
 * Get all tutorials from the database
 * 
 * @returns {Promise<Array>} Array of tutorial objects
 */
const getAllTutorials = async () => {
    /**
     * Get all the available tutorials
     */
    const query = `
        SELECT id, slug, title, description, last_updated, author, likes
        FROM tutorials
    `;

    const result = await db.query(query);

    /**
     * Map database rows to JavaScript objects with camelCase property names.
     */
    return result.rows.map(tutorial => ({
        id: tutorial.id,
        slug: tutorial.slug,
        title: tutorial.title,
        description: tutorial.description,
        lastUpdated: tutorial.last_updated,
        author: tutorial.author,
        likes: tutorial.likes
    }));
};

/**
 * 
 * @param {string} slug - Tutorial slug
 * @returns {Promise<Object>} Tutorial object or empty object if not found
 */
const getTutorialBySlug = async (slug) => {
    /**
     * Get a single tutorial by slug
     */
    const query = `
        SELECT id, slug, title, description, last_updated::date, author, likes
        FROM tutorials
        WHERE slug = $1
    `;

    const result = await db.query(query, [slug]);

    /**
     * Only return something if the object exists
     */
    if (result.rows.length === 0) return {};

    const tutorial = result.rows[0];

    return {
        id: tutorial.id,
        tutorialSlug: tutorial.slug,
        title: tutorial.title,
        description: tutorial.description,
        lastUpdated: tutorial.last_updated,
        author: tutorial.author,
        likes: tutorial.likes
    };
};

/**
 * 
 * @param {string} slug - Tutorial slug
 * @returns {Promise<Object>} Tutorial steps object or empty object if not found
 */
const getTutorialSteps = async (slug) => {
    /**
     * Get a tutorial's steps as an array
     */
    const query = `
        SELECT step_order, slug, img_file_type, text_content
        FROM tutorial_steps
        WHERE slug = $1
    `;

    const result = await db.query(query, [slug]);

    /**
     * Only return something if the object exists
     */
    if (result.rows.length === 0) return {};

    const tutorialSteps = result.rows.map(step => {
        return {
            stepOrder: step.step_order,
            slug: step.slug,
            imgFileType: step.img_file_type,
            textContent: step.text_content
        };
    });

    return tutorialSteps;
};

/**
 * 
 * @param {string} sentBy - Username of the user who posted
 * @param {string} message - Text content of the comment
 * @param {string} postedIn - Slug of the tutorial the comment was posted in
 * @returns {Promise<Object>} Newly created comment
 */
const createTutorialComment = async (sentBy, message, postedIn) => {
    const query = `
        INSERT INTO tutorial_comments (sent_by, message, posted_in)
        VALUES ($1, $2, $3)
        RETURNING *
    `;
    const result = await db.query(query, [sentBy, message, postedIn]);
    return result.rows[0];
};

/**
 * 
 * @param {string} postedIn - Slug of the tutorial the comment was posted in
 * @returns {Promise<Object>} Tutorial comments object or empty object if not found
 */
const getTutorialComments = async (postedIn) => {
    /**
     * Get the tutorial comments as an array
     */
    const query = `
        SELECT id, sent_by AS "sentBy", message, posted_in AS "postedIn", created_at AS "createdAt"
        FROM tutorial_comments
        WHERE posted_in = $1
    `;

    const result = await db.query(query, [postedIn]);

    /**
     * Only return something if the object exists
     */
    if (result.rows.length === 0) return {};

    const tutorialComments = result.rows.map(comment => {
        return {
            id: comment.id,
            sentBy: comment.sentBy,
            message: comment.message,
            postedIn: comment.postedIn,
            createdAt: comment.createdAt
        };
    });

    return tutorialComments;
};

export { getAllTutorials, getTutorialBySlug, getTutorialSteps, createTutorialComment, getTutorialComments };