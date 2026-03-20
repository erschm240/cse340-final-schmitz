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
     * Get the steps as an array for a tutorial
     */
    const query = `
        SELECT step_order, slug, img_url, text_content
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
            imgUrl: step.img_url,
            textContent: step.text_content
        }
    });

    return tutorialSteps;
}

export { getAllTutorials, getTutorialBySlug, getTutorialSteps };