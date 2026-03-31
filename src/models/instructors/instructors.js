import db from '../db.js';

/**
 * Get all instructors from the database
 * 
 * @returns {Promise<Array>} Array of instructor objects
 */
const getAllInstructors = async () => {
    /**
     * Get all the available instructors
     */
    const query = `
        SELECT id, slug, name, username, img_file_type, biography_text, join_date
        FROM instructors
    `;

    const result = await db.query(query);

    /**
     * Map database rows to JavaScript objects with camelCase property names.
     */
    return result.rows.map(instructor => ({
        id: instructor.id,
        slug: instructor.slug,
        name: instructor.name,
        username: instructor.username,
        imgFileType: instructor.img_file_type,
        biographyText: instructor.biography_text,
        joinDate: instructor.join_date
    }));
};

/**
 * @param {string} slug - Instructor slug
 * @returns {Promise<Object>} Instructor object or empty object if not found
 */
const getInstructorBySlug = async (slug) => {
    /**
     * Get a single instructor by slug
     */
    const query = `
        SELECT id, slug, name, username, img_file_type, biography_text, join_date
        FROM instructors
        WHERE slug = $1
    `;

    const result = await db.query(query, [slug]);

    /**
     * Only return something if the object exists
     */
    if (result.rows.length === 0) return {};

    const instructor = result.rows[0];

    return {
        id: instructor.id,
        instructorSlug: instructor.slug,
        title: instructor.title,
        description: instructor.description,
        lastUpdated: instructor.last_updated,
        author: instructor.author,
        likes: instructor.likes
    };
};

export { getAllInstructors, getInstructorBySlug };