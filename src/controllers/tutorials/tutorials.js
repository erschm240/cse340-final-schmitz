import { getAllTutorials, getTutorialBySlug, separateTutorialParagraphs } from '../../models/tutorials/tutorials.js';

// Route handler for tutorial list page
const tutorialListPage = (req, res) => {
    const tutorials = getAllTutorials();
    res.render('tutorials/list', {
        title: 'Tutorials',
        tutorials: tutorials
    });
}

// Route handler for tutorial details page
const tutorialDetailPage = (req, res, next) => {
    const tutorialSlug = req.params.tutorialSlug;

    const tutorial = getTutorialBySlug(tutorialSlug);

    const tutorialParagraphs = separateTutorialParagraphs(tutorialSlug);

    // If the tutorial doesn't exist
    if (!tutorial) {
        const err = new Error(`Tutorial ${tutorialSlug} not found`);
        err.status = 404;
        return next(err);
    }

    res.render('tutorials/details', {
        title: tutorial.title,
        tutorial: {...tutorial},
        paragraphs: tutorialParagraphs
    });
};

export { tutorialListPage, tutorialDetailPage };