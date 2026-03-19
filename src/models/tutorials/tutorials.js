import db from '../db.js';

/**
 * Get all tutorials from the database.
 * 
 * @returns {Promise<Array>} Array of course objects with department information
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
    return result.rows.map(tutorials => ({
        id: tutorials.id,
        slug: tutorials.slug,
        title: tutorials.title,
        description: tutorials.description,
        lastUpdated: tutorials.last_updated,
        author: tutorials.author,
        likes: tutorials.likes
    }));
};

/**
 * 
 * @param {string} slug - Course slug
 * @returns {Promise<Object>} Tutorial object with steps, or empty object if not found
 */
const getTutorialBySlug = async (slug) => {
    /**
     * Get a single tutorial with the slug, JOIN with tutorial.steps to get the main content for the page.
     * Aliases: 't' for tutorials, 's' for tutorial_steps
     */

    const query = `
        SELECT t.id, t.slug, t.title, t.description, t.last_updated, t.author, t.likes,
            s.step_order, s.img_url, s.text_content
        FROM tutorials t
        JOIN tutorial_steps s ON s.slug = t.slug
        WHERE t.slug = $1
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
        likes: tutorial.likes,
        stepOrder: tutorial.step_order,
        imgUrl: tutorial.img_url,
        textContent: tutorial.text_content
    };
};

/**
 * Wrapper functions
 */

export { getAllTutorials, getTutorialBySlug };