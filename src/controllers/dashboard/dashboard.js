import { getContactFormsByRecipient, getContactFormsBySentBy } from '../../models/forms/contact.js';
import { getUserById } from '../../models/forms/registration.js';
import { getAllComments, getAllTutorials, getTutorialsByAuthor } from '../../models/tutorials/tutorials.js';

/**
 * Get dashboard data
 */
const getDashboardData = async (req) => {
    const user = req.session.user;
    
    let dashboardContent = {};

    if (user.roleName === 'admin') {
        dashboardContent = {
            title: 'Admin Dashboard',
            sessionData: req.session,
            tutorials: await getAllTutorials(),
            tutorialComments: await getAllComments()
        }
    }

    if (user.roleName === 'instructor') {
        const instructorName = user.name;
        dashboardContent = {
            title: 'Instructor Dashboard',
            receivedMessages: await getContactFormsByRecipient(instructorName),
            sentMessages: await getContactFormsBySentBy(instructorName),
            tutorials: await getTutorialsByAuthor(instructorName),
            tutorialComments: await getAllComments()
        }
    }

    if (user.roleName === 'user') {
        const sentBy = user.name;
        dashboardContent = {
            title: 'User Dashboard',
            sentMessages: await getContactFormsBySentBy(sentBy)
        }
    }

    return dashboardContent;
};

/**
 * Display protected dashboard
 */
const displayDashboard = async (req, res) => {
    const user = req.session.user;

    const userInfo = await getUserById(user.userId);

    const userComments = await getContactFormsBySentBy(user.username);

    const dashboardContent = await getDashboardData(req);

    res.render('dashboard', {
        title: dashboardContent.title,
        user,
        userInfo,
        userComments,
        dashboardContent
    });
};

export { displayDashboard };