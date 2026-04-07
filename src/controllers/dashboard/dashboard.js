import { getContactFormsByRecipient, getContactFormsBySentBy } from '../../models/forms/contact.js';
import { getUserById } from '../../models/forms/registration.js';
import { getAllComments, getAllTutorials, getTutorialCommentsBySentBy, getTutorialsByAuthor } from '../../models/tutorials/tutorials.js';

/**
 * Get dashboard data
 */
const getDashboardData = async (req) => {
    const user = req.session.user;
    
    let dashboardContent = {};

    if (user.roleName === 'admin') {
        const commentSentBy = user.username;
        dashboardContent = {
            title: 'Admin Dashboard',
            sessionData: req.session,
            tutorials: await getAllTutorials(),
            tutorialComments: await getAllComments(),
            postedComments: await getTutorialCommentsBySentBy(commentSentBy)

        }
    }

    if (user.roleName === 'instructor') {
        const instructorName = user.name;
        const commentSentBy = user.username;
        dashboardContent = {
            title: 'Instructor Dashboard',
            receivedMessages: await getContactFormsByRecipient(instructorName),
            sentMessages: await getContactFormsBySentBy(instructorName),
            tutorials: await getTutorialsByAuthor(instructorName),
            tutorialComments: await getAllComments(),
            postedComments: await getTutorialCommentsBySentBy(commentSentBy)
        }
    }

    if (user.roleName === 'user') {
        const sentBy = user.name;
        const commentSentBy = user.username;
        dashboardContent = {
            title: 'User Dashboard',
            sentMessages: await getContactFormsBySentBy(sentBy),
            tutorials: await getAllTutorials(),
            tutorialComments: await getAllComments(),
            postedComments: await getTutorialCommentsBySentBy(commentSentBy)
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