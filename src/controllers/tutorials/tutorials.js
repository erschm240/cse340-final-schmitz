import { getAllTutorials, getTutorialBySlug, getTutorialSteps } from '../../models/tutorials/tutorials.js';

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
    // console.log('Steps: ', tutorialSteps);

    res.render('tutorials/details', {
        title: tutorial.title,
        tutorial: {...tutorial},
        steps: {...tutorialSteps}
    });
};

export { tutorialListPage, tutorialDetailsPage };