import { Router } from 'express';
import { homePage } from './index.js';
import { tutorialListPage, tutorialDetailsPage, handleCommentSubmission } from './tutorials/tutorials.js';
import { instructorListPage } from './instructors/instructors.js';
import { processLogout } from './forms/login.js';
import contactRoutes from './forms/contact.js';
import registrationRoutes from './forms/registration.js';
import loginRoutes from './forms/login.js';
import { displayDashboard } from '../controllers/dashboard/dashboard.js';
import { commentValidation } from '../middleware/validation/forms.js';
import { requireLogin, requireRole } from '../middleware/auth.js';

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

// Add dashboard-specific styles
router.use('/dashboard', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/dashboard.css">');
    next();
})

// Homepage
router.get('/', homePage);

// Tutorial routes
router.get('/tutorials', tutorialListPage);
router.get('/tutorials/:tutorialSlug', tutorialDetailsPage);
// POST /tutorials/:tutorialSlug - Handle comment form submission with validation
router.post('/tutorials/:tutorialSlug', commentValidation, handleCommentSubmission, tutorialDetailsPage);

// Instructor routes
router.get('/instructors', instructorListPage);

// Contact routes
router.use('/contact', contactRoutes);

// Registration routes
router.use('/register', registrationRoutes);

// Login routes (form and submission)
router.use('/login', loginRoutes);

// Authentication related routes
router.get('/logout', processLogout);

router.get('/dashboard', requireLogin, requireRole(['admin', 'instructor', 'user']), displayDashboard);

export default router;