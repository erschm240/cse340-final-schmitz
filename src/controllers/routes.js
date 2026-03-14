import { Router } from 'express';
import { homePage } from './index.js';
import { tutorialListPage, tutorialDetailsPage } from './tutorials/tutorials.js';
import { instructorListPage, instructorDetailsPage } from './instructors/instructors.js';

// Create a new router instance
const router = Router();

// Add tutorial-specific styles
router.use('/tutorials', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/tutorials.css">');
    next();
});

// Add instructor-specific styles
router.use('/instructors', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/instructors.css">');
    next();
});

// Homepage
router.get('/', homePage);

// Tutorial routes
router.get('/tutorials', tutorialListPage);
router.get('/tutorials/:tutorialSlug', tutorialDetailsPage);

// Instructor routes
router.get('/instructors', instructorListPage);
router.get('/instructors/:instructorSlug', instructorDetailsPage);

export default router;