import { validationResult } from 'express-validator';
import { getAllTutorials, getTutorialBySlug, getTutorialSteps,  getTutorialComments, createTutorialComment } from '../../models/tutorials/tutorials.js';

// Route handler for tutorial list page
const tutorialListPage = async (req, res) => {
    const tutorials = await getAllTutorials();
    
    res.render('tutorials/list', {
        title: 'Tutorials',
        tutorials: tutorials
    });
}

// Route handler for tutorial details page
const tutorialDetailsPage = async (req, res, next) => {
    const tutorialSlug = req.params.tutorialSlug;

    const tutorial = await getTutorialBySlug(tutorialSlug);

    // If the tutorial doesn't exist
    if (!tutorial) {
        const err = new Error(`Tutorial ${tutorialSlug} not found`);
        err.status = 404;
        return next(err);
    }

    const tutorialSteps = await getTutorialSteps(tutorialSlug);

    const tutorialComments = await getTutorialComments(tutorialSlug);

    res.render('tutorials/details', {
        title: tutorial.title,
        tutorial: {...tutorial},
        steps: {...tutorialSteps},
        comments: {...tutorialComments}
    });
};

const handleCommentSubmission = async (req, res) => {
    const tutorialSlug = req.params.tutorialSlug;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });
        return res.redirect(`${tutorialSlug}`);
    }

    // Extract validated data
    const sentBy = req.session.user.username;
    const {subject, message} = req.body;
    const postedIn = req.params.tutorialSlug;

    try {
        // Save to database
        await createTutorialComment(sentBy, message, postedIn);
        // No flash msg since they will see the comment
        res.redirect(`${tutorialSlug}/#tutorial-comments`);
    } catch (error) {
        console.error('Error posting comment: ', error);
        req.flash('error', 'Unable to comment. Please try again later.');
        res.redirect(`${tutorialSlug}`);
    }
};

export { tutorialListPage, tutorialDetailsPage, handleCommentSubmission };