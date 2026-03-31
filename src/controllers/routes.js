import { Router } from 'express';
import { homePage } from './index.js';
import { tutorialListPage, tutorialDetailsPage, handleCommentSubmission } from './tutorials/tutorials.js';
import { instructorListPage, instructorDetailsPage } from './instructors/instructors.js';
import { processLogout, displayDashboard } from './forms/login.js';
import { requireLogin } from '../middleware/auth.js';
import contactRoutes from './forms/contact.js';
import registrationRoutes from './forms/registration.js';
import loginRoutes from './forms/login.js';
import { commentValidation } from '../middleware/validation/forms.js';

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

// Add contact-specific styles
router.use('/contact', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/contact.css">');
    next();
});

// Add registration-specific styles
router.use('/register', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/registration.css">');
    next();
});

// Add login-specific styles
router.use('/login', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/login.css">');
    next();
});

// Homepage
router.get('/', homePage);

// Tutorial routes
router.get('/tutorials', tutorialListPage);
router.get('/tutorials/:tutorialSlug', tutorialDetailsPage);
// POST /tutorials/:tutorialSlug - Handle comment form submission with validation
router.post('/tutorials/:tutorialSlug', commentValidation, handleCommentSubmission, tutorialDetailsPage);

// Instructor routes
router.get('/instructors', instructorListPage);
router.get('/instructors/:instructorSlug', instructorDetailsPage);

// Contact routes
router.use('/contact', contactRoutes);

// Registration routes
router.use('/register', registrationRoutes);

// Login routes (form and submission)
router.use('/login', loginRoutes);

// Authentication related routes
router.get('/logout', processLogout);
router.get('/dashboard', requireLogin, displayDashboard);

export default router;