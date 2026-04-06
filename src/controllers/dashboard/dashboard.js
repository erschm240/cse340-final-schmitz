import { getDashboardTutorialComments, getDashboardTutorials } from '../../models/dashboard/dashboard.js';
import { Router } from 'express';
import { requireLogin, requireRole } from '../../middleware/auth.js';
import { getContactFormsByRecipient, getContactFormsBySentBy } from '../../models/forms/contact.js';

const router = Router();

/**
 * Display protected dashboard
 */
const displayAdminDashboard = async (req, res) => {
    const user = req.session.user;
    const sessionData = req.session;

    const dashboardTutorials = await getDashboardTutorials();

    const dashboardTutorialComments = await getDashboardTutorialComments();

    res.render('dashboard/admin', {
        title: 'Admin Dashboard',
        user,
        dashboardTutorials: dashboardTutorials,
        dashboardTutorialComments: dashboardTutorialComments,
        sessionData
    });
};

const displayInstructorDashboard = async (req, res) => {
    const user = req.session.user;
    const recipient = user.name;

    const dashboardTutorials = await getDashboardTutorials();

    const instructorContactMessages = await getContactFormsByRecipient(recipient);

    res.render('dashboard/instructor', {
        title: 'Instructor Dashboard',
        user,
        dashboardTutorials,
        instructorContactMessages
    });
};

const displayUserDashboard = async (req, res) => {
    const user = req.session.user;
    const sentBy = user.name;

    const userContactMessages = await getContactFormsBySentBy(sentBy);

    res.render('dashboard/user', {
        title: 'Dashboard',
        user,
        userContactMessages
    });
};

/**
 * GET /dashboard/admin - Display the admin dashboard
 */
router.get('/admin', requireLogin, requireRole(['admin']), displayAdminDashboard);

/**
 * GET /dashboard/instructor - Display the instructor dashboard
 */
router.get('/instructor', requireLogin, requireRole(['admin', 'instructor']), displayInstructorDashboard);

/**
 * GET /dashboard/user - Display the user dashboard
 */
router.get('/user', requireLogin, requireRole(['admin', 'user']), displayUserDashboard);

export default router;