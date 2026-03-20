import { getAllInstructors, getInstructorBySlug } from "../../models/instructors/instructors.js";

// Route handler for instructor list page
const instructorListPage = async (req, res) => {
    const instructors = await getAllInstructors();
    
    res.render('instructors/list', {
        title: 'Instructors',
        instructors: instructors
    });
};

// Route handler for instructor details page
const instructorDetailsPage = async (req, res, next) => {
    const instructorSlug = req.params.instructorSlug;

    const instructor = await getInstructorBySlug(instructorSlug);

    // If the instructor doesn't exist
    if (!instructor) {
        const err = new Error(`Instructor ${instructorSlug} not found`);
        err.status = 404;
        return next(err);
    }

    res.render('instructors/details', {
        title: instructor.name,
        instructor: {...instructor}
    });
};

export { instructorListPage, instructorDetailsPage };