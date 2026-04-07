import { validationResult } from 'express-validator';
import { getAllTutorials, getTutorialBySlug, getTutorialSteps,  getTutorialComments, createTutorialComment, updateTutorial, deleteTutorial, deleteTutorialSteps, deleteTutorialComments } from '../../models/tutorials/tutorials.js';

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

const displayEditTutorial = async (req, res) => {
    const tutorialSlug = req.params.tutorialSlug;
    const tutorial = await getTutorialBySlug(tutorialSlug);

    res.render('tutorials/edit', {
        title: 'Edit Tutorial Text',
        tutorial
    });
};

const processEditTutorial = async (req, res) => {
    const errors = validationResult(req);
    const tutorialSlug = req.params.tutorialSlug;
    const userRole = req.session.user.roleName;

    if (!errors.isEmpty()) {
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });
    return res.redirect(`/tutorials/${tutorialSlug}/edit`);
    }

    const {slug, title, description} = req.body;

    try {
        const tutorial = await getTutorialBySlug(tutorialSlug);

        if (!tutorial) {
            req.flash('error', 'Tutorial not found');
            return res.redirect('/dashboard');
        }

        // Check permissions
        const canEdit = userRole === 'admin';

        if (!canEdit) {
            req.flash('error', 'You do not have permission to edit this tutorial');
            return res.redirect('/dashboard');
        };

        // Update tutorial
        const tutorialId = tutorial.id;
        await updateTutorial(tutorialId, slug, title, description);

        req.flash('success', 'Tutorial updated successfully');
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Error updating tutorial: ', error);
        req.flash('error', 'An error occurred while updating the tutorial');
        res.redirect(`/tutorials/${tutorialSlug}/edit`);
    }
};

const processDeleteTutorial = async (req, res) => {
    const tutorialSlug = req.params.tutorialSlug;
    const userRole = req.session.user.roleName;

    if (userRole !== 'admin') {
        req.flash('error', 'You do not have permission to delete this tutorial');
        return res.redirect('/dashboard');
    }

    try {
        const deletedComments = await deleteTutorialComments(tutorialSlug);
        const deletedSteps = await deleteTutorialSteps(tutorialSlug);
        const deleted = await deleteTutorial(tutorialSlug);

        if (deleted) {
            req.flash('success', 'Tutorial deleted successfully');
        } else {
            req.flash('error', 'Tutorial not found or already deleted');
        }
    } catch (error) {
        console.error('Error deleting tutorial: ', error);
        req.flash('error', 'An error occurred while deleting the tutorial');
    }

    return res.redirect('/dashboard');
};

export { tutorialListPage, tutorialDetailsPage, handleCommentSubmission, displayEditTutorial, processEditTutorial, processDeleteTutorial };