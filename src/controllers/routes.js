import { Router } from 'express';
import { homePage } from './index.js';
import { tutorialListPage, tutorialDetailPage } from './tutorials/tutorials.js';

// Create a new router instance
const router = Router();

// Homepage
router.get('/', homePage);

// Tutorial routes
router.get('/tutorials', tutorialListPage);
router.get('/tutorials/:tutorialSlug', tutorialDetailPage);

export default router;