import db from "../db.js";

/**
 * 
 * @returns {Promise<Object|null>} Object of tutorial objects
 */
const getDashboardTutorials = async () => {
    const query = `
        SELECT (id, slug, title, last_updated, author)
        FROM tutorials
    `;

    const result = await db.query(query);

    return result.rows.map(tutorial => ({
        id: tutorial.id,
        slug: tutorial.slug,
        title: tutorial.title,
        lastUpdated: tutorial.last_updated,
        author: tutorial.author
    }));
};

/**
 * 
 * @returns {Promise<Object|null>} Object of comment objects
 */

const getDashboardTutorialComments = async () => {
    const query = `
        SELECT (id, sent_by, message, posted_in, created_at)
        FROM tutorial_comments
    `;

    const result = await db.query(query);

    return result.rows.map(comment => ({
        id: comment.id,
        sentBy: comment.sent_by,
        message: comment.message,
        postedIn: comment.posted_in,
        createdAt: comment.created_at
    }));
};

export { getDashboardTutorials, getDashboardTutorialComments };