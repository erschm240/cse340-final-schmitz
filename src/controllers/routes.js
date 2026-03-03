import { Router } from 'express';
import { homePage } from './index.js';

// Create a new router instance
const router = Router();

// Homepage
router.get('/', homePage);

export default router;